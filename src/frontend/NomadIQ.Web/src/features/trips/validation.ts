// Mirrors the DataAnnotations on TripService's CreateTripRequest/UpdateTripRequest
// exactly (src/backend/TripService/Application/Dtos/{Create,Update}TripRequest.cs).
// Both share the same 6 core fields, so both forms use this one module.

export interface TripFormValues {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  currency: string;
  travelStyle: string;
}

export type TripFormErrors = Partial<Record<keyof TripFormValues, string>>;

// [Required, StringLength(200, MinimumLength = 1)]
export function validateDestination(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Destination is required.";
  }

  if (trimmed.length > 200) {
    return "Destination must be 200 characters or fewer.";
  }

  return undefined;
}

// DateOnly + IValidatableObject: required (not default).
export function validateTripDate(value: string, fieldLabel: string): string | undefined {
  return value ? undefined : `${fieldLabel} is required.`;
}

// [Range(0, double.MaxValue)]
export function validateBudget(value: string): string | undefined {
  if (!value.trim()) {
    return "Budget is required.";
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return "Budget must be a number.";
  }

  if (parsed < 0) {
    return "Budget cannot be negative.";
  }

  return undefined;
}

// [Required, StringLength(3, MinimumLength = 3)]
export function validateCurrency(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Currency is required.";
  }

  if (trimmed.length !== 3) {
    return "Currency must be exactly 3 letters (e.g. INR).";
  }

  return undefined;
}

// [Required, StringLength(50, MinimumLength = 1)]
export function validateTravelStyle(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Travel style is required.";
  }

  if (trimmed.length > 50) {
    return "Travel style must be 50 characters or fewer.";
  }

  return undefined;
}

export function validateTripForm(values: TripFormValues): TripFormErrors {
  const errors: TripFormErrors = {
    destination: validateDestination(values.destination),
    startDate: validateTripDate(values.startDate, "Start date"),
    endDate: validateTripDate(values.endDate, "End date"),
    budget: validateBudget(values.budget),
    currency: validateCurrency(values.currency),
    travelStyle: validateTravelStyle(values.travelStyle),
  };

  // IValidatableObject: EndDate must be on or after StartDate.
  if (!errors.startDate && !errors.endDate && values.endDate < values.startDate) {
    errors.endDate = "End date must be on or after start date.";
  }

  return errors;
}

export function hasFormErrors(errors: TripFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
