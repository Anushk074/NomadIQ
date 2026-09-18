// Request/response shapes below mirror IdentityService's actual DTOs exactly
// (src/backend/IdentityService/Application/Dtos/*.cs). Do not add fields here
// unless the backend contract actually accepts/returns them.

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Mirrors AuthResponseDto - returned by both POST /api/auth/login and
// POST /api/auth/register. Registration also issues a usable access token,
// so a successful register response authenticates the user immediately.
export interface AuthResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  expiresAt: string;
}

// Mirrors CurrentUserResponse - GET /api/auth/me intentionally returns only
// these two fields, unlike AuthResponse.
export interface CurrentUserResponse {
  userId: string;
  email: string;
}

// The frontend's own "who is signed in" shape. firstName/lastName are only
// known when the session started via login/register in this tab; a session
// restored from a stored token (via GET /me) only has userId/email, because
// that is all the backend returns.
export interface AuthenticatedUser {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
