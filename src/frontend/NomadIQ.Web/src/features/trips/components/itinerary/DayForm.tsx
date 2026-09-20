import { useState } from "react";
import type { FormEvent } from "react";
import { createDay, updateDay } from "../../api/tripsApi";
import { useMutation } from "../../hooks/useMutation";
import { hasFormErrors } from "../../validation";
import { validateDayForm } from "../../itineraryValidation";
import type { DayFormErrors, DayFormValues } from "../../itineraryValidation";
import type { ItineraryDayResponse } from "../../types";

// Shared form for both "Add Day" and "Edit Day" - only whether `day` is
// provided differs between the two call sites.
export function DayForm({
  tripId,
  day,
  nextDayNumber,
  onCancel,
  onSaved,
}: {
  tripId: string;
  day?: ItineraryDayResponse;
  nextDayNumber: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const isEditing = Boolean(day);
  const idPrefix = day?.id ?? "new";

  const [values, setValues] = useState<DayFormValues>({
    dayNumber: String(day?.dayNumber ?? nextDayNumber),
    date: day?.date ?? "",
    title: day?.title ?? "",
    notes: day?.notes ?? "",
  });
  const [errors, setErrors] = useState<DayFormErrors>({});

  const createMutation = useMutation(createDay);
  const updateMutation = useMutation(updateDay);
  const { isSubmitting, error } = isEditing ? updateMutation : createMutation;

  function handleChange<K extends keyof DayFormValues>(field: K, value: DayFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateDayForm(values);
    setErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      return;
    }

    const payload = {
      dayNumber: Number(values.dayNumber),
      date: values.date,
      title: values.title.trim(),
      notes: values.notes.trim() ? values.notes.trim() : null,
    };

    const result = day
      ? await updateMutation.mutate(tripId, day.id, payload)
      : await createMutation.mutate(tripId, payload);

    if (result.ok) {
      onSaved();
    }
  }

  return (
    <form className="itinerary-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`day-number-${idPrefix}`}>Day number</label>
          <input
            id={`day-number-${idPrefix}`}
            type="number"
            min="1"
            max="365"
            value={values.dayNumber}
            onChange={(event) => handleChange("dayNumber", event.target.value)}
          />
          {errors.dayNumber && <p role="alert">{errors.dayNumber}</p>}
        </div>

        <div className="form-field">
          <label htmlFor={`day-date-${idPrefix}`}>Date</label>
          <input
            id={`day-date-${idPrefix}`}
            type="date"
            value={values.date}
            onChange={(event) => handleChange("date", event.target.value)}
          />
          {errors.date && <p role="alert">{errors.date}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`day-title-${idPrefix}`}>Title</label>
        <input
          id={`day-title-${idPrefix}`}
          value={values.title}
          onChange={(event) => handleChange("title", event.target.value)}
        />
        {errors.title && <p role="alert">{errors.title}</p>}
      </div>

      <div className="form-field">
        <label htmlFor={`day-notes-${idPrefix}`}>Notes</label>
        <textarea
          id={`day-notes-${idPrefix}`}
          value={values.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
        />
        {errors.notes && <p role="alert">{errors.notes}</p>}
      </div>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add day"}
        </button>
        <button type="button" className="btn" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
