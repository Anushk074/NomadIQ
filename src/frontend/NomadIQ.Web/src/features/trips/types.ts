// Mirrors TripService's actual DTOs and enum exactly
// (src/backend/TripService/Application/Dtos/*.cs, Domain/Enums/TripStatus.cs).
// Do not add fields here unless the backend contract actually returns them.

export type TripStatus = "Planning" | "Confirmed" | "Completed" | "Cancelled";

export const TRIP_STATUSES: readonly TripStatus[] = ["Planning", "Confirmed", "Completed", "Cancelled"];

// Mirrors ActivityResponse. StartTime/EndTime are .NET TimeOnly, serialized
// as "HH:mm:ss"; EstimatedCost/Description/Location are all optional.
export interface ActivityResponse {
  id: string;
  itineraryDayId: string;
  name: string;
  description: string | null;
  location: string | null;
  estimatedCost: number | null;
  startTime: string | null;
  endTime: string | null;
}

// Mirrors ItineraryDayResponse. Date is .NET DateOnly, serialized as "yyyy-MM-dd".
export interface ItineraryDayResponse {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  title: string;
  notes: string | null;
  activities: ActivityResponse[];
}

// Mirrors TripResponse, as returned by every TripsController endpoint.
// StartDate/EndDate are DateOnly ("yyyy-MM-dd"); CreatedAt/UpdatedAt are
// DateTime (ISO 8601 with time).
export interface TripResponse {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelStyle: string;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  days: ItineraryDayResponse[];
}

// Mirrors CreateTripRequest. No Status field - TripManagementService always
// creates new trips with status "Planning" server-side.
export interface CreateTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelStyle: string;
}

// Mirrors UpdateTripRequest - the same fields as create, plus Status
// (required; the PUT endpoint replaces the whole trip).
export interface UpdateTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelStyle: string;
  status: TripStatus;
}
