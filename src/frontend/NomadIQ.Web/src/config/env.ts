// Centralized, typed access to build-time environment configuration.
// Each backend service is configured independently so the frontend can call
// IdentityService, TripService, DiscoveryService, and AIService directly today,
// and be repointed at an API Gateway later (see docs/ARCHITECTURE.md, Phase 7)
// by only changing these values - no call-site changes required.

function requireEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export interface AppConfig {
  identityApiBaseUrl: string;
  tripApiBaseUrl: string;
  discoveryApiBaseUrl: string;
  aiApiBaseUrl: string;
}

export const appConfig: AppConfig = {
  identityApiBaseUrl: requireEnvVar("VITE_IDENTITY_API_BASE_URL"),
  tripApiBaseUrl: requireEnvVar("VITE_TRIP_API_BASE_URL"),
  discoveryApiBaseUrl: requireEnvVar("VITE_DISCOVERY_API_BASE_URL"),
  aiApiBaseUrl: requireEnvVar("VITE_AI_API_BASE_URL"),
};
