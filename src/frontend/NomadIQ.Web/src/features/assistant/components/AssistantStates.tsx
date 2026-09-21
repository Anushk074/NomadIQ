import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";

export function AssistantLoadingState({ message }: { message: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="eyebrow">{message}</p>
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
}

export function AssistantErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="dashboard-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function SelectTripState() {
  return (
    <div className="dashboard-empty">
      <h2>Select a trip to start chatting</h2>
      <p>The assistant works with one of your trips at a time. Choose a trip above to open its conversation.</p>
    </div>
  );
}

export function NoTripsState() {
  return (
    <div className="dashboard-empty">
      <h2>You don't have any trips yet</h2>
      <p>The assistant works with a trip, so create one first and then come back to chat about it.</p>
      <Link to={paths.newTrip} className="btn btn-primary">
        Create a trip
      </Link>
    </div>
  );
}

export function AssistantTripNotFound() {
  return (
    <div className="dashboard-empty">
      <h2>Trip not found</h2>
      <p>This trip doesn't exist, or you don't have access to it.</p>
      <Link to={paths.assistant} className="btn btn-primary">
        Choose another trip
      </Link>
    </div>
  );
}
