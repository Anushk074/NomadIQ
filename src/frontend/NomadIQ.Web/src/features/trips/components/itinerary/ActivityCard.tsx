import { useState } from "react";
import { formatTripBudget } from "../../format";
import type { ActivityResponse } from "../../types";
import { ActivityForm } from "./ActivityForm";
import { DeleteActivityAction } from "./DeleteActivityAction";

function formatTimeRange(startTime: string | null, endTime: string | null): string | null {
  if (!startTime && !endTime) {
    return null;
  }

  const start = startTime ? startTime.slice(0, 5) : null;
  const end = endTime ? endTime.slice(0, 5) : null;

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start ?? end;
}

export function ActivityCard({
  tripId,
  dayId,
  activity,
  currency,
  onChanged,
}: {
  tripId: string;
  dayId: string;
  activity: ActivityResponse;
  currency: string;
  onChanged: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ActivityForm
        tripId={tripId}
        dayId={dayId}
        activity={activity}
        onCancel={() => setIsEditing(false)}
        onSaved={() => {
          setIsEditing(false);
          onChanged();
        }}
      />
    );
  }

  const timeRange = formatTimeRange(activity.startTime, activity.endTime);

  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <h4>{activity.name}</h4>
        <div className="activity-card-actions">
          <button type="button" className="btn btn-small" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <DeleteActivityAction tripId={tripId} dayId={dayId} activityId={activity.id} onDeleted={onChanged} />
        </div>
      </div>

      {activity.description && <p className="activity-description">{activity.description}</p>}

      <div className="activity-meta">
        {timeRange && <span>{timeRange}</span>}
        {activity.location && <span>{activity.location}</span>}
        {activity.estimatedCost != null && <span>{formatTripBudget(activity.estimatedCost, currency)}</span>}
      </div>
    </div>
  );
}
