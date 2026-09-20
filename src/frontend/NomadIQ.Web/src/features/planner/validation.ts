import type { TripPlanRequest } from "./types";

// Mirrors the DataAnnotations on AIService's TripPlanRequest exactly
// (src/backend/AIService/Application/Dtos/TripPlanRequest.cs).

export interface PlannerFormValues {
  budget: string;
  durationDays: string;
  travelStyle: string;
  preferences: string; // comma-separated
  destination: string;
  numberOfTravelers: string;
  travelStartDate: string; // "" = not specified
}

export type PlannerFormErrors = Partial<Record<keyof PlannerFormValues, string>>;

export const INITIAL_PLANNER_VALUES: PlannerFormValues = {
  budget: "",
  durationDays: "",
  travelStyle: "",
  preferences: "",
  destination: "",
  numberOfTravelers: "1",
  travelStartDate: "",
};

// [Range(1, double.MaxValue)]
export function validatePlannerBudget(value: string): string | undefined {
  if (!value.trim()) {
    return "Budget is required.";
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return "Budget must be a number.";
  }

  return parsed < 1 ? "Budget must be at least 1." : undefined;
}

// [Range(1, 30)] - note: 30, unlike DiscoveryService's 365.
export function validatePlannerDuration(value: string): string | undefined {
  if (!value.trim()) {
    return "Duration is required.";
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return "Duration must be a whole number of days.";
  }

  return parsed < 1 || parsed > 30 ? "Duration must be between 1 and 30 days." : undefined;
}

// [Required, StringLength(50, MinimumLength = 1)]
export function validatePlannerTravelStyle(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Travel style is required.";
  }

  return trimmed.length > 50 ? "Travel style must be 50 characters or fewer." : undefined;
}

// [StringLength(100, MinimumLength = 1)] on an optional string: blank is
// fine here because it is sent as null, never as "".
export function validatePlannerDestination(value: string): string | undefined {
  return value.trim().length > 100 ? "Destination must be 100 characters or fewer." : undefined;
}

// [Range(1, 20)] int
export function validateTravelers(value: string): string | undefined {
  if (!value.trim()) {
    return "Number of travelers is required.";
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return "Number of travelers must be a whole number.";
  }

  return parsed < 1 || parsed > 20 ? "Number of travelers must be between 1 and 20." : undefined;
}

export function validatePlannerForm(values: PlannerFormValues): PlannerFormErrors {
  return {
    budget: validatePlannerBudget(values.budget),
    durationDays: validatePlannerDuration(values.durationDays),
    travelStyle: validatePlannerTravelStyle(values.travelStyle),
    destination: validatePlannerDestination(values.destination),
    numberOfTravelers: validateTravelers(values.numberOfTravelers),
  };
}

// "nature, food, photography" -> ["nature","food","photography"];
// trims entries, drops blanks, null when nothing is left.
export function parsePreferences(value: string): string[] | null {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : null;
}

// Assumes the values already passed validatePlannerForm.
export function buildPlanRequest(values: PlannerFormValues): TripPlanRequest {
  const destination = values.destination.trim();

  return {
    budget: Number(values.budget),
    durationDays: Number(values.durationDays),
    travelStyle: values.travelStyle.trim(),
    preferences: parsePreferences(values.preferences),
    destination: destination ? destination : null,
    numberOfTravelers: Number(values.numberOfTravelers),
    travelStartDate: values.travelStartDate ? values.travelStartDate : null,
  };
}
