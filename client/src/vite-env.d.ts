/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_APP_COBRA_API_URL: string;
  readonly VITE_APP_COBRA_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
