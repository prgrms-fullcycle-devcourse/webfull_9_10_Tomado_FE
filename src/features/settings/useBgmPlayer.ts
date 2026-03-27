import type { ChangeEvent } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
    armResumeOnInteraction,
    bgmAudio,
    getTrackById,
    moveTrackId,
    playCurrentTrack,
    syncAudioCurrentTime,
    syncAudioTrack,
} from './bgmAudioRuntime';
import { bgmStorageKey, getPersistedBgmState } from './bgmStorage';
import { bgmPlayerItems, bgmTracks } from './tracks';

// INFO: store와 audio 싱글턴이 같은 초기값에서 시작하도록 persisted 상태를 먼저 읽습니다.
const persistedInitialState = getPersistedBgmState();

if (bgmAudio) {
    bgmAudio.preload = 'auto';
    bgmAudio.volume = persistedInitialState.playerVolume / 100;
    syncAudioTrack(bgmTracks, persistedInitialState.currentTrackId);
    syncAudioCurrentTime(persistedInitialState.currentTime);
}

interface BgmPlayerStoreState {
    playerVolume: number;
    playerPlaying: boolean;
    currentTrackId: string | null;
    currentTime: number;
    setPlayerVolume: (volume: number) => void;
    setPlayerPlaying: (playing: boolean) => void;
    setCurrentTrackId: (trackId: string | null) => void;
    setCurrentTime: (time: number) => void;
}

// INFO: BGM 전역 상태는 현재 트랙/재생 여부/볼륨/재생 위치까지만 관리합니다.
const useBgmPlayerStore = create<BgmPlayerStoreState>()(
    persist(
        (set) => ({
            playerVolume: persistedInitialState.playerVolume,
            playerPlaying: persistedInitialState.playerPlaying,
            currentTrackId: persistedInitialState.currentTrackId,
            currentTime: persistedInitialState.currentTime,
            setPlayerVolume: (volume) => {
                if (bgmAudio) {
                    bgmAudio.volume = volume / 100;
                }

                set({ playerVolume: volume });
            },
            setPlayerPlaying: (playing) => {
                set({ playerPlaying: playing });
            },
            setCurrentTrackId: (trackId) => {
                set({ currentTrackId: trackId });
            },
            setCurrentTime: (time) => {
                set({ currentTime: time });
            },
        }),
        {
            name: bgmStorageKey,
            partialize: (state) => ({
                playerVolume: state.playerVolume,
                playerPlaying: state.playerPlaying,
                currentTrackId: state.currentTrackId,
                currentTime: state.currentTime,
            }),
        }
    )
);

if (bgmAudio) {
    // INFO: audio 엘리먼트 이벤트를 store와 동기화해서 화면 전환 후에도 상태를 이어갑니다.
    const audio = bgmAudio;
    const initialState = useBgmPlayerStore.getState();
    audio.volume = initialState.playerVolume / 100;

    audio.addEventListener('ended', () => {
        const nextTrackId = moveTrackId(bgmTracks, useBgmPlayerStore.getState().currentTrackId, 1);

        if (!nextTrackId) {
            useBgmPlayerStore.getState().setPlayerPlaying(false);
            return;
        }

        useBgmPlayerStore.getState().setCurrentTrackId(nextTrackId);
        useBgmPlayerStore.getState().setCurrentTime(0);

        if (useBgmPlayerStore.getState().playerPlaying) {
            playCurrentTrack(bgmTracks, nextTrackId, () => useBgmPlayerStore.getState().setPlayerPlaying(false));
        }
    });

    audio.addEventListener('timeupdate', () => {
        useBgmPlayerStore.getState().setCurrentTime(audio.currentTime);
    });

    if (initialState.playerPlaying && audio.paused) {
        playCurrentTrack(bgmTracks, initialState.currentTrackId, () => {
            armResumeOnInteraction(bgmTracks, useBgmPlayerStore.getState);
        });
    }
}

export const useBgmPlayer = () => {
    // INFO: 이 훅은 UI가 바로 사용할 핸들러와 현재 재생 상태만 노출합니다.
    const playerVolume = useBgmPlayerStore((state) => state.playerVolume);
    const playerPlaying = useBgmPlayerStore((state) => state.playerPlaying);
    const currentTrackId = useBgmPlayerStore((state) => state.currentTrackId);
    const currentTime = useBgmPlayerStore((state) => state.currentTime);
    const setPlayerVolume = useBgmPlayerStore((state) => state.setPlayerVolume);
    const setPlayerPlaying = useBgmPlayerStore((state) => state.setPlayerPlaying);
    const setCurrentTrackId = useBgmPlayerStore((state) => state.setCurrentTrackId);
    const setCurrentTime = useBgmPlayerStore((state) => state.setCurrentTime);

    const currentTrack = getTrackById(bgmTracks, currentTrackId);

    // INFO: 훅 렌더마다 시간을 다시 밀어넣으면 재생 중 위치가 튈 수 있어서 트랙만 동기화합니다.
    syncAudioTrack(bgmTracks, currentTrackId);

    if (bgmAudio && currentTrack && playerPlaying && bgmAudio.paused) {
        playCurrentTrack(bgmTracks, currentTrack.id, () => {
            armResumeOnInteraction(bgmTracks, useBgmPlayerStore.getState);
        });
    }

    // INFO: input range는 값만 바꾸고 실제 volume 반영은 store setter에서 처리합니다.
    const handlePlayerVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlayerVolume(Number(event.target.value));
    };

    const handlePlayerToggle = () => {
        if (!bgmAudio || !currentTrack) {
            return;
        }

        if (playerPlaying) {
            bgmAudio.pause();
            setPlayerPlaying(false);
            return;
        }

        setPlayerPlaying(true);
        playCurrentTrack(bgmTracks, currentTrack.id, () => {
            armResumeOnInteraction(bgmTracks, useBgmPlayerStore.getState);
        });
    };

    const handlePlayerPrevious = () => {
        const nextTrackId = moveTrackId(bgmTracks, currentTrackId, -1);

        if (!nextTrackId) {
            return;
        }

        setCurrentTrackId(nextTrackId);
        setCurrentTime(0);

        if (playerPlaying) {
            playCurrentTrack(bgmTracks, nextTrackId, () => setPlayerPlaying(false));
        }
    };

    const handlePlayerNext = () => {
        const nextTrackId = moveTrackId(bgmTracks, currentTrackId, 1);

        if (!nextTrackId) {
            return;
        }

        setCurrentTrackId(nextTrackId);
        setCurrentTime(0);

        if (playerPlaying) {
            playCurrentTrack(bgmTracks, nextTrackId, () => setPlayerPlaying(false));
        }
    };

    const handlePlayerItemSelect = (categoryId: string) => {
        const nextTrack = bgmTracks.find((track) => track.category === categoryId);

        if (!nextTrack) {
            return;
        }

        setCurrentTrackId(nextTrack.id);
        setCurrentTime(0);
        setPlayerPlaying(true);
        playCurrentTrack(bgmTracks, nextTrack.id, () => {
            armResumeOnInteraction(bgmTracks, useBgmPlayerStore.getState);
        });
    };

    const playerItems = bgmPlayerItems.map((item) => ({
        ...item,
        active: currentTrack?.category === item.id,
    }));

    return {
        playerItems,
        playerVolume,
        playerPlaying,
        currentTrack,
        onPlayerVolumeChange: handlePlayerVolumeChange,
        onPlayerToggle: handlePlayerToggle,
        onPlayerPrevious: handlePlayerPrevious,
        onPlayerNext: handlePlayerNext,
        onPlayerItemSelect: handlePlayerItemSelect,
    };
};
