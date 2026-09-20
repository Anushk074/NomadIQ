import { useState } from "react";
import type { FormEvent } from "react";
import type { TripPlanRequest } from "../types";
import { buildPlanRequest, validatePlannerForm } from "../validation";
import type { PlannerFormErrors, PlannerFormValues } from "../validation";

// Values are owned by the page so "Change request" can return here with
// everything the user entered still in place.
export function PlannerForm({
  values,
  onChange,
  isSubmitting,
  onSubmit,
}: {
  values: PlannerFormValues;
  onChange: <K extends keyof PlannerFormValues>(field: K, value: PlannerFormValues[K]) => void;
  isSubmitting: boolean;
  onSubmit: (request: TripPlanRequest) => void;
}) {
  const [errors, setErrors] = useState<PlannerFormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validatePlannerForm(values);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    onSubmit(buildPlanRequest(values));
  }

  return (
    <form className="recommendation-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="plan-budget">Total trip budget (₹)</label>
          <input
            id="plan-budget"
            type="number"
            min="1"
            step="1"
            value={values.budget}
            onChange={(event) => onChange("budget", event.target.value)}
          />
          <p className="eyebrow">For the whole trip and all travelers together, not per person.</p>
          {errors.budget && <p role="alert">{errors.budget}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="plan-duration">Duration (days)</label>
          <input
            id="plan-duration"
            type="number"
            min="1"
            max="30"
            step="1"
            value={values.durationDays}
            onChange={(event) => onChange("durationDays", event.target.value)}
          />
          <p className="eyebrow">Between 1 and 30 days.</p>
          {errors.durationDays && <p role="alert">{errors.durationDays}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="plan-style">Travel style</label>
          <input
            id="plan-style"
            value={values.travelStyle}
            onChange={(event) => onChange("travelStyle", event.target.value)}
          />
          {errors.travelStyle && <p role="alert">{errors.travelStyle}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="plan-travelers">Number of travelers</label>
          <input
            id="plan-travelers"
            type="number"
            min="1"
            max="20"
            step="1"
            value={values.numberOfTravelers}
            onChange={(event) => onChange("numberOfTravelers", event.target.value)}
          />
          {errors.numberOfTravelers && <p role="alert">{errors.numberOfTravelers}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="plan-preferences">Preferences (optional)</label>
        <input
          id="plan-preferences"
          placeholder="nature, food, photography"
          value={values.preferences}
          onChange={(event) => onChange("preferences", event.target.value)}
        />
        <p className="eyebrow">Separate preferences with commas.</p>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="plan-destination">Destination (optional)</label>
          <input
            id="plan-destination"
            value={values.destination}
            onChange={(event) => onChange("destination", event.target.value)}
          />
          <p className="eyebrow">Leave blank and the planner will choose one for you.</p>
          {errors.destination && <p role="alert">{errors.destination}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="plan-start-date">Travel start date (optional)</label>
          <input
            id="plan-start-date"
            type="date"
            value={values.travelStartDate}
            onChange={(event) => onChange("travelStartDate", event.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Generating your plan…" : "Generate plan"}
        </button>
      </div>
    </form>
  );
}
