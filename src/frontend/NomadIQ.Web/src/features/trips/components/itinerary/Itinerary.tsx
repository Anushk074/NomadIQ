import { useState } from "react";
import type { TripResponse } from "../../types";
import { DayForm } from "./DayForm";
import { DaySection } from "./DaySection";

// Renders entirely from `trip.days` (part of the single TripResponse the
// details page already fetched) - no separate itinerary fetch or state.
export function Itinerary({
  tripId,
  trip,
  onChanged,
}: {
  tripId: string;
  trip: TripResponse;
  onChanged: () => void;
}) {
  const [isAddingDay, setIsAddingDay] = useState(false);

  const sortedDays = [...trip.days].sort((a, b) => a.dayNumber - b.dayNumber);
  const nextDayNumber = sortedDays.length === 0 ? 1 : sortedDays[sortedDays.length - 1].dayNumber + 1;

  return (
    <section className="itinerary">
      <div className="page-header">
        <h2>Itinerary</h2>
      </div>

      {sortedDays.length === 0 && !isAddingDay && (
        <div className="dashboard-empty">
          <h3>No itinerary yet</h3>
          <p>Add the first day to start planning this trip.</p>
        </div>
      )}

      {sortedDays.map((day) => (
        <DaySection key={day.id} tripId={tripId} day={day} currency={trip.currency} onChanged={onChanged} />
      ))}

      {isAddingDay ? (
        <DayForm
          tripId={tripId}
          nextDayNumber={nextDayNumber}
          onCancel={() => setIsAddingDay(false)}
          onSaved={() => {
            setIsAddingDay(false);
            onChanged();
          }}
        />
      ) : (
        <button type="button" className="btn btn-primary" onClick={() => setIsAddingDay(true)}>
          Add Day
        </button>
      )}
    </section>
  );
}
