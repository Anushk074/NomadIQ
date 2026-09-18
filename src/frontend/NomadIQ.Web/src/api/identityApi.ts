import { appConfig } from "../config/env";
import { ApiClient } from "./httpClient";

// Foundation only - no IdentityService calls are implemented yet.
// Future auth features (login, register, refresh) will call this client.
export const identityApiClient = new ApiClient(appConfig.identityApiBaseUrl);
