import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { getTrip } from "../api/tripsApi";
import type { TripResponse } from "../types";

export type TripDetailsState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; trip: TripResponse };

// Fetches a single trip by id. The consuming page keys its subtree by
// tripId (see TripDetailsPage) so a different id fully remounts this hook
// instead of trying to reconcile state across ids.
export function useTripDetails(tripId: string): { state: TripDetailsState; retry: () => void } {
  const [state, setState] = useState<TripDetailsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
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

  return { state, retry };
}
