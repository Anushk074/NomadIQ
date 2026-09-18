export function TripsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dashboard-error" role="alert">
      <h2>We couldn't load that</h2>
      <p>{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
