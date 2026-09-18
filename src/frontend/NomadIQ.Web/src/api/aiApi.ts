import { appConfig } from "../config/env";
import { ApiClient } from "./httpClient";

// Foundation only - no AIService calls are implemented yet.
// Future AI trip planner and travel assistant features will call this client.
export const aiApiClient = new ApiClient(appConfig.aiApiBaseUrl);
