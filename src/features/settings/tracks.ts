import { getSupabaseAudioUrl, listSupabaseAudioFiles, listSupabaseAudioFolders } from '@/lib/storage';

type BgmCategory = 'lofi' | 'rain' | 'cafe' | (string & {});

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

const categoryMeta: Partial<Record<BgmCategory, Omit<BgmPlayerItem, 'id'>>> = {
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

const defaultCategoryImage = '/img_player_01.png';

const toTitleCase = (value: string) => {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
        .join(' ');
};

const getCategoryMetadata = (category: string): Omit<BgmPlayerItem, 'id'> => {
    return (
        categoryMeta[category] ?? {
            title: toTitleCase(category),
            description: `${category} 사운드`,
            imageSrc: defaultCategoryImage,
        }
    );
};

let bgmTracksPromise: Promise<BgmTrack[]> | null = null;

export const loadBgmTracks = async () => {
    if (!bgmTracksPromise) {
        bgmTracksPromise = (async () => {
            const categoryEntries = await listSupabaseAudioFolders('bgm');

            const trackGroups = await Promise.all(
                categoryEntries.map(async ({ name }) => {
                    const files = await listSupabaseAudioFiles(`bgm/${name}`);
                    const metadata = getCategoryMetadata(name);

                    return files.map(({ name: fileName }) => {
                        const trackName = fileName.replace(/\.[^.]+$/, '');

                        return {
                            id: `${name}/${trackName}`,
                            category: name,
                            title: metadata.title,
                            description: metadata.description,
                            imageSrc: metadata.imageSrc,
                            src: getSupabaseAudioUrl(`bgm/${name}/${fileName}`),
                        } satisfies BgmTrack;
                    });
                })
            );

            return trackGroups.flat();
        })();
    }

    return bgmTracksPromise;
};

export const buildBgmPlayerItems = (tracks: BgmTrack[]): BgmPlayerItem[] => {
    const categorySet = new Set(tracks.map((track) => track.category));

    return Array.from(categorySet).map((category) => ({
        id: category,
        ...getCategoryMetadata(category),
    }));
};
