import { discoveryApiClient } from "../../../api/discoveryApi";
import type {
  DestinationRecommendationRequest,
  DestinationResponse,
  RecommendedDestinationResponse,
} from "../types";

// Thin, typed wrappers around the existing discoveryApiClient. DiscoveryService
// is a public API (no JWT), so - unlike the trips/auth APIs - no Authorization
// header is sent.

export function getDestinations(): Promise<DestinationResponse[]> {
  return discoveryApiClient.get<DestinationResponse[]>("api/destinations");
}

export function getDestination(destinationId: string): Promise<DestinationResponse> {
  return discoveryApiClient.get<DestinationResponse>(`api/destinations/${destinationId}`);
}

export function getRecommendations(
  request: DestinationRecommendationRequest,
): Promise<RecommendedDestinationResponse[]> {
  return discoveryApiClient.post<RecommendedDestinationResponse[]>("api/destinations/recommendations", request);
}
