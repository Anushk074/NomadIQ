// Mirrors AIService's actual planner DTOs exactly
// (src/backend/AIService/Application/Dtos/TripPlanRequest.cs and TripPlanResponse.cs).
// These are deliberately separate from the persisted Trip/itinerary types:
// a generated plan has no ids, dates, day titles, times or locations.

// Mirrors TripPlanRequest. `budget` is the TOTAL trip budget (not per person).
// preferences/destination/travelStartDate are optional on the backend and are
// sent as null when empty (a blank-string destination is rejected with 400).
export interface TripPlanRequest {
  budget: number;
  durationDays: number;
  travelStyle: string;
  preferences: string[] | null;
  destination: string | null;
  numberOfTravelers: number;
  travelStartDate: string | null;
}

// Mirrors TripPlanActivity.
export interface TripPlanActivity {
  name: string;
  description: string | null;
  estimatedCost: number | null;
}

// Mirrors TripPlanDay.
export interface TripPlanDay {
  day: number;
  activities: TripPlanActivity[];
}

// Mirrors TripPlanResponse. All values are AI-generated: the backend checks
// only structure (day count/order, non-blank destination/summary, positive
// estimatedBudget) - not that the destination matches the request, that
// currency is a valid code, or that the estimate fits the requested budget.
export interface TripPlanResponse {
  destination: string;
  durationDays: number;
  estimatedBudget: number;
  currency: string;
  summary: string;
  days: TripPlanDay[];
  recommendations: string[];
  notes: string[];
}
