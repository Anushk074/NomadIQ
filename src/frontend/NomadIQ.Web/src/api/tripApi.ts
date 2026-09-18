import { appConfig } from "../config/env";
import { ApiClient } from "./httpClient";

// Foundation only - no TripService calls are implemented yet.
// Future trip and itinerary features will call this client.
export const tripApiClient = new ApiClient(appConfig.tripApiBaseUrl);
