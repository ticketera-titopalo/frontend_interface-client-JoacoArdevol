/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_AUTH_MODE?: 'demo' | 'api';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
