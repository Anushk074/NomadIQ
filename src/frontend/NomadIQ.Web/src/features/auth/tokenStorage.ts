// The only module allowed to touch storage directly for the access token.
// Centralizing this keeps token handling out of feature pages/components -
// AuthProvider is the sole consumer. See README for the storage trade-offs.
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
