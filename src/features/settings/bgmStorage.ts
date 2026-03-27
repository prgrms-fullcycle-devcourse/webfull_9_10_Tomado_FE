import { bgmTracks } from './tracks';

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
    // INFO: 저장된 값이 없을 때는 첫 트랙과 기본 볼륨으로 안전하게 시작합니다.
    const fallbackTrackId = bgmTracks[0]?.id ?? null;

    if (typeof window === 'undefined') {
        return {
            playerVolume: defaultBgmVolume,
            playerPlaying: false,
            currentTrackId: fallbackTrackId,
            currentTime: 0,
        };
    }

    try {
        const raw = window.localStorage.getItem(bgmStorageKey);

        if (!raw) {
            return {
                playerVolume: defaultBgmVolume,
                playerPlaying: false,
                currentTrackId: fallbackTrackId,
                currentTime: 0,
            };
        }

        const parsed = JSON.parse(raw) as { state?: Partial<BgmPersistedState> };
        const state = parsed.state ?? {};

        return {
            playerVolume: typeof state.playerVolume === 'number' ? state.playerVolume : defaultBgmVolume,
            playerPlaying: Boolean(state.playerPlaying),
            currentTrackId: typeof state.currentTrackId === 'string' ? state.currentTrackId : fallbackTrackId,
            currentTime: typeof state.currentTime === 'number' ? state.currentTime : 0,
        };
    } catch {
        return {
            playerVolume: defaultBgmVolume,
            playerPlaying: false,
            currentTrackId: fallbackTrackId,
            currentTime: 0,
        };
    }
};
