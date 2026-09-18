import { appConfig } from "../config/env";
import { ApiClient } from "./httpClient";

// Foundation only - no DiscoveryService calls are implemented yet.
// Future destination discovery features will call this client.
export const discoveryApiClient = new ApiClient(appConfig.discoveryApiBaseUrl);
