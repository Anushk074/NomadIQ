import { useCallback, useRef, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { createTripPlan } from "../api/plannerApi";
import type { TripPlanRequest, TripPlanResponse } from "../types";

export type PlannerState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; plan: TripPlanResponse; request: TripPlanRequest };

// 400 and 502 carry backend-authored, user-safe messages (the raw provider
// `detail` is never read). Everything else - unhandled 500s (e.g. Discovery
// unavailable) and network failures - gets generic copy.
function messageFor(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 502) {
      return error.message;
    }

    return "The trip planner ran into a problem. Please try again in a moment.";
  }

  return "We couldn't reach the trip planner. Check your connection and try again.";
}

// Runs one generation at a time. The result lives only in this hook's state:
// it is a stateless preview, never saved, and disappears on navigation or
// refresh. `lastRequest` powers the error state's retry.
export function useTripPlanner(): {
  state: PlannerState;
  generate: (request: TripPlanRequest) => Promise<void>;
  retry: () => void;
  reset: () => void;
} {
  const [state, setState] = useState<PlannerState>({ status: "idle" });
  const [lastRequest, setLastRequest] = useState<TripPlanRequest | null>(null);
  const inFlight = useRef(false);
  const handleUnauthorized = useHandleUnauthorized();

  const generate = useCallback(
    async (request: TripPlanRequest) => {
      // Each generation spends AI quota, so never run two at once.
      if (inFlight.current) {
        return;
      }

      inFlight.current = true;
      setLastRequest(request);
      setState({ status: "loading" });

      try {
        const plan = await createTripPlan(request);
        setState({ status: "success", plan, request });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          handleUnauthorized();
          return;
        }

        setState({ status: "error", message: messageFor(error) });
      } finally {
        inFlight.current = false;
      }
    },
    [handleUnauthorized],
  );

  const retry = useCallback(() => {
    if (lastRequest) {
      void generate(lastRequest);
    }
  }, [lastRequest, generate]);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, generate, retry, reset };
}
