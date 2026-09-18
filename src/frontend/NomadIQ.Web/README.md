# NomadIQ.Web

React + TypeScript + Vite frontend for NomadIQ. Phase 6.2 adds authentication
against the real IdentityService; other feature pages are still placeholders.

## Stack

- React 19 + TypeScript
- Vite
- React Router

## Structure

```
src/
  app/          App root (providers, router mount)
  routes/       Route paths and the <AppRouter> route table
  layouts/      Page shells (e.g. MainLayout)
  components/   Reusable, feature-agnostic UI (e.g. NavBar)
  pages/        Cross-cutting pages not owned by a feature (Home, 404)
  features/     Feature-owned code, one folder per area (auth, trips, ...),
                each with its own pages/ (and later components/, hooks/, etc.)
  api/          Centralized API client + one client instance per backend
                service (Identity, Trip, Discovery, AI)
  config/       Typed environment configuration
  types/        Shared TypeScript types
```

## Configuration

API base URLs are read from Vite environment variables (see `src/config/env.ts`):

- `VITE_IDENTITY_API_BASE_URL`
- `VITE_TRIP_API_BASE_URL`
- `VITE_DISCOVERY_API_BASE_URL`
- `VITE_AI_API_BASE_URL`

`.env.development` holds local defaults matching each backend service's
`launchSettings.json`. Copy `.env.example` to `.env.local` (gitignored) to
override any value for your machine. Production values are supplied by the
deployment environment, never hardcoded.

## Authentication

Centralized in `src/features/auth/`:

- `context/` — `AuthProvider` holds `status` (`loading` | `authenticated` |
  `unauthenticated`) and `user`, and exposes `login`/`register`/`logout`.
  `useAuth()` is the only way anything else reads this state.
- `tokenStorage.ts` — the only module that touches `localStorage` for the
  access token. The JWT is stored there (not a cookie, since IdentityService
  only ever returns it in the response body) so a page reload can restore
  the session; this trades some XSS exposure for zero backend changes. An
  httpOnly cookie would be more defensible but requires the backend to issue
  and manage it, which is out of scope here.
- `api/authApi.ts` — typed calls to `POST /api/auth/{register,login}` and
  `GET /api/auth/me`, using the shared `identityApiClient`.
- `components/ProtectedRoute.tsx` / `RedirectIfAuthenticated.tsx` — the only
  place route access is decided; used from `routes/AppRouter.tsx` to guard
  Dashboard/Trips/Discovery/Assistant and to keep signed-in users off
  Login/Register. An unauthenticated visit to a protected route redirects to
  `/login` with the original location preserved, so login returns you there.

On startup, `AuthProvider` checks for a stored token and calls `GET /me` to
validate it; on success the user is populated, on failure the token is
cleared. `GET /me` only returns `{ userId, email }` (unlike the login/register
response, which also has `firstName`/`lastName`), so a session restored after
a reload has less user detail than one just created by login/register - this
reflects the actual IdentityService contract, not a bug.

## Scripts

```
npm install
npm run dev      # start the dev server
npm run build    # type-check and build
npm run lint      # lint
npm run preview  # preview the production build
```
