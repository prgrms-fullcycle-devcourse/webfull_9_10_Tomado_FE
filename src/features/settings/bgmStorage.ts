export interface BgmPersistedState {
    playerVolume: number;
    playerPlaying: boolean;
    currentTrackId: string | null;
    currentTime: number;
}

export const bgmStorageKey = 'bgm-player';
export const defaultBgmVolume = 40;

// INFO: 새로고침 후 마지막 트랙/볼륨/재생 위치를 복원하기 위한 초기값 로더입니다.
export const getPersistedBgmState = (): BgmPersistedState => {
    if (typeof window === 'undefined') {
        return {
            playerVolume: defaultBgmVolume,
            playerPlaying: false,
            currentTrackId: null,
            currentTime: 0,
        };
    }

    try {
        const raw = window.localStorage.getItem(bgmStorageKey);

        if (!raw) {
            return {
                playerVolume: defaultBgmVolume,
                playerPlaying: false,
                currentTrackId: null,
                currentTime: 0,
            };
        }

        const parsed = JSON.parse(raw) as { state?: Partial<BgmPersistedState> };
        const state = parsed.state ?? {};

        return {
            playerVolume: typeof state.playerVolume === 'number' ? state.playerVolume : defaultBgmVolume,
            playerPlaying: Boolean(state.playerPlaying),
            currentTrackId: typeof state.currentTrackId === 'string' ? state.currentTrackId : null,
            currentTime: typeof state.currentTime === 'number' ? state.currentTime : 0,
        };
    } catch {
        return {
            playerVolume: defaultBgmVolume,
            playerPlaying: false,
            currentTrackId: null,
            currentTime: 0,
        };
    }
};
