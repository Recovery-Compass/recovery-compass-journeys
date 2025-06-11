/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEVANSH_UTM: string;
  readonly VITE_ANALYTICS_KEY: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
