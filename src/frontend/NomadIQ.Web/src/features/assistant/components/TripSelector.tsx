import type { TripResponse } from "../../trips/types";
import { formatTripDate } from "../../trips/format";

// Lists the user's own trips (from the existing trips API). Never
// auto-selects: an empty value means "no trip chosen yet".
export function TripSelector({
  trips,
  value,
  disabled,
  onChange,
}: {
  trips: TripResponse[];
  value: string;
  disabled: boolean;
  onChange: (tripId: string) => void;
}) {
  const selected = trips.some((trip) => trip.id === value) ? value : "";

  return (
    <div className="form-field trip-selector">
      <label htmlFor="assistant-trip">Trip</label>
      <select
        id="assistant-trip"
        value={selected}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select a trip…</option>
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.destination} · {formatTripDate(trip.startDate)}
          </option>
        ))}
      </select>
      {disabled && <p className="eyebrow">Switching trips is disabled while the assistant is replying.</p>}
    </div>
  );
}
