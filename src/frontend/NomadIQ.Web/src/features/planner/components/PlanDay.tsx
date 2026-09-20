import type { TripPlanDay } from "../types";
import { PlanActivity } from "./PlanActivity";

export function PlanDay({ day, currency }: { day: TripPlanDay; currency: string }) {
  return (
    <section className="day-section">
      <div className="day-header">
        <h3>Day {day.day}</h3>
      </div>

      <div className="activity-list">
        {day.activities.length === 0 ? (
          <p className="eyebrow">No activities were suggested for this day.</p>
        ) : (
          day.activities.map((activity, index) => <PlanActivity key={index} activity={activity} currency={currency} />)
        )}
      </div>
    </section>
  );
}
