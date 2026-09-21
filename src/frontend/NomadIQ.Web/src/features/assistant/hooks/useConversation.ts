import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { getMessages, sendMessage } from "../api/assistantApi";
import type { ConversationMessage } from "../types";

export type HistoryState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; messages: ConversationMessage[] };

export type SendState =
  | { status: "idle" }
  | { status: "sending"; text: string }
  | { status: "error"; message: string; outcomeUnknown: boolean };

// Shown only until history is reloaded from AIService; never persisted here.
export interface TransientExchange {
  userText: string;
  reply: string;
}

const GENERIC_ERROR = "The assistant ran into a problem. Please try again in a moment.";
const NETWORK_ERROR = "We couldn't reach the assistant. Check your connection and try again.";

// 400/404/502 are rejected before anything is saved or applied, so a retry
// is safe. Anything else (unhandled 500s, network failures) may have
// happened after the assistant changed the trip - sends are not idempotent.
function describeSendError(error: unknown): { message: string; outcomeUnknown: boolean } {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 502) {
      return { message: error.message, outcomeUnknown: false };
    }

    if (error.status === 404) {
      return { message: "This trip could not be found.", outcomeUnknown: false };
    }

    return { message: GENERIC_ERROR, outcomeUnknown: true };
  }

  return { message: NETWORK_ERROR, outcomeUnknown: true };
}

// Conversation history is owned by AIService: it is loaded with GET and
// reloaded after every send. Nothing is stored in localStorage or in a
// second frontend store. The caller keys this hook by tripId, so messages
// can never be shared between trips.
export function useConversation(
  tripId: string,
  onActionExecuted: () => void,
): {
  history: HistoryState;
  send: SendState;
  transient: TransientExchange | null;
  actionExecuted: boolean;
  historyStale: boolean;
  sendMessageText: (text: string) => Promise<boolean>;
  retryHistory: () => void;
  reloadHistory: () => Promise<void>;
} {
  const [history, setHistory] = useState<HistoryState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [send, setSend] = useState<SendState>({ status: "idle" });
  const [transient, setTransient] = useState<TransientExchange | null>(null);
  const [actionExecuted, setActionExecuted] = useState(false);
  const [historyStale, setHistoryStale] = useState(false);
  const inFlight = useRef(false);
  const handleUnauthorized = useHandleUnauthorized();

  useEffect(() => {
    let cancelled = false;

    getMessages(tripId)
      .then((messages) => {
        if (!cancelled) {
          setHistory({ status: "success", messages });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setHistory({ status: "not-found" });
          return;
        }

        const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
        setHistory({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [tripId, attempt, handleUnauthorized]);

  const retryHistory = useCallback(() => {
    setHistory({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  // Re-reads history from AIService without dropping to a loading state.
  const reloadHistory = useCallback(async () => {
    try {
      const messages = await getMessages(tripId);
      setHistory({ status: "success", messages });
      setTransient(null);
      setHistoryStale(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
        return;
      }

      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      setHistory((prev) => (prev.status === "success" ? prev : { status: "error", message }));
      setHistoryStale(true);
    }
  }, [tripId, handleUnauthorized]);

  // Resolves true when the send succeeded (so the composer can clear).
  const sendMessageText = useCallback(
    async (text: string): Promise<boolean> => {
      // One request at a time: each send calls the AI provider and may
      // apply a trip change.
      if (inFlight.current) {
        return false;
      }

      inFlight.current = true;
      setSend({ status: "sending", text });
      setActionExecuted(false);

      try {
        const response = await sendMessage(tripId, text);

        setSend({ status: "idle" });
        setTransient({ userText: text, reply: response.reply });

        // Only the backend's explicit flag is trusted - reply text is never
        // inspected. The trip itself is re-fetched by the caller.
        if (response.actionExecuted === true) {
          setActionExecuted(true);
          onActionExecuted();
        }

        await reloadHistory();
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          handleUnauthorized();
          return false;
        }

        setSend({ status: "error", ...describeSendError(error) });
        return false;
      } finally {
        inFlight.current = false;
      }
    },
    [tripId, onActionExecuted, reloadHistory, handleUnauthorized],
  );

  return { history, send, transient, actionExecuted, historyStale, sendMessageText, retryHistory, reloadHistory };
}
