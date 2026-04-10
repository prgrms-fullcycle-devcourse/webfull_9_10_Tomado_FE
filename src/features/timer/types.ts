import type { HTMLAttributes, ReactNode } from 'react';
import type { useTimerSessionView } from './useTimerSessionView';

export type TTimerSessionType = 'focus' | 'short_break' | 'long_break';

export type TTimerStore = ITimerState & ITimerActions;

export type TDirectionShortcut = 'left' | 'right' | 'up' | 'down';

export interface ITimerControllerContext {
    timerSession: ReturnType<typeof useTimerSessionView>;
    handleToggleTimer: () => void;
    handleRequestStopTimer: () => void;
    handleSkipBreak: () => void;
}

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
    skipBreak: () => void;
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
    focusSessionInSet?: number;
    timerMinutes: string;
    timerSeconds: string;
    tomatoProgress: number;
    onRequestStop: () => void;
    onToggleTimer: () => void;
    onSkipBreak: () => void;
}
export interface ITimerProgressBarProps {
    timerSession: ReturnType<typeof useTimerSessionView>;
}

export interface IFocusModeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    open?: boolean;
    backgroundIndex?: number;
    onClose?: () => void;
    onMusicClick?: () => void;
    handleToggleTimer: () => void;
    handleRequestStopTimer: () => void;
    handleSkipBreak: () => void;
    children?: ReactNode;
    timerSession: ReturnType<typeof useTimerSessionView>;
}

export interface ITimerMetadataOptions {
    isRunning: boolean;
    sessionType: TTimerSessionType;
    minutes: string;
    seconds: string;
}

export interface IBackgroundTransitionState {
    previousIndex: number;
    currentIndex: number;
    direction: TDirectionShortcut;
    phase: 'prepare' | 'animate';
}

export interface IFocusModeBackgroundStoreState {
    backgroundIndex: number;
    setBackgroundIndex: (index: number) => void;
}
