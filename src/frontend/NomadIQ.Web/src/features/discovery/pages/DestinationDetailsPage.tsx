import { Link, Navigate, useParams } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { DiscoveryErrorState, DiscoveryLoadingState } from "../components/DiscoveryStates";
import { TagList } from "../components/TagList";
import { formatBestMonths, formatPerDayBudget } from "../format";
import { useDestination } from "../hooks/useDestination";

export function DestinationDetailsPage() {
  const { destinationId } = useParams<{ destinationId: string }>();

  if (!destinationId) {
    return <Navigate to={paths.discovery} replace />;
  }

  // Keying by destinationId forces a remount (and fresh fetch) if the id changes.
  return <DestinationDetailsContent key={destinationId} destinationId={destinationId} />;
}

function DestinationDetailsContent({ destinationId }: { destinationId: string }) {
  const { state, retry } = useDestination(destinationId);

  return (
    <section>
      <p>
        <Link to={paths.discovery}>&larr; Back to Discover</Link>
      </p>

      {state.status === "loading" && <DiscoveryLoadingState message="Loading destination…" />}

      {state.status === "error" && (
        <DiscoveryErrorState title="We couldn't load that destination" message={state.message} onRetry={retry} />
      )}

      {state.status === "not-found" && (
        <div className="dashboard-empty">
          <h2>Destination not found</h2>
          <p>This destination doesn't exist.</p>
          <Link to={paths.discovery} className="btn btn-primary">
            Back to Discover
          </Link>
        </div>
      )}

      {state.status === "success" && (
        <article className="trip-details">
          <header className="trip-details-header">
            <div>
              <h1>{state.destination.city}</h1>
              <p className="eyebrow">{state.destination.country}</p>
            </div>
          </header>

          <p className="destination-description-full">{state.destination.description}</p>

          <TagList tags={state.destination.tags} />

          <dl className="trip-details-facts">
            <div>
              <dt>Typical cost</dt>
              <dd>{formatPerDayBudget(state.destination.averageBudget)}</dd>
            </div>
            <div>
              <dt>Best months</dt>
              <dd>{formatBestMonths(state.destination.bestTravelMonths)}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}
