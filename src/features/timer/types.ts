export type TTimerSessionType = 'focus' | 'short_break' | 'long_break';

export type TTimerStore = ITimerState & ITimerActions;

export interface ITimerDurations {
    focusSeconds: number;
    shortBreakSeconds: number;
    longBreakSeconds: number;
    sessionsPerSet: number;
}

export interface ISetDurationsOptions {
    resetCurrent?: boolean;
}

export interface ITimerState extends ITimerDurations {
    sessionType: TTimerSessionType;
    remainingSeconds: number;
    isRunning: boolean;
    stopConfirmOpen: boolean;
    activeSessionId: string | null;
    focusSessionInSet: number;
    completedFocusSessions: number;
    completedSets: number;
    lastCompletedSessionType: TTimerSessionType | null;
    lastCompletedAt: number | null;
    lastTickAt: number | null;
}

export interface ITimerActions {
    setDurations: (durations: Partial<ITimerDurations>, options?: ISetDurationsOptions) => void;
    start: () => void;
    pause: () => void;
    toggle: () => void;
    tick: (now?: number) => void;
    advanceSession: () => void;
    openStopConfirm: () => void;
    closeStopConfirm: () => void;
    setActiveSessionId: (sessionId: string | null) => void;
    clearActiveSessionId: () => void;
    confirmStop: () => void;
}

export interface ITimerPanelProps {
    hasStarted: boolean;
    isRunning: boolean;
    sessionType?: TTimerSessionType;
    sessionIndicatorFilledCount?: number;
    timerMinutes: string;
    timerSeconds: string;
    tomatoProgress: number;
    onRequestStop: () => void;
    onToggleTimer: () => void;
}
