import { getSupabaseAudioUrl } from '@/lib/storage';

type BgmCategory = 'lofi' | 'rain' | 'cafe';

export interface BgmTrack {
    id: string;
    category: BgmCategory;
    title: string;
    description: string;
    imageSrc: string;
    src: string;
}

export interface BgmPlayerItem {
    id: BgmCategory;
    title: string;
    description: string;
    imageSrc: string;
}

const categoryMeta: Record<BgmCategory, Omit<BgmPlayerItem, 'id'>> = {
    lofi: {
        title: 'Lo-fi',
        description: '아날로그 감성',
        imageSrc: '/img_player_01.png',
    },
    rain: {
        title: '빗소리',
        description: '집중을 돕는 빗소리',
        imageSrc: '/img_player_02.png',
    },
    cafe: {
        title: '카페',
        description: '편안한 백색소음',
        imageSrc: '/img_player_03.png',
    },
};

const trackDefinitions = [
    { category: 'cafe', fileName: 'cafe_01' },
    { category: 'cafe', fileName: 'cafe_02' },
    { category: 'lofi', fileName: 'lofi_01' },
    { category: 'lofi', fileName: 'lofi_02' },
    { category: 'rain', fileName: 'rain_01' },
    { category: 'rain', fileName: 'rain_02' },
] as const satisfies ReadonlyArray<{ category: BgmCategory; fileName: string }>;

export const bgmPlayerItems: BgmPlayerItem[] = (Object.keys(categoryMeta) as BgmCategory[]).map((category) => ({
    id: category,
    ...categoryMeta[category],
}));

export const bgmTracks: BgmTrack[] = trackDefinitions.map(({ category, fileName }) => ({
    id: `${category}/${fileName}`,
    category,
    title: categoryMeta[category].title,
    description: categoryMeta[category].description,
    imageSrc: categoryMeta[category].imageSrc,
    src: getSupabaseAudioUrl(`bgm/${category}/${fileName}.mp3`),
}));
