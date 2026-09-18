import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { useAuth } from "../context/useAuth";

// The single place that enforces "must be signed in" for a route. Feature
// pages never check auth state themselves - see routes/AppRouter.tsx.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <p>Checking your session...</p>;
  }

  if (status === "unauthenticated") {
    // Preserve the originally-requested route so LoginPage can send the
    // user back there after a successful login.
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
