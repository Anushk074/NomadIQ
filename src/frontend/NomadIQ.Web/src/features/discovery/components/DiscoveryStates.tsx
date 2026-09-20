export function DiscoveryLoadingState({ message }: { message: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="eyebrow">{message}</p>
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
}

export function DiscoveryErrorState({
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

export function NoDestinationsState() {
  return (
    <div className="dashboard-empty">
      <h2>No destinations available yet</h2>
      <p>The destination catalog is empty right now. Please check back later.</p>
    </div>
  );
}

export function NoRecommendationsState() {
  return (
    <div className="dashboard-empty">
      <h2>No recommendations found</h2>
      <p>We couldn't find any destinations to recommend. Try adjusting your budget, duration or preferences.</p>
    </div>
  );
}
