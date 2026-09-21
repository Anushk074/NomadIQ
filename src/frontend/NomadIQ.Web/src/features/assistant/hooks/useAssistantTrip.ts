import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { getTrip } from "../../trips/api/tripsApi";
import type { TripResponse } from "../../trips/types";

export type AssistantTripState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; trip: TripResponse };

const REFRESH_WARNING =
  "The latest trip data could not be loaded from TripService. The trip shown may be out of date.";

// Loads the selected trip from TripService - the only source of trip data
// on the assistant page. Kept separate from useTripDetails on purpose:
// after an assistant action, a failed refresh must keep the last known
// trip visible with a warning instead of replacing it with an error state.
// The trip is only ever replaced by a fresh TripService response, never by
// anything derived from an assistant reply.
export function useAssistantTrip(tripId: string): {
  state: AssistantTripState;
  refreshWarning: string | null;
  isRefreshing: boolean;
  retry: () => void;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<AssistantTripState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [refreshWarning, setRefreshWarning] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleUnauthorized = useHandleUnauthorized();

  useEffect(() => {
    let cancelled = false;

    getTrip(tripId)
      .then((trip) => {
        if (!cancelled) {
          setState({ status: "success", trip });
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
          setState({ status: "not-found" });
          return;
        }

        const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [tripId, attempt, handleUnauthorized]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  // Re-fetches from TripService. On failure the previous trip stays in
  // `state` and `refreshWarning` is set; a later successful call clears it.
  const refresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const trip = await getTrip(tripId);
      setState({ status: "success", trip });
      setRefreshWarning(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
        return;
      }

      setRefreshWarning(REFRESH_WARNING);
    } finally {
      setIsRefreshing(false);
    }
  }, [tripId, handleUnauthorized]);

  return { state, refreshWarning, isRefreshing, retry, refresh };
}
