import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { formatTripBudget, formatTripDate } from "../format";
import type { TripResponse } from "../types";

export function TripSummaryCard({ trip }: { trip: TripResponse }) {
  return (
    <Link to={paths.tripDetails(trip.id)} className="trip-card">
      <div className="trip-card-header">
        <h3>{trip.destination}</h3>
        <span className="trip-status" data-status={trip.status}>
          {trip.status}
        </span>
      </div>

      <p className="trip-dates">
        {formatTripDate(trip.startDate)} – {formatTripDate(trip.endDate)}
      </p>

      <dl>
        <div>
          <dt>Budget</dt>
          <dd>{formatTripBudget(trip.budget, trip.currency)}</dd>
        </div>
        <div>
          <dt>Style</dt>
          <dd>{trip.travelStyle}</dd>
        </div>
      </dl>
    </Link>
  );
}
