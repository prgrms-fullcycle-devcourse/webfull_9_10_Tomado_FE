/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_SUPABASE_IMAGE_BUCKET?: string;
    readonly VITE_SUPABASE_AUDIO_BUCKET?: string;
    readonly VITE_DEMO_I?: string;
    readonly VITE_DEMO_P?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
