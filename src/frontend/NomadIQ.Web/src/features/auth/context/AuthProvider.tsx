import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "../api/authApi";
import { tokenStorage } from "../tokenStorage";
import type { AuthenticatedUser, LoginRequest, RegisterRequest } from "../types";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./AuthContext";

// The single source of truth for "is anyone signed in, and who". Every
// login/register/logout/token check in the app goes through this provider -
// feature pages never read localStorage or call IdentityService directly.
export function AuthProvider({ children }: { children: ReactNode }) {
  // No stored token means there is nothing to validate, so that state is
  // known synchronously up front - only the "validate an existing token"
  // path needs the effect below.
  const [status, setStatus] = useState<AuthStatus>(() => (tokenStorage.get() ? "loading" : "unauthenticated"));
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const token = tokenStorage.get();

    if (!token) {
      return;
    }

    authApi
      .getCurrentUser(token)
      .then((currentUser) => {
        setUser({ userId: currentUser.userId, email: currentUser.email });
        setStatus("authenticated");
      })
      .catch(() => {
        // Token is missing, expired, or otherwise rejected by IdentityService.
        tokenStorage.clear();
        setUser(null);
        setStatus("unauthenticated");
      });
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await authApi.login(request);
    tokenStorage.set(response.accessToken);
    setUser({
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    });
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (request: RegisterRequest) => {
    // POST /api/auth/register returns the same AuthResponseDto as login, so
    // a successful registration already authenticates the user - no
    // separate login step is required or invented here.
    const response = await authApi.register(request);
    tokenStorage.set(response.accessToken);
    setUser({
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    });
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
