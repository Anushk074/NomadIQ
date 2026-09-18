/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDENTITY_API_BASE_URL: string;
  readonly VITE_TRIP_API_BASE_URL: string;
  readonly VITE_DISCOVERY_API_BASE_URL: string;
  readonly VITE_AI_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
