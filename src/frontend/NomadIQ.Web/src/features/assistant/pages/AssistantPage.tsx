import { useNavigate, useParams } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { useTrips } from "../../trips/hooks/useTrips";
import {
  AssistantErrorState,
  AssistantLoadingState,
  NoTripsState,
  SelectTripState,
} from "../components/AssistantStates";
import { AssistantWorkspace } from "../components/AssistantWorkspace";
import { TripSelector } from "../components/TripSelector";

// /assistant           -> nothing selected (never auto-selects a trip)
// /assistant/:tripId   -> that trip's assistant (deep-linkable)
export function AssistantPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { state, retry } = useTrips();

  function handleSelectTrip(selectedId: string) {
    navigate(selectedId ? paths.assistantTrip(selectedId) : paths.assistant);
  }

  const trips = state.status === "success" ? state.trips : [];

  return (
    <section>
      <div className="page-header">
        <h1>AI Travel Assistant</h1>
      </div>

      {tripId ? (
        <AssistantWorkspace key={tripId} tripId={tripId} trips={trips} onSelectTrip={handleSelectTrip} />
      ) : (
        <>
          {state.status === "loading" && <AssistantLoadingState message="Loading your trips…" />}

          {state.status === "error" && (
            <AssistantErrorState title="We couldn't load your trips" message={state.message} onRetry={retry} />
          )}

          {state.status === "success" &&
            (state.trips.length === 0 ? (
              <NoTripsState />
            ) : (
              <>
                <TripSelector trips={state.trips} value="" disabled={false} onChange={handleSelectTrip} />
                <SelectTripState />
              </>
            ))}
        </>
      )}
    </section>
  );
}
