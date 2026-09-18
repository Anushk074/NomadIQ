import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { useAuth } from "../context/useAuth";

// Keeps an already-authenticated user off Login/Register - see routes/AppRouter.tsx.
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "authenticated") {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <>{children}</>;
}
