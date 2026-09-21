import { useCallback } from "react";
import type { TripResponse } from "../../trips/types";
import { useAssistantTrip } from "../hooks/useAssistantTrip";
import { useConversation } from "../hooks/useConversation";
import {
  AssistantErrorState,
  AssistantLoadingState,
  AssistantTripNotFound,
} from "./AssistantStates";
import { AssistantTripPanel } from "./AssistantTripPanel";
import { MessageComposer } from "./MessageComposer";
import { MessageList } from "./MessageList";
import { TripSelector } from "./TripSelector";

// One trip's assistant: the conversation (from AIService) beside the trip
// itself (from TripService). Keyed by tripId in the page, so a different
// trip always starts from clean state and messages cannot mix.
export function AssistantWorkspace({
  tripId,
  trips,
  onSelectTrip,
}: {
  tripId: string;
  trips: TripResponse[];
  onSelectTrip: (tripId: string) => void;
}) {
  const tripCtl = useAssistantTrip(tripId);
  const { refresh } = tripCtl;

  // After an assistant action the trip is re-fetched from TripService; it is
  // never edited locally from the assistant's reply.
  const handleActionExecuted = useCallback(() => {
    void refresh();
  }, [refresh]);

  const conversation = useConversation(tripId, handleActionExecuted);
  const isSending = conversation.send.status === "sending";

  function handleCheckAfterUnknownOutcome() {
    void conversation.reloadHistory();
    void tripCtl.refresh();
  }

  return (
    <div>
      <TripSelector trips={trips} value={tripId} disabled={isSending} onChange={onSelectTrip} />

      {tripCtl.state.status === "not-found" ? (
        <AssistantTripNotFound />
      ) : (
        <div className="assistant-layout">
          <section className="assistant-chat" aria-label="Conversation with the AI assistant">
            <p className="panel-label">Conversation — AI assistant</p>

            {conversation.actionExecuted && (
              <p className="form-success" role="status">
                <strong>Action performed:</strong> the assistant changed this trip. The trip data was reloaded from
                TripService.
              </p>
            )}

            {conversation.history.status === "loading" && <AssistantLoadingState message="Loading conversation…" />}

            {(conversation.history.status === "error" || conversation.history.status === "not-found") && (
              <AssistantErrorState
                title="We couldn't load the conversation"
                message={
                  conversation.history.status === "error"
                    ? conversation.history.message
                    : "This conversation could not be found."
                }
                onRetry={conversation.retryHistory}
              />
            )}

            {conversation.history.status === "success" && (
              <MessageList
                messages={conversation.history.messages}
                pendingText={conversation.send.status === "sending" ? conversation.send.text : null}
                transient={conversation.transient}
              />
            )}

            {conversation.historyStale && (
              <div className="warning-banner" role="alert">
                <p>The conversation could not be reloaded from the server, so the latest messages shown are temporary.</p>
                <button type="button" className="btn btn-small" onClick={() => void conversation.reloadHistory()}>
                  Reload conversation
                </button>
              </div>
            )}

            {conversation.send.status === "error" && (
              <div className="dashboard-error" role="alert">
                <p>{conversation.send.message}</p>
                {conversation.send.outcomeUnknown ? (
                  <>
                    <p>
                      Your message may or may not have been processed, and the assistant may already have changed your
                      trip. Check the conversation and trip data before sending it again.
                    </p>
                    <button type="button" className="btn btn-small" onClick={handleCheckAfterUnknownOutcome}>
                      Check conversation and trip
                    </button>
                  </>
                ) : (
                  <p>Your message was not sent. It is still in the box below so you can try again.</p>
                )}
              </div>
            )}

            <MessageComposer disabled={isSending || conversation.history.status === "loading"} onSend={conversation.sendMessageText} />
          </section>

          <div className="assistant-side">
            {tripCtl.state.status === "loading" && <AssistantLoadingState message="Loading trip…" />}

            {tripCtl.state.status === "error" && (
              <AssistantErrorState
                title="We couldn't load the trip"
                message={tripCtl.state.message}
                onRetry={tripCtl.retry}
              />
            )}

            {tripCtl.state.status === "success" && (
              <AssistantTripPanel
                trip={tripCtl.state.trip}
                warning={tripCtl.refreshWarning}
                isRefreshing={tripCtl.isRefreshing}
                onRetryRefresh={() => void tripCtl.refresh()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
