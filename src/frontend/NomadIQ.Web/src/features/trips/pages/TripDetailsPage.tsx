import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { EditTripForm } from "../components/EditTripForm";
import { TripDetailsCard } from "../components/TripDetailsCard";
import { TripNotFound } from "../components/TripNotFound";
import { TripsErrorState } from "../components/TripsErrorState";
import { TripsLoadingState } from "../components/TripsLoadingState";
import { useTripDetails } from "../hooks/useTripDetails";

export function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();

  if (!tripId) {
    return <Navigate to={paths.trips} replace />;
  }

  // Keying by tripId forces a full remount (and fresh fetch) if the id
  // in the URL ever changes, instead of trying to reconcile stale state.
  return <TripDetailsContent key={tripId} tripId={tripId} />;
}

function TripDetailsContent({ tripId }: { tripId: string }) {
  const { state, retry } = useTripDetails(tripId);
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const justCreated = Boolean((location.state as { created?: boolean } | null)?.created);

  return (
    <section>
      <p>
        <Link to={paths.trips}>&larr; Back to My Trips</Link>
      </p>

      {state.status === "loading" && <TripsLoadingState message="Loading trip…" />}
      {state.status === "not-found" && <TripNotFound />}
      {state.status === "error" && <TripsErrorState message={state.message} onRetry={retry} />}

      {state.status === "success" && (
        <>
          {justCreated && (
            <p className="form-success" role="status">
              Trip created successfully.
            </p>
          )}

          {isEditing ? (
            <EditTripForm
              trip={state.trip}
              onCancel={() => setIsEditing(false)}
              onSaved={() => {
                setIsEditing(false);
                // Refetch from the server rather than trusting a local echo.
                retry();
              }}
            />
          ) : (
            <TripDetailsCard trip={state.trip} onEdit={() => setIsEditing(true)} />
          )}
        </>
      )}
    </section>
  );
}
