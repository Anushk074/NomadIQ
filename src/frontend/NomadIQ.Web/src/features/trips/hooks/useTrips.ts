import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { getTrips } from "../api/tripsApi";
import type { TripResponse } from "../types";

export type TripsListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; trips: TripResponse[] };

// Fetches the current user's trips. Used by both the Trips list page and
// the Dashboard, so the fetch/loading/error/retry logic lives in one place.
export function useTrips(): { state: TripsListState; retry: () => void } {
  const [state, setState] = useState<TripsListState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const handleUnauthorized = useHandleUnauthorized();

  useEffect(() => {
    let cancelled = false;

    getTrips()
      .then((trips) => {
        if (!cancelled) {
          setState({ status: "success", trips });
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

        // Never surface a raw error/exception message - only the typed,
        // backend-provided message (via ApiError) or a generic fallback.
        const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, handleUnauthorized]);

  const retry = useCallback(() => {
    // Reset to loading here (the event that caused the change) rather than
    // inside the effect, so the retry click gives immediate feedback.
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
