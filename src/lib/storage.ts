import { supabase } from './supabase';

const imageBucket = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET ?? 'media-images';
const audioBucket = import.meta.env.VITE_SUPABASE_AUDIO_BUCKET ?? 'media-audio';

const getPublicUrl = (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

export const getSupabaseImageUrl = (path: string) => getPublicUrl(imageBucket, path);
export const getSupabaseAudioUrl = (path: string) => getPublicUrl(audioBucket, path);
