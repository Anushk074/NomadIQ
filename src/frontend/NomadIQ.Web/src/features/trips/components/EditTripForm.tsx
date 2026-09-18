import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { updateTrip } from "../api/tripsApi";
import { TRIP_STATUSES } from "../types";
import type { TripResponse, TripStatus } from "../types";
import { hasFormErrors, validateTripForm } from "../validation";
import type { TripFormErrors, TripFormValues } from "../validation";
import { TripFieldsFieldset } from "./TripFieldsFieldset";

export function EditTripForm({
  trip,
  onCancel,
  onSaved,
}: {
  trip: TripResponse;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const handleUnauthorized = useHandleUnauthorized();

  const [values, setValues] = useState<TripFormValues>({
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: String(trip.budget),
    currency: trip.currency,
    travelStyle: trip.travelStyle,
  });
  const [status, setStatus] = useState<TripStatus>(trip.status);
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange<K extends keyof TripFormValues>(field: K, value: TripFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateTripForm(values);
    setErrors(nextErrors);
    setFormError(null);

    if (hasFormErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTrip(trip.id, {
        destination: values.destination.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        budget: Number(values.budget),
        currency: values.currency.trim().toUpperCase(),
        travelStyle: values.travelStyle.trim(),
        status,
      });

      onSaved();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
        return;
      }

      setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TripFieldsFieldset values={values} errors={errors} onChange={handleChange} />

      <div className="form-field">
        <label htmlFor="trip-status">Status</label>
        <select id="trip-status" value={status} onChange={(event) => setStatus(event.target.value as TripStatus)}>
          {TRIP_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {formError && <p role="alert">{formError}</p>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
        <button type="button" className="btn" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
