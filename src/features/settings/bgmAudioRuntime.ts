import type { BgmTrack } from './tracks';

// INFO: 실제 audio 엘리먼트는 화면 전환 후에도 재생을 유지해야 해서 모듈 싱글턴으로 둡니다.
export const bgmAudio = typeof window !== 'undefined' ? new Audio() : null;

// INFO: audio.src는 절대 URL로 바뀌므로, 비교 전에 동일한 기준의 URL 문자열로 정규화합니다.
const toAbsoluteAudioSrc = (src: string) => {
    if (typeof window === 'undefined') {
        return src;
    }

    return new URL(src, window.location.origin).href;
};

// INFO: 현재 store가 가리키는 trackId를 실제 트랙 메타데이터로 변환합니다.
export const getTrackById = (tracks: BgmTrack[], trackId: string | null) => {
    return tracks.find((track) => track.id === trackId) ?? null;
};

// INFO: 이전/다음 이동은 전체 트랙 배열 안에서 순환하도록 계산합니다.
export const moveTrackId = (tracks: BgmTrack[], trackId: string | null, step: -1 | 1) => {
    if (tracks.length === 0) {
        return null;
    }

    const currentIndex = tracks.findIndex((track) => track.id === trackId);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + step + tracks.length) % tracks.length;

    return tracks[nextIndex]?.id ?? null;
};

// INFO: 현재 선택된 트랙을 audio src와 맞춰주는 동기화 함수입니다.
export const syncAudioTrack = (tracks: BgmTrack[], trackId: string | null) => {
    if (!bgmAudio) {
        return null;
    }

    const track = getTrackById(tracks, trackId);

    if (!track) {
        return null;
    }

    const nextSrc = toAbsoluteAudioSrc(track.src);

    if (bgmAudio.src !== nextSrc) {
        bgmAudio.src = track.src;
    }

    return track;
};

// INFO: 새로고침 복원이나 트랙 이동 시점에 audio 재생 위치를 store 값과 맞춥니다.
export const syncAudioCurrentTime = (currentTime: number) => {
    if (!bgmAudio || !Number.isFinite(currentTime)) {
        return;
    }

    if (Math.abs(bgmAudio.currentTime - currentTime) > 0.25) {
        bgmAudio.currentTime = currentTime;
    }
};

// INFO: 현재 트랙 재생은 항상 track 동기화 후 시도하고, 실패 처리는 호출부에서 정합니다.
export const playCurrentTrack = async (tracks: BgmTrack[], trackId: string | null, onFail?: () => void) => {
    if (!bgmAudio) {
        return;
    }

    const track = syncAudioTrack(tracks, trackId);

    if (!track) {
        return;
    }

    try {
        await bgmAudio.play();
    } catch {
        onFail?.();
    }
};

// INFO: autoplay 정책에 막힌 경우 첫 사용자 인터랙션에서 재생을 다시 시도합니다.
export const armResumeOnInteraction = (
    tracks: BgmTrack[],
    getSnapshot: () => { currentTrackId: string | null; playerPlaying: boolean }
) => {
    if (typeof window === 'undefined') {
        return;
    }

    const handleResume = () => {
        const snapshot = getSnapshot();

        if (snapshot.playerPlaying) {
            void playCurrentTrack(tracks, snapshot.currentTrackId);
        }

        window.removeEventListener('pointerdown', handleResume);
        window.removeEventListener('keydown', handleResume);
    };

    window.addEventListener('pointerdown', handleResume, { once: true });
    window.addEventListener('keydown', handleResume, { once: true });
};
