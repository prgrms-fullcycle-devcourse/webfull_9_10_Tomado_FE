import { useEffect, useRef } from 'react';

import endBreakSound from '@/assets/audio/effects/end_break.mp3';
import endFocusSound from '@/assets/audio/effects/end_focus.mp3';
import { useToast } from '@/hooks';
import { useTimerStore } from './useTimerStore';

const focusEndAudio = typeof window !== 'undefined' ? new Audio(endFocusSound) : null;
const breakEndAudio = typeof window !== 'undefined' ? new Audio(endBreakSound) : null;

const playEffect = (audio: HTMLAudioElement | null) => {
    if (!audio) {
        return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {
        // INFO: 브라우저 정책으로 효과음 자동 재생이 막히면 이번 턴은 조용히 건너뛴다.
    });
};

export const useTimerNotifications = () => {
    const lastCompletedSessionType = useTimerStore((state) => state.lastCompletedSessionType);
    const lastCompletedAt = useTimerStore((state) => state.lastCompletedAt);
    const { showToast } = useToast();
    const lastHandledCompletedAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (!lastCompletedSessionType || lastCompletedAt === null) {
            return;
        }

        if (lastHandledCompletedAtRef.current === lastCompletedAt) {
            return;
        }

        lastHandledCompletedAtRef.current = lastCompletedAt;

        if (lastCompletedSessionType === 'focus') {
            playEffect(focusEndAudio);
            showToast('집중 시간이 종료되었어요', { durationMs: 2000 });
            return;
        }

        playEffect(breakEndAudio);
        showToast('휴식 시간이 종료되었어요', { durationMs: 2000 });
    }, [lastCompletedAt, lastCompletedSessionType, showToast]);
};
