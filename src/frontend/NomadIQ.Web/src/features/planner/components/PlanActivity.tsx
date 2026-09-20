import { formatPlanMoney } from "../format";
import type { TripPlanActivity } from "../types";

export function PlanActivity({ activity, currency }: { activity: TripPlanActivity; currency: string }) {
  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <h4>{activity.name}</h4>
        {activity.estimatedCost != null && (
          <span className="activity-meta">~{formatPlanMoney(activity.estimatedCost, currency)}</span>
        )}
      </div>
      {activity.description && <p className="activity-description">{activity.description}</p>}
    </div>
  );
}
