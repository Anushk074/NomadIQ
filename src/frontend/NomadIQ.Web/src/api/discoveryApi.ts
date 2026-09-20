import { appConfig } from "../config/env";
import { ApiClient } from "./httpClient";

// Shared client for DiscoveryService. The typed calls live in
// features/discovery/api/discoveryApi.ts.
export const discoveryApiClient = new ApiClient(appConfig.discoveryApiBaseUrl);
