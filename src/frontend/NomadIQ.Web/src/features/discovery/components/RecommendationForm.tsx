import { useState } from "react";
import type { FormEvent } from "react";
import { MONTH_OPTIONS } from "../format";
import type { DestinationRecommendationRequest } from "../types";
import { validateRecommendationForm } from "../validation";
import type { RecommendationFormErrors, RecommendationFormValues } from "../validation";

// Builds a DestinationRecommendationRequest. `tagSuggestions` come from the
// catalog (there is no tags endpoint) and are only suggestions: travel style
// stays free text, as on the backend.
export function RecommendationForm({
  tagSuggestions,
  isSubmitting,
  onSubmit,
}: {
  tagSuggestions: string[];
  isSubmitting: boolean;
  onSubmit: (request: DestinationRecommendationRequest) => void;
}) {
  const [values, setValues] = useState<RecommendationFormValues>({
    budget: "",
    durationDays: "",
    travelStyle: "",
    travelMonth: "",
  });
  const [preferences, setPreferences] = useState<string[]>([]);
  const [errors, setErrors] = useState<RecommendationFormErrors>({});

  function handleChange<K extends keyof RecommendationFormValues>(field: K, value: RecommendationFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function togglePreference(tag: string) {
    setPreferences((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateRecommendationForm(values);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    onSubmit({
      budget: Number(values.budget),
      durationDays: Number(values.durationDays),
      travelStyle: values.travelStyle.trim(),
      preferences: preferences.length > 0 ? preferences : null,
      travelMonth: values.travelMonth ? Number(values.travelMonth) : null,
    });
  }

  return (
    <form className="recommendation-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="rec-budget">Total trip budget (₹)</label>
          <input
            id="rec-budget"
            type="number"
            min="1"
            step="1"
            value={values.budget}
            onChange={(event) => handleChange("budget", event.target.value)}
          />
          {errors.budget && <p role="alert">{errors.budget}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="rec-duration">Duration (days)</label>
          <input
            id="rec-duration"
            type="number"
            min="1"
            max="365"
            step="1"
            value={values.durationDays}
            onChange={(event) => handleChange("durationDays", event.target.value)}
          />
          {errors.durationDays && <p role="alert">{errors.durationDays}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="rec-style">Travel style</label>
          <input
            id="rec-style"
            list="rec-style-suggestions"
            value={values.travelStyle}
            onChange={(event) => handleChange("travelStyle", event.target.value)}
          />
          <datalist id="rec-style-suggestions">
            {tagSuggestions.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          {errors.travelStyle && <p role="alert">{errors.travelStyle}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="rec-month">Travel month (optional)</label>
          <select
            id="rec-month"
            value={values.travelMonth}
            onChange={(event) => handleChange("travelMonth", event.target.value)}
          >
            <option value="">Any month</option>
            {MONTH_OPTIONS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          {errors.travelMonth && <p role="alert">{errors.travelMonth}</p>}
        </div>
      </div>

      {tagSuggestions.length > 0 && (
        <fieldset className="preferences">
          <legend>Preferences (optional)</legend>
          <div className="tag-choices">
            {tagSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                className="tag-choice"
                aria-pressed={preferences.includes(tag)}
                onClick={() => togglePreference(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <p className="eyebrow">
        Travel style and preferences are matched against destination tags, so a style or tag no destination uses can
        lower every match score.
      </p>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Finding destinations…" : "Find destinations"}
        </button>
      </div>
    </form>
  );
}
