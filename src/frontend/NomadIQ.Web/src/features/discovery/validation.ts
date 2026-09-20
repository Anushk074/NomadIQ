// Mirrors the DataAnnotations on DiscoveryService's DestinationRecommendationRequest
// exactly (src/backend/DiscoveryService/Application/Dtos/DestinationRecommendationRequest.cs).

export interface RecommendationFormValues {
  budget: string;
  durationDays: string;
  travelStyle: string;
  travelMonth: string; // "" = not specified
}

export type RecommendationFormErrors = Partial<Record<keyof RecommendationFormValues, string>>;

// [Range(1, double.MaxValue)] - note: minimum is 1, unlike trip budgets (0).
export function validateRecommendationBudget(value: string): string | undefined {
  if (!value.trim()) {
    return "Budget is required.";
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return "Budget must be a number.";
  }

  if (parsed < 1) {
    return "Budget must be at least 1.";
  }

  return undefined;
}

// [Range(1, 365)] int
export function validateDurationDays(value: string): string | undefined {
  if (!value.trim()) {
    return "Duration is required.";
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return "Duration must be a whole number of days.";
  }

  if (parsed < 1 || parsed > 365) {
    return "Duration must be between 1 and 365 days.";
  }

  return undefined;
}

// [Required, StringLength(50, MinimumLength = 1)]
export function validateRecommendationTravelStyle(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Travel style is required.";
  }

  if (trimmed.length > 50) {
    return "Travel style must be 50 characters or fewer.";
  }

  return undefined;
}

// [Range(1, 12)] int? - optional; "" means not specified.
export function validateTravelMonth(value: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? undefined : "Travel month must be between 1 and 12.";
}

export function validateRecommendationForm(values: RecommendationFormValues): RecommendationFormErrors {
  return {
    budget: validateRecommendationBudget(values.budget),
    durationDays: validateDurationDays(values.durationDays),
    travelStyle: validateRecommendationTravelStyle(values.travelStyle),
    travelMonth: validateTravelMonth(values.travelMonth),
  };
}
