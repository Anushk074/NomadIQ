import { tripApiClient } from "../../../api/tripApi";
import { authorizationHeader } from "../../auth/tokenStorage";
import type { CreateTripRequest, TripResponse, UpdateTripRequest } from "../types";

// Thin, typed wrappers around the existing tripApiClient, covering exactly
// TripsController's trip-level endpoints (list/create/update/delete + get by
// id). Itinerary day/activity endpoints belong to a later phase.

export function getTrips(): Promise<TripResponse[]> {
  return tripApiClient.get<TripResponse[]>("api/trips", { headers: authorizationHeader() });
}

export function getTrip(tripId: string): Promise<TripResponse> {
  return tripApiClient.get<TripResponse>(`api/trips/${tripId}`, { headers: authorizationHeader() });
}

export function createTrip(request: CreateTripRequest): Promise<TripResponse> {
  return tripApiClient.post<TripResponse>("api/trips", request, { headers: authorizationHeader() });
}

export function updateTrip(tripId: string, request: UpdateTripRequest): Promise<TripResponse> {
  return tripApiClient.put<TripResponse>(`api/trips/${tripId}`, request, { headers: authorizationHeader() });
}

export function deleteTrip(tripId: string): Promise<void> {
  return tripApiClient.delete<void>(`api/trips/${tripId}`, { headers: authorizationHeader() });
}
