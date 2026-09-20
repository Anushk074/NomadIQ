import { useState } from "react";
import type { FormEvent } from "react";
import { createActivity, updateActivity } from "../../api/tripsApi";
import { useMutation } from "../../hooks/useMutation";
import { validateActivityForm } from "../../itineraryValidation";
import type { ActivityFormErrors, ActivityFormValues } from "../../itineraryValidation";
import { inputValueToTime, timeToInputValue } from "../../time";
import type { ActivityResponse } from "../../types";
import { hasFormErrors } from "../../validation";

// Shared form for both "Add Activity" and "Edit Activity".
export function ActivityForm({
  tripId,
  dayId,
  activity,
  onCancel,
  onSaved,
}: {
  tripId: string;
  dayId: string;
  activity?: ActivityResponse;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const isEditing = Boolean(activity);
  const idPrefix = activity?.id ?? "new";

  const [values, setValues] = useState<ActivityFormValues>({
    name: activity?.name ?? "",
    description: activity?.description ?? "",
    location: activity?.location ?? "",
    estimatedCost: activity?.estimatedCost != null ? String(activity.estimatedCost) : "",
    startTime: timeToInputValue(activity?.startTime ?? null),
    endTime: timeToInputValue(activity?.endTime ?? null),
  });
  const [errors, setErrors] = useState<ActivityFormErrors>({});

  const createMutation = useMutation(createActivity);
  const updateMutation = useMutation(updateActivity);
  const { isSubmitting, error } = isEditing ? updateMutation : createMutation;

  function handleChange<K extends keyof ActivityFormValues>(field: K, value: ActivityFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateActivityForm(values);
    setErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      return;
    }

    const payload = {
      name: values.name.trim(),
      description: values.description.trim() ? values.description.trim() : null,
      location: values.location.trim() ? values.location.trim() : null,
      estimatedCost: values.estimatedCost.trim() ? Number(values.estimatedCost) : null,
      startTime: inputValueToTime(values.startTime),
      endTime: inputValueToTime(values.endTime),
    };

    const result = activity
      ? await updateMutation.mutate(tripId, dayId, activity.id, payload)
      : await createMutation.mutate(tripId, dayId, payload);

    if (result.ok) {
      onSaved();
    }
  }

  return (
    <form className="itinerary-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={`activity-name-${idPrefix}`}>Name</label>
        <input
          id={`activity-name-${idPrefix}`}
          value={values.name}
          onChange={(event) => handleChange("name", event.target.value)}
        />
        {errors.name && <p role="alert">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor={`activity-description-${idPrefix}`}>Description</label>
        <textarea
          id={`activity-description-${idPrefix}`}
          value={values.description}
          onChange={(event) => handleChange("description", event.target.value)}
        />
        {errors.description && <p role="alert">{errors.description}</p>}
      </div>

      <div className="form-field">
        <label htmlFor={`activity-location-${idPrefix}`}>Location</label>
        <input
          id={`activity-location-${idPrefix}`}
          value={values.location}
          onChange={(event) => handleChange("location", event.target.value)}
        />
        {errors.location && <p role="alert">{errors.location}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`activity-start-${idPrefix}`}>Start time</label>
          <input
            id={`activity-start-${idPrefix}`}
            type="time"
            value={values.startTime}
            onChange={(event) => handleChange("startTime", event.target.value)}
          />
          {errors.startTime && <p role="alert">{errors.startTime}</p>}
        </div>

        <div className="form-field">
          <label htmlFor={`activity-end-${idPrefix}`}>End time</label>
          <input
            id={`activity-end-${idPrefix}`}
            type="time"
            value={values.endTime}
            onChange={(event) => handleChange("endTime", event.target.value)}
          />
          {errors.endTime && <p role="alert">{errors.endTime}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`activity-cost-${idPrefix}`}>Estimated cost</label>
        <input
          id={`activity-cost-${idPrefix}`}
          type="number"
          min="0"
          step="0.01"
          value={values.estimatedCost}
          onChange={(event) => handleChange("estimatedCost", event.target.value)}
        />
        {errors.estimatedCost && <p role="alert">{errors.estimatedCost}</p>}
      </div>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add activity"}
        </button>
        <button type="button" className="btn" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
