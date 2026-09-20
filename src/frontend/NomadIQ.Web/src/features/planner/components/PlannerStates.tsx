export function PlannerLoadingState() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="eyebrow">Generating your trip plan. This can take up to a minute — please keep this page open.</p>
      <div className="skeleton-block" />
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
}

export function PlannerErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dashboard-error" role="alert">
      <h2>We couldn't generate a plan</h2>
      <p>{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
