import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { useAuth } from "./context/useAuth";

// Central reaction to any backend call failing with 401: clears the session
// via the existing logout() and sends the user to Login, preserving where
// they were - the same redirect shape ProtectedRoute already uses, so
// LoginPage returns them here after signing in again. Data-fetching hooks
// and form submit handlers call this instead of each inventing their own
// "session expired" handling.
export function useHandleUnauthorized(): () => void {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Keep the latest location in a ref (synced via effect, never written
  // during render) so the returned callback's identity stays stable
  // without re-running the data-fetching effects that depend on it.
  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  return useCallback(() => {
    logout();
    navigate(paths.login, { replace: true, state: { from: locationRef.current } });
  }, [logout, navigate]);
}
