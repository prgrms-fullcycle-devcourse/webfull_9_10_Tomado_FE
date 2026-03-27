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

const trackModules = import.meta.glob('../../assets/audio/bgm/*/*.{mp3,wav,ogg,m4a,aac}', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

export const bgmPlayerItems: BgmPlayerItem[] = (Object.keys(categoryMeta) as BgmCategory[]).map((category) => ({
    id: category,
    ...categoryMeta[category],
}));

export const bgmTracks: BgmTrack[] = Object.entries(trackModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => {
        const match = path.match(/\/bgm\/([^/]+)\/([^/]+)\.[^.]+$/);
        const category = (match?.[1] ?? 'lofi') as BgmCategory;
        const fileName = match?.[2] ?? category;

        return {
            id: `${category}/${fileName}`,
            category,
            title: categoryMeta[category].title,
            description: categoryMeta[category].description,
            imageSrc: categoryMeta[category].imageSrc,
            src,
        };
    });
