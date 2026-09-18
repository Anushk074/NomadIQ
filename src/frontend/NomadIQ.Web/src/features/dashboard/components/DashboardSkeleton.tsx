export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="eyebrow">Loading your dashboard…</p>
      <div className="skeleton-block" />
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
}
