export function DashboardStats({ totalTrips, upcomingCount }: { totalTrips: number; upcomingCount: number }) {
  return (
    <dl className="dashboard-stats">
      <div className="stat-card">
        <dt>Total trips</dt>
        <dd>{totalTrips}</dd>
      </div>
      <div className="stat-card">
        <dt>Upcoming trips</dt>
        <dd>{upcomingCount}</dd>
      </div>
    </dl>
  );
}
