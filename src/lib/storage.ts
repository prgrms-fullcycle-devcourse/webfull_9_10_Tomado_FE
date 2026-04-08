import { supabase } from './supabase';

const imageBucket = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET ?? 'media-images';
const audioBucket = import.meta.env.VITE_SUPABASE_AUDIO_BUCKET ?? 'media-audio';

const fileEntryNamePattern = /\.[^./]+$/;

const getPublicUrl = (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

const listFiles = async (bucket: string, path: string, allowedExtensions: string[]) => {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
        throw error;
    }

    return (data ?? []).filter((entry) => {
        const extension = entry.name.split('.').pop()?.toLowerCase();

        return Boolean(extension && allowedExtensions.includes(extension));
    });
};

const listFolders = async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
        throw error;
    }

    return (data ?? []).filter((entry) => !fileEntryNamePattern.test(entry.name));
};

export const getSupabaseImageUrl = (path: string) => getPublicUrl(imageBucket, path);
export const getSupabaseAudioUrl = (path: string) => getPublicUrl(audioBucket, path);
export const listSupabaseImageFiles = (path: string) =>
    listFiles(imageBucket, path, ['png', 'jpg', 'jpeg', 'webp', 'gif']);
export const listSupabaseAudioFiles = (path: string) =>
    listFiles(audioBucket, path, ['mp3', 'wav', 'ogg', 'm4a', 'aac']);
export const listSupabaseAudioFolders = (path: string) => listFolders(audioBucket, path);
