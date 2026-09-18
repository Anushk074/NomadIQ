import type { AuthenticatedUser } from "../../auth/types";

// `user` can only be null for an instant before ProtectedRoute's guard has
// resolved; falls back gracefully rather than assuming it's always present.
export function DashboardHeader({ user }: { user: AuthenticatedUser | null }) {
  const displayName = user?.firstName ?? user?.email ?? "there";

  return (
    <header className="dashboard-header">
      <p className="eyebrow">Welcome back,</p>
      <h1>{displayName}</h1>
    </header>
  );
}
