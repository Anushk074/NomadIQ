import { aiApiClient } from "../../../api/aiApi";
import { authorizationHeader } from "../../auth/tokenStorage";
import type { TripPlanRequest, TripPlanResponse } from "../types";

// POST /api/ai/trip-plans is stateless: it generates a plan and returns it.
// Nothing is saved to TripService.
export async function createTripPlan(request: TripPlanRequest): Promise<TripPlanResponse> {
  const plan = await aiApiClient.post<TripPlanResponse>("api/ai/trip-plans", request, {
    headers: authorizationHeader(),
  });

  return normalizePlan(plan);
}

// The backend does not guarantee non-null arrays inside AI output, so make
// them safe once here and keep the rest of the UI honest to the types.
function normalizePlan(plan: TripPlanResponse): TripPlanResponse {
  return {
    ...plan,
    days: (plan.days ?? []).map((day) => ({ ...day, activities: day.activities ?? [] })),
    recommendations: plan.recommendations ?? [],
    notes: plan.notes ?? [],
  };
}
