import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { getDestination } from "../api/discoveryApi";
import type { DestinationResponse } from "../types";

export type DestinationState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; destination: DestinationResponse };

// Loads one destination by id (GET /api/destinations/{id}) so the detail
// page supports deep links and refresh. The page keys its subtree by
// destinationId so a different id remounts this hook.
export function useDestination(destinationId: string): { state: DestinationState; retry: () => void } {
  const [state, setState] = useState<DestinationState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getDestination(destinationId)
      .then((destination) => {
        if (!cancelled) {
          setState({ status: "success", destination });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
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
  }, [destinationId, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
