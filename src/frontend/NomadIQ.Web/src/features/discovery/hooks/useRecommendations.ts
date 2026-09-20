import { useCallback, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { getRecommendations } from "../api/discoveryApi";
import type { DestinationRecommendationRequest, RecommendedDestinationResponse } from "../types";

export type RecommendationsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; results: RecommendedDestinationResponse[] };

// Submits a recommendation request. Results are only ever what the backend
// returned; nothing is scored or ranked client-side. `lastRequest` lets the
// error state offer a retry without asking the user to resubmit the form.
export function useRecommendations(): {
  state: RecommendationsState;
  submit: (request: DestinationRecommendationRequest) => Promise<void>;
  retry: () => void;
} {
  const [state, setState] = useState<RecommendationsState>({ status: "idle" });
  const [lastRequest, setLastRequest] = useState<DestinationRecommendationRequest | null>(null);

  const submit = useCallback(async (request: DestinationRecommendationRequest) => {
    setLastRequest(request);
    setState({ status: "loading" });

    try {
      const results = await getRecommendations(request);
      setState({ status: "success", results });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      setState({ status: "error", message });
    }
  }, []);

  const retry = useCallback(() => {
    if (lastRequest) {
      void submit(lastRequest);
    }
  }, [lastRequest, submit]);

  return { state, submit, retry };
}
