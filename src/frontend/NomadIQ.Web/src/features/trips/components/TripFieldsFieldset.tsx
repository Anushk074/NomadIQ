import type { TripFormErrors, TripFormValues } from "../validation";

// Free-text suggestions only - TravelStyle is a plain string on the backend,
// not a constrained enum, so these are convenience options, not a whitelist.
const TRAVEL_STYLE_SUGGESTIONS = ["Relaxed", "Adventure", "Cultural", "Family", "Luxury", "Budget"];

// The 6 fields shared by CreateTripRequest and UpdateTripRequest. Status is
// deliberately not included here - only the edit form has it.
export function TripFieldsFieldset({
  values,
  errors,
  onChange,
}: {
  values: TripFormValues;
  errors: TripFormErrors;
  onChange: <K extends keyof TripFormValues>(field: K, value: TripFormValues[K]) => void;
}) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="trip-destination">Destination</label>
        <input
          id="trip-destination"
          value={values.destination}
          onChange={(event) => onChange("destination", event.target.value)}
        />
        {errors.destination && <p role="alert">{errors.destination}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="trip-start-date">Start date</label>
          <input
            id="trip-start-date"
            type="date"
            value={values.startDate}
            onChange={(event) => onChange("startDate", event.target.value)}
          />
          {errors.startDate && <p role="alert">{errors.startDate}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="trip-end-date">End date</label>
          <input
            id="trip-end-date"
            type="date"
            value={values.endDate}
            onChange={(event) => onChange("endDate", event.target.value)}
          />
          {errors.endDate && <p role="alert">{errors.endDate}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="trip-budget">Budget</label>
          <input
            id="trip-budget"
            type="number"
            min="0"
            step="0.01"
            value={values.budget}
            onChange={(event) => onChange("budget", event.target.value)}
          />
          {errors.budget && <p role="alert">{errors.budget}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="trip-currency">Currency</label>
          <input
            id="trip-currency"
            value={values.currency}
            maxLength={3}
            onChange={(event) => onChange("currency", event.target.value.toUpperCase())}
          />
          {errors.currency && <p role="alert">{errors.currency}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="trip-travel-style">Travel style</label>
        <input
          id="trip-travel-style"
          list="travel-style-suggestions"
          value={values.travelStyle}
          onChange={(event) => onChange("travelStyle", event.target.value)}
        />
        <datalist id="travel-style-suggestions">
          {TRAVEL_STYLE_SUGGESTIONS.map((style) => (
            <option key={style} value={style} />
          ))}
        </datalist>
        {errors.travelStyle && <p role="alert">{errors.travelStyle}</p>}
      </div>
    </>
  );
}
