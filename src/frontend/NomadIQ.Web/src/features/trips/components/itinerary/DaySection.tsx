import { useState } from "react";
import type { ItineraryDayResponse } from "../../types";
import { ActivityCard } from "./ActivityCard";
import { ActivityForm } from "./ActivityForm";
import { DayForm } from "./DayForm";
import { DayHeader } from "./DayHeader";

function sortByStartTime(activities: ItineraryDayResponse["activities"]) {
  return [...activities].sort((a, b) => {
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    if (a.startTime) {
      return -1;
    }
    if (b.startTime) {
      return 1;
    }
    return 0;
  });
}

export function DaySection({
  tripId,
  day,
  currency,
  onChanged,
}: {
  tripId: string;
  day: ItineraryDayResponse;
  currency: string;
  onChanged: () => void;
}) {
  const [isEditingDay, setIsEditingDay] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  const sortedActivities = sortByStartTime(day.activities);

  return (
    <section className="day-section">
      {isEditingDay ? (
        <DayForm
          tripId={tripId}
          day={day}
          nextDayNumber={day.dayNumber}
          onCancel={() => setIsEditingDay(false)}
          onSaved={() => {
            setIsEditingDay(false);
            onChanged();
          }}
        />
      ) : (
        <DayHeader tripId={tripId} day={day} onEdit={() => setIsEditingDay(true)} onDeleted={onChanged} />
      )}

      <div className="activity-list">
        {sortedActivities.length === 0 ? (
          <p className="eyebrow">No activities planned for this day.</p>
        ) : (
          sortedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              tripId={tripId}
              dayId={day.id}
              activity={activity}
              currency={currency}
              onChanged={onChanged}
            />
          ))
        )}
      </div>

      {isAddingActivity ? (
        <ActivityForm
          tripId={tripId}
          dayId={day.id}
          onCancel={() => setIsAddingActivity(false)}
          onSaved={() => {
            setIsAddingActivity(false);
            onChanged();
          }}
        />
      ) : (
        <button type="button" className="btn" onClick={() => setIsAddingActivity(true)}>
          Add Activity
        </button>
      )}
    </section>
  );
}
