import { formatTripDate } from "../../format";
import type { ItineraryDayResponse } from "../../types";
import { DeleteDayAction } from "./DeleteDayAction";

export function DayHeader({
  tripId,
  day,
  onEdit,
  onDeleted,
}: {
  tripId: string;
  day: ItineraryDayResponse;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  return (
    <div className="day-header">
      <div>
        <h3>
          Day {day.dayNumber}: {day.title}
        </h3>
        <p className="eyebrow">{formatTripDate(day.date)}</p>
        {day.notes && <p className="day-notes">{day.notes}</p>}
      </div>
      <div className="day-header-actions">
        <button type="button" className="btn btn-small" onClick={onEdit}>
          Edit day
        </button>
        <DeleteDayAction tripId={tripId} dayId={day.id} dayNumber={day.dayNumber} onDeleted={onDeleted} />
      </div>
    </div>
  );
}
