import { useMemo } from 'react';
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
    const focusSeconds = useTimerStore((state) => state.focusSeconds);
    const shortBreakSeconds = useTimerStore((state) => state.shortBreakSeconds);
    const longBreakSeconds = useTimerStore((state) => state.longBreakSeconds);
    const sessionType = useTimerStore((state) => state.sessionType);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const isRunning = useTimerStore((state) => state.isRunning);
    const stopConfirmOpen = useTimerStore((state) => state.stopConfirmOpen);
    const activeSessionId = useTimerStore((state) => state.activeSessionId);
    const focusSessionInSet = useTimerStore((state) => state.focusSessionInSet);
    const completedFocusSessions = useTimerStore((state) => state.completedFocusSessions);
    const completedSets = useTimerStore((state) => state.completedSets);
    const toggle = useTimerStore((state) => state.toggle);
    const openStopConfirm = useTimerStore((state) => state.openStopConfirm);
    const closeStopConfirm = useTimerStore((state) => state.closeStopConfirm);
    const confirmStop = useTimerStore((state) => state.confirmStop);

    const initialSeconds = useMemo(() => {
        if (sessionType === 'shortBreak') {
            return shortBreakSeconds;
        }

        if (sessionType === 'longBreak') {
            return longBreakSeconds;
        }

        return focusSeconds;
    }, [focusSeconds, longBreakSeconds, sessionType, shortBreakSeconds]);

    const timerParts = useMemo(() => formatTimeParts(remainingSeconds), [remainingSeconds]);
    const progress = useMemo(
        () => (initialSeconds - remainingSeconds) / initialSeconds,
        [initialSeconds, remainingSeconds]
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

    return {
        initialSeconds,
        remainingSeconds,
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
        handleRequestStopTimer: openStopConfirm,
        handleCloseStopConfirm: closeStopConfirm,
        handleConfirmStopTimer: confirmStop,
    };
};
