// Mirrors the DataAnnotations on TripService's CreateItineraryDayRequest/
// UpdateItineraryDayRequest and CreateActivityRequest/UpdateActivityRequest
// exactly (src/backend/TripService/Application/Dtos/*.cs). Create and
// Update share identical field lists on the backend, so one validator each
// covers both forms.

export interface DayFormValues {
  dayNumber: string;
  date: string;
  title: string;
  notes: string;
}

export type DayFormErrors = Partial<Record<keyof DayFormValues, string>>;

// [Range(1, 365)]
export function validateDayNumber(value: string): string | undefined {
  if (!value.trim()) {
    return "Day number is required.";
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return "Day number must be a whole number.";
  }

  if (parsed < 1 || parsed > 365) {
    return "Day number must be between 1 and 365.";
  }

  return undefined;
}

// DateOnly + IValidatableObject: required (not default).
export function validateDayDate(value: string): string | undefined {
  return value ? undefined : "Date is required.";
}

// [Required, StringLength(150, MinimumLength = 1)]
export function validateDayTitle(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Title is required.";
  }

  if (trimmed.length > 150) {
    return "Title must be 150 characters or fewer.";
  }

  return undefined;
}

// [StringLength(1000)]
export function validateDayNotes(value: string): string | undefined {
  return value.length > 1000 ? "Notes must be 1000 characters or fewer." : undefined;
}

export function validateDayForm(values: DayFormValues): DayFormErrors {
  return {
    dayNumber: validateDayNumber(values.dayNumber),
    date: validateDayDate(values.date),
    title: validateDayTitle(values.title),
    notes: validateDayNotes(values.notes),
  };
}

export interface ActivityFormValues {
  name: string;
  description: string;
  location: string;
  estimatedCost: string;
  startTime: string;
  endTime: string;
}

export type ActivityFormErrors = Partial<Record<keyof ActivityFormValues, string>>;

// [Required, StringLength(150, MinimumLength = 1)]
export function validateActivityName(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Name is required.";
  }

  if (trimmed.length > 150) {
    return "Name must be 150 characters or fewer.";
  }

  return undefined;
}

// [StringLength(1000)]
export function validateActivityDescription(value: string): string | undefined {
  return value.length > 1000 ? "Description must be 1000 characters or fewer." : undefined;
}

// [StringLength(200)]
export function validateActivityLocation(value: string): string | undefined {
  return value.length > 200 ? "Location must be 200 characters or fewer." : undefined;
}

// [Range(0, double.MaxValue)] - EstimatedCost is optional (decimal?).
export function validateEstimatedCost(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return "Cost must be a number.";
  }

  if (parsed < 0) {
    return "Cost cannot be negative.";
  }

  return undefined;
}

export function validateActivityForm(values: ActivityFormValues): ActivityFormErrors {
  const errors: ActivityFormErrors = {
    name: validateActivityName(values.name),
    description: validateActivityDescription(values.description),
    location: validateActivityLocation(values.location),
    estimatedCost: validateEstimatedCost(values.estimatedCost),
  };

  // IValidatableObject: "EndTime must be after StartTime" - the backend
  // rejects EndTime <= StartTime (equal is not allowed), only when both
  // are provided.
  if (values.startTime && values.endTime && values.endTime <= values.startTime) {
    errors.endTime = "End time must be after start time.";
  }

  return errors;
}
