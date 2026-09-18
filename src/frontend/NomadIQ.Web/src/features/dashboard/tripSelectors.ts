import type { TripResponse } from "../trips/types";

const UPCOMING_LIMIT = 3;
const RECENT_LIMIT = 3;

// Both are derived client-side from the single GET /api/trips response -
// there is no separate "upcoming"/"recent" endpoint, per the dashboard's
// composition-only architecture.

export function selectUpcomingTrips(trips: TripResponse[]): TripResponse[] {
  const today = todayAsIsoDate();

  return trips
    .filter((trip) => trip.startDate >= today && trip.status !== "Cancelled")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, UPCOMING_LIMIT);
}

export function selectRecentTrips(trips: TripResponse[]): TripResponse[] {
  return [...trips].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, RECENT_LIMIT);
}

function todayAsIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
