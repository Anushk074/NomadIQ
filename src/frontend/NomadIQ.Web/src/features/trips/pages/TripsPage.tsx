import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { EmptyTripsState } from "../components/EmptyTripsState";
import { TripSummaryCard } from "../components/TripSummaryCard";
import { TripsErrorState } from "../components/TripsErrorState";
import { TripsLoadingState } from "../components/TripsLoadingState";
import { useTrips } from "../hooks/useTrips";

export function TripsPage() {
  const { state, retry } = useTrips();

  return (
    <section>
      <div className="page-header">
        <h1>My Trips</h1>
        <Link to={paths.newTrip} className="btn btn-primary">
          Create Trip
        </Link>
      </div>

      {state.status === "loading" && <TripsLoadingState message="Loading your trips…" />}
      {state.status === "error" && <TripsErrorState message={state.message} onRetry={retry} />}

      {state.status === "success" &&
        (state.trips.length === 0 ? (
          <EmptyTripsState />
        ) : (
          <div className="trip-grid">
            {state.trips.map((trip) => (
              <TripSummaryCard key={trip.id} trip={trip} />
            ))}
          </div>
        ))}
    </section>
  );
}
