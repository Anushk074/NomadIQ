import { formatTripBudget, formatTripDate } from "../../trips/format";
import type { TripResponse } from "../../trips/types";
import { formatActivityTime } from "../format";

// Read-only view of the trip as last returned by TripService. It has no
// controls and is only ever fed a TripService response - never AI output.
export function AssistantTripPanel({
  trip,
  warning,
  isRefreshing,
  onRetryRefresh,
}: {
  trip: TripResponse;
  warning: string | null;
  isRefreshing: boolean;
  onRetryRefresh: () => void;
}) {
  const days = [...trip.days].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <aside className="trip-panel" aria-label="Trip data from TripService">
      <p className="panel-label">Trip data — from TripService (authoritative)</p>

      {warning && (
        <div className="warning-banner" role="alert">
          <p>{warning}</p>
          <button type="button" className="btn btn-small" onClick={onRetryRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Retrying…" : "Retry"}
          </button>
        </div>
      )}

      <h2>{trip.destination}</h2>
      <span className="trip-status" data-status={trip.status}>
        {trip.status}
      </span>

      <dl className="trip-panel-facts">
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
      </dl>

      <h3>Itinerary</h3>
      {days.length === 0 ? (
        <p className="eyebrow">No days planned yet.</p>
      ) : (
        days.map((day) => (
          <div key={day.id} className="panel-day">
            <h4>
              Day {day.dayNumber}: {day.title}
            </h4>
            {day.activities.length === 0 ? (
              <p className="eyebrow">No activities.</p>
            ) : (
              <ul className="panel-activities">
                {day.activities.map((activity) => {
                  const start = formatActivityTime(activity.startTime);
                  const end = formatActivityTime(activity.endTime);
                  const time = start && end ? `${start}–${end}` : (start ?? end);

                  return (
                    <li key={activity.id}>
                      <strong>{activity.name}</strong>
                      <span className="eyebrow">
                        {[
                          time,
                          activity.location,
                          activity.estimatedCost != null
                            ? formatTripBudget(activity.estimatedCost, trip.currency)
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))
      )}
    </aside>
  );
}
