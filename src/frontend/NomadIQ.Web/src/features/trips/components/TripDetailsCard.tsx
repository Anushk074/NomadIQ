import { formatTripBudget, formatTripDate } from "../format";
import type { TripResponse } from "../types";
import { DeleteTripAction } from "./DeleteTripAction";

// Read-only view of a trip. Itinerary days/activities are only summarized
// by count here - day/activity editing belongs to a later phase.
export function TripDetailsCard({ trip, onEdit }: { trip: TripResponse; onEdit: () => void }) {
  return (
    <article className="trip-details">
      <header className="trip-details-header">
        <div>
          <h1>{trip.destination}</h1>
          <span className="trip-status" data-status={trip.status}>
            {trip.status}
          </span>
        </div>
        <div className="trip-details-actions">
          <button type="button" className="btn" onClick={onEdit}>
            Edit trip
          </button>
          <DeleteTripAction tripId={trip.id} />
        </div>
      </header>

      <dl className="trip-details-facts">
        <div>
          <dt>Dates</dt>
          <dd>
            {formatTripDate(trip.startDate)} – {formatTripDate(trip.endDate)}
          </dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{formatTripBudget(trip.budget, trip.currency)}</dd>
        </div>
        <div>
          <dt>Travel style</dt>
          <dd>{trip.travelStyle}</dd>
        </div>
        <div>
          <dt>Itinerary</dt>
          <dd>
            {trip.days.length === 0
              ? "No days planned yet"
              : `${trip.days.length} day${trip.days.length === 1 ? "" : "s"} planned`}
          </dd>
        </div>
      </dl>
    </article>
  );
}
