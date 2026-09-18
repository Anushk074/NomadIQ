// Error payload shapes the backend services actually return.
// - `message`/`detail`: hand-written error bodies (e.g. AIService's 502s,
//   IdentityService's 401/409 auth failures).
// - `title`/`errors`: ASP.NET Core's automatic ValidationProblemDetails,
//   emitted by every [ApiController] action (IdentityService, TripService)
//   when request validation fails.
// All fields are optional because no single response includes all of them.
export interface ApiErrorPayload {
  message?: string;
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}
