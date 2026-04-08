import { useEffect, useState } from 'react';
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
import { buildBgmPlayerItems, loadBgmTracks, type BgmTrack } from './tracks';

// INFO: store와 audio 싱글턴이 같은 초기값에서 시작하도록 persisted 상태를 먼저 읽습니다.
const persistedInitialState = getPersistedBgmState();

if (bgmAudio) {
    bgmAudio.preload = 'auto';
    bgmAudio.volume = persistedInitialState.playerVolume / 100;
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

export const useBgmPlayer = () => {
    const [bgmTracks, setBgmTracks] = useState<BgmTrack[]>([]);
    // INFO: 이 훅은 UI가 바로 사용할 핸들러와 현재 재생 상태만 노출합니다.
    const playerVolume = useBgmPlayerStore((state) => state.playerVolume);
    const playerPlaying = useBgmPlayerStore((state) => state.playerPlaying);
    const currentTrackId = useBgmPlayerStore((state) => state.currentTrackId);
    const currentTime = useBgmPlayerStore((state) => state.currentTime);
    const setPlayerVolume = useBgmPlayerStore((state) => state.setPlayerVolume);
    const setPlayerPlaying = useBgmPlayerStore((state) => state.setPlayerPlaying);
    const setCurrentTrackId = useBgmPlayerStore((state) => state.setCurrentTrackId);
    const setCurrentTime = useBgmPlayerStore((state) => state.setCurrentTime);

    useEffect(() => {
        let cancelled = false;

        const loadTracks = async () => {
            try {
                const tracks = await loadBgmTracks();

                if (!cancelled) {
                    setBgmTracks(tracks);
                }
            } catch (error) {
                console.error('BGM 목록을 불러오지 못했습니다.', error);
            }
        };

        void loadTracks();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!bgmAudio || bgmTracks.length === 0) {
            return;
        }

        const resolvedTrackId = getTrackById(bgmTracks, currentTrackId)?.id ?? bgmTracks[0]?.id ?? null;

        if (resolvedTrackId !== currentTrackId) {
            setCurrentTrackId(resolvedTrackId);
            setCurrentTime(0);
            return;
        }

        syncAudioTrack(bgmTracks, resolvedTrackId);
        syncAudioCurrentTime(currentTime);

        if (playerPlaying && bgmAudio.paused) {
            playCurrentTrack(bgmTracks, resolvedTrackId, () => {
                armResumeOnInteraction(bgmTracks, useBgmPlayerStore.getState);
            });
        }
    }, [bgmTracks, currentTime, currentTrackId, playerPlaying, setCurrentTime, setCurrentTrackId]);

    useEffect(() => {
        if (!bgmAudio || bgmTracks.length === 0) {
            return;
        }

        const audio = bgmAudio;

        const handleEnded = () => {
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
        };

        const handleTimeUpdate = () => {
            useBgmPlayerStore.getState().setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [bgmTracks]);

    const currentTrack = getTrackById(bgmTracks, currentTrackId);

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

    const playerItems = buildBgmPlayerItems(bgmTracks).map((item) => ({
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
        tracksReady: bgmTracks.length > 0,
    };
};
