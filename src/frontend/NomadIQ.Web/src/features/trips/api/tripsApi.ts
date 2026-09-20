import { tripApiClient } from "../../../api/tripApi";
import { authorizationHeader } from "../../auth/tokenStorage";
import type {
  ActivityResponse,
  CreateActivityRequest,
  CreateItineraryDayRequest,
  CreateTripRequest,
  ItineraryDayResponse,
  TripResponse,
  UpdateActivityRequest,
  UpdateItineraryDayRequest,
  UpdateTripRequest,
} from "../types";

// Thin, typed wrappers around the existing tripApiClient, covering exactly
// TripsController's endpoints actually used by the frontend. getDay/getActivity
// are intentionally not implemented: GET /api/trips/{id} already returns the
// full nested Days[].Activities[] structure, so editing an existing day or
// activity never needs a separate fetch for it.

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

export function createDay(tripId: string, request: CreateItineraryDayRequest): Promise<ItineraryDayResponse> {
  return tripApiClient.post<ItineraryDayResponse>(`api/trips/${tripId}/days`, request, {
    headers: authorizationHeader(),
  });
}

export function updateDay(
  tripId: string,
  dayId: string,
  request: UpdateItineraryDayRequest,
): Promise<ItineraryDayResponse> {
  return tripApiClient.put<ItineraryDayResponse>(`api/trips/${tripId}/days/${dayId}`, request, {
    headers: authorizationHeader(),
  });
}

export function deleteDay(tripId: string, dayId: string): Promise<void> {
  return tripApiClient.delete<void>(`api/trips/${tripId}/days/${dayId}`, { headers: authorizationHeader() });
}

export function createActivity(
  tripId: string,
  dayId: string,
  request: CreateActivityRequest,
): Promise<ActivityResponse> {
  return tripApiClient.post<ActivityResponse>(`api/trips/${tripId}/days/${dayId}/activities`, request, {
    headers: authorizationHeader(),
  });
}

export function updateActivity(
  tripId: string,
  dayId: string,
  activityId: string,
  request: UpdateActivityRequest,
): Promise<ActivityResponse> {
  return tripApiClient.put<ActivityResponse>(`api/trips/${tripId}/days/${dayId}/activities/${activityId}`, request, {
    headers: authorizationHeader(),
  });
}

export function deleteActivity(tripId: string, dayId: string, activityId: string): Promise<void> {
  return tripApiClient.delete<void>(`api/trips/${tripId}/days/${dayId}/activities/${activityId}`, {
    headers: authorizationHeader(),
  });
}
