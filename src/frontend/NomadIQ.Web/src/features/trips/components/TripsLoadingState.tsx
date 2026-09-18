export function TripsLoadingState({ message }: { message: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="eyebrow">{message}</p>
      <div className="skeleton-block" />
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
}
