// The only module allowed to touch storage directly for the access token.
// Centralizing this keeps token handling out of feature pages/components -
// AuthProvider owns reading it at startup and after login/register/logout;
// other features (e.g. trips) use `authorizationHeader` below rather than
// reading storage themselves. See README for the storage trade-offs.
const STORAGE_KEY = "nomadiq.accessToken";

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },

  set(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, token);
    } catch {
      // Storage can be unavailable (private browsing, quota exceeded).
      // The current tab still works from in-memory auth state either way.
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op - nothing to clear if storage isn't available.
    }
  },
};

// Every authenticated call to a backend service needs the same
// `Authorization: Bearer <token>` header. Deriving it here (instead of in
// each feature's api module) keeps token handling in one place.
export function authorizationHeader(): HeadersInit {
  const token = tokenStorage.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
