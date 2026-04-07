import type { TTimerSessionType } from './types';

export const getInitialSeconds = ({
    sessionType,
    focusSeconds,
    shortBreakSeconds,
    longBreakSeconds,
}: {
    sessionType: TTimerSessionType;
    focusSeconds: number;
    shortBreakSeconds: number;
    longBreakSeconds: number;
}) => {
    if (sessionType === 'short_break') return shortBreakSeconds;
    if (sessionType === 'long_break') return longBreakSeconds;
    return focusSeconds;
};
