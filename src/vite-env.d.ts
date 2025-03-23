
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_PROXY_ENDPOINT: string;
  readonly VITE_USE_MOCK_DATA: string;
  readonly VITE_BBC_SPORT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
