import { identityApiClient } from "../../../api/identityApi";
import type { AuthResponse, CurrentUserResponse, LoginRequest, RegisterRequest } from "../types";

// Thin, typed wrappers around the existing identityApiClient. This is the
// only place that knows IdentityService's actual endpoint paths.

export function login(request: LoginRequest): Promise<AuthResponse> {
  return identityApiClient.post<AuthResponse>("api/auth/login", request);
}

export function register(request: RegisterRequest): Promise<AuthResponse> {
  return identityApiClient.post<AuthResponse>("api/auth/register", request);
}

export function getCurrentUser(accessToken: string): Promise<CurrentUserResponse> {
  return identityApiClient.get<CurrentUserResponse>("api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
