// Mirrors DiscoveryService's actual DTOs exactly
// (src/backend/DiscoveryService/Application/Dtos/*.cs).
// Do not add fields here unless the backend contract actually returns them.

// Mirrors DestinationResponse. bestTravelMonths are month numbers 1-12;
// averageBudget is per day; createdAt/updatedAt are ISO 8601 DateTimes.
// The contract has no currency field (INR is a product convention).
export interface DestinationResponse {
  id: string;
  country: string;
  city: string;
  description: string;
  tags: string[];
  averageBudget: number;
  bestTravelMonths: number[];
  createdAt: string;
  updatedAt: string;
}

// Mirrors DestinationRecommendationRequest. `budget` is the TOTAL trip
// budget; the backend divides it by durationDays. preferences/travelMonth
// are optional on the backend (null allowed).
export interface DestinationRecommendationRequest {
  budget: number;
  durationDays: number;
  travelStyle: string;
  preferences: string[] | null;
  travelMonth: number | null;
}

// Mirrors RecommendedDestinationResponse. matchingReasons are
// server-generated sentences and must be displayed verbatim.
export interface RecommendedDestinationResponse {
  destination: DestinationResponse;
  score: number;
  matchingReasons: string[];
}
