import { useAuth } from "../../auth/context/useAuth";
import { EmptyTripsState } from "../../trips/components/EmptyTripsState";
import { TripSummaryCard } from "../../trips/components/TripSummaryCard";
import { useTrips } from "../../trips/hooks/useTrips";
import { DashboardErrorState } from "../components/DashboardErrorState";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardStats } from "../components/DashboardStats";
import { QuickActions } from "../components/QuickActions";
import { selectRecentTrips, selectUpcomingTrips } from "../tripSelectors";

export function DashboardPage() {
  const { user } = useAuth();
  const { state, retry } = useTrips();

  return (
    <section>
      <DashboardHeader user={user} />
      <QuickActions />

      {state.status === "loading" && <DashboardSkeleton />}

      {state.status === "error" && <DashboardErrorState message={state.message} onRetry={retry} />}

      {state.status === "success" && <DashboardTrips trips={state.trips} />}
    </section>
  );
}

function DashboardTrips({ trips }: { trips: ReturnType<typeof selectRecentTrips> }) {
  if (trips.length === 0) {
    return <EmptyTripsState />;
  }

  const upcomingTrips = selectUpcomingTrips(trips);
  const recentTrips = selectRecentTrips(trips);

  return (
    <>
      <DashboardStats totalTrips={trips.length} upcomingCount={upcomingTrips.length} />

      <section className="dashboard-section">
        <h2>Upcoming trips</h2>
        {upcomingTrips.length === 0 ? (
          <p className="eyebrow">No upcoming trips right now.</p>
        ) : (
          <div className="trip-grid">
            {upcomingTrips.map((trip) => (
              <TripSummaryCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Recent trips</h2>
        <div className="trip-grid">
          {recentTrips.map((trip) => (
            <TripSummaryCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>
    </>
  );
}
