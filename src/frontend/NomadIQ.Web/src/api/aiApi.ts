import { appConfig } from "../config/env";
import { ApiClient } from "./httpClient";

// Shared client for AIService. The typed calls live in the feature api
// modules (e.g. features/planner/api/plannerApi.ts).
export const aiApiClient = new ApiClient(appConfig.aiApiBaseUrl);
