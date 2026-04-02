import { useCallback, useEffect, useMemo, useState } from 'react';

import { useModal } from '@/hooks';

import { useTimerStore } from './useTimerStore';

const formatTimeParts = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};

export const useTimerSession = () => {
    const { showModal } = useModal();
    const focusSeconds = useTimerStore((state) => state.focusSeconds);
    const shortBreakSeconds = useTimerStore((state) => state.shortBreakSeconds);
    const longBreakSeconds = useTimerStore((state) => state.longBreakSeconds);
    const sessionType = useTimerStore((state) => state.sessionType);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const isRunning = useTimerStore((state) => state.isRunning);
    const lastTickAt = useTimerStore((state) => state.lastTickAt);
    const stopConfirmOpen = useTimerStore((state) => state.stopConfirmOpen);
    const activeSessionId = useTimerStore((state) => state.activeSessionId);
    const focusSessionInSet = useTimerStore((state) => state.focusSessionInSet);
    const completedFocusSessions = useTimerStore((state) => state.completedFocusSessions);
    const completedSets = useTimerStore((state) => state.completedSets);
    const toggle = useTimerStore((state) => state.toggle);
    const closeStopConfirm = useTimerStore((state) => state.closeStopConfirm);
    const confirmStop = useTimerStore((state) => state.confirmStop);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        let frameId = 0;

        const update = () => {
            setNow(Date.now());
            frameId = window.requestAnimationFrame(update);
        };

        frameId = window.requestAnimationFrame(update);

        return () => window.cancelAnimationFrame(frameId);
    }, [isRunning]);

    const initialSeconds = useMemo(() => {
        if (sessionType === 'shortBreak') {
            return shortBreakSeconds;
        }

        if (sessionType === 'longBreak') {
            return longBreakSeconds;
        }

        return focusSeconds;
    }, [focusSeconds, longBreakSeconds, sessionType, shortBreakSeconds]);

    const visualRemainingSeconds = useMemo(() => {
        if (!isRunning || lastTickAt === null) {
            return remainingSeconds;
        }

        const elapsedSeconds = Math.max(0, (now - lastTickAt) / 1000);

        return Math.max(0, remainingSeconds - elapsedSeconds);
    }, [isRunning, lastTickAt, now, remainingSeconds]);

    const timerParts = useMemo(() => formatTimeParts(Math.ceil(visualRemainingSeconds)), [visualRemainingSeconds]);
    const progress = useMemo(
        () => (initialSeconds - visualRemainingSeconds) / initialSeconds,
        [initialSeconds, visualRemainingSeconds]
    );
    const sessionLabel = useMemo(() => {
        if (sessionType === 'shortBreak') {
            return '휴식';
        }

        if (sessionType === 'longBreak') {
            return '장휴식';
        }

        return '집중';
    }, [sessionType]);

    const handleRequestStopTimer = useCallback(() => {
        showModal({
            title: '집중 세션 중단',
            description: '세션 중단 시 기록은 저장되지 않아요. 그래도 중단 하시겠어요?',
            tone: 'danger',
            confirmLabel: '중단하기',
            onConfirm: confirmStop,
            onCancel: closeStopConfirm,
            onClose: closeStopConfirm,
        });
    }, [closeStopConfirm, confirmStop, showModal]);

    return {
        initialSeconds,
        remainingSeconds,
        visualRemainingSeconds,
        sessionType,
        sessionLabel,
        isRunning,
        hasStarted: remainingSeconds !== initialSeconds,
        stopConfirmOpen,
        activeSessionId,
        focusSessionInSet,
        completedFocusSessions,
        completedSets,
        sessionIndicatorFilledCount: focusSessionInSet,
        timerParts,
        timerProgress: progress,
        progress,
        handleToggleTimer: toggle,
        handleRequestStopTimer,
        handleCloseStopConfirm: closeStopConfirm,
        handleConfirmStopTimer: confirmStop,
    };
};
