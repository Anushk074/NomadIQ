import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { getDestinations } from "../api/discoveryApi";
import type { DestinationResponse } from "../types";

export type DestinationsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; destinations: DestinationResponse[] };

// Loads the destination catalog. DiscoveryService is public, so there is no
// 401 handling here.
export function useDestinations(): { state: DestinationsState; retry: () => void } {
  const [state, setState] = useState<DestinationsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getDestinations()
      .then((destinations) => {
        if (!cancelled) {
          setState({ status: "success", destinations });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
