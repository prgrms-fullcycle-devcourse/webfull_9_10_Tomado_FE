import { create } from 'zustand';

// INFO: 현재는 25분 집중, 5분 휴식, 15분 장휴식을 기본값으로 사용한다.
// INFO: 추후 사용자 설정 API가 붙으면 setDurations로 이 값을 갱신할 수 있다.
const DEFAULT_FOCUS_SECONDS = 0.5 * 60;
const DEFAULT_SHORT_BREAK_SECONDS = 0.1 * 60;
const DEFAULT_LONG_BREAK_SECONDS = 0.5 * 60;
const FOCUS_SESSIONS_PER_SET = 4;

export type TimerSessionType = 'focus' | 'shortBreak' | 'longBreak';

interface TimerDurations {
    focusSeconds: number;
    shortBreakSeconds: number;
    longBreakSeconds: number;
}

interface SetDurationsOptions {
    resetCurrent?: boolean;
}

interface TimerStoreState extends TimerDurations {
    // INFO: sessionType은 현재 세션이 집중/짧은휴식/긴휴식 중 무엇인지 나타낸다.
    sessionType: TimerSessionType;
    remainingSeconds: number;
    isRunning: boolean;
    stopConfirmOpen: boolean;
    // INFO: activeSessionId는 서버가 발급한 "현재 진행 중인 세션 레코드 id"를 담을 자리다.
    // INFO: API 연동 전까지는 null 상태로 두고, 세션 시작 응답을 받으면 저장한다.
    activeSessionId: number | null;
    // INFO: focusSessionInSet은 현재 세트 안에서 몇 번째 집중 세션인지 나타낸다. (1~4)
    focusSessionInSet: number;
    completedFocusSessions: number;
    completedSets: number;
    // INFO: 자연 종료로 세션이 전환되면, 어떤 세션이 끝났는지 알림 훅에서 읽을 수 있도록 기록한다.
    lastCompletedSessionType: TimerSessionType | null;
    lastCompletedAt: number | null;
    // INFO: 마지막 tick 시각을 기준으로 실제 경과 시간을 계산한다.
    lastTickAt: number | null;
    setDurations: (durations: Partial<TimerDurations>, options?: SetDurationsOptions) => void;
    start: () => void;
    pause: () => void;
    toggle: () => void;
    tick: (now?: number) => void;
    advanceSession: () => void;
    openStopConfirm: () => void;
    closeStopConfirm: () => void;
    setActiveSessionId: (sessionId: number | null) => void;
    clearActiveSessionId: () => void;
    confirmStop: () => void;
}

const getDurationForSession = (
    state: Pick<TimerStoreState, 'sessionType' | 'focusSeconds' | 'shortBreakSeconds' | 'longBreakSeconds'>
) => {
    if (state.sessionType === 'shortBreak') {
        return state.shortBreakSeconds;
    }

    if (state.sessionType === 'longBreak') {
        return state.longBreakSeconds;
    }

    return state.focusSeconds;
};

const getNextSessionState = (state: TimerStoreState, options?: { autoStart?: boolean; now?: number }) => {
    const autoStart = options?.autoStart ?? false;
    const now = options?.now ?? Date.now();
    const runningState = autoStart
        ? {
              isRunning: true,
              lastTickAt: now,
          }
        : {
              isRunning: false,
              lastTickAt: null,
          };

    if (state.sessionType === 'focus') {
        const nextCompletedFocusSessions = state.completedFocusSessions + 1;
        const completedCurrentSet = nextCompletedFocusSessions % FOCUS_SESSIONS_PER_SET === 0;
        const nextSessionType: TimerSessionType = completedCurrentSet ? 'longBreak' : 'shortBreak';

        return {
            sessionType: nextSessionType,
            remainingSeconds: completedCurrentSet ? state.longBreakSeconds : state.shortBreakSeconds,
            ...runningState,
            focusSessionInSet: state.focusSessionInSet,
            completedFocusSessions: nextCompletedFocusSessions,
            completedSets: state.completedSets,
        };
    }

    if (state.sessionType === 'shortBreak') {
        return {
            sessionType: 'focus' as const,
            remainingSeconds: state.focusSeconds,
            ...runningState,
            focusSessionInSet: Math.min(FOCUS_SESSIONS_PER_SET, state.focusSessionInSet + 1),
            completedFocusSessions: state.completedFocusSessions,
            completedSets: state.completedSets,
        };
    }

    return {
        sessionType: 'focus' as const,
        remainingSeconds: state.focusSeconds,
        ...runningState,
        focusSessionInSet: 1,
        completedFocusSessions: state.completedFocusSessions,
        completedSets: state.completedSets + 1,
    };
};

export const useTimerStore = create<TimerStoreState>()((set) => ({
    focusSeconds: DEFAULT_FOCUS_SECONDS,
    shortBreakSeconds: DEFAULT_SHORT_BREAK_SECONDS,
    longBreakSeconds: DEFAULT_LONG_BREAK_SECONDS,
    sessionType: 'focus',
    remainingSeconds: DEFAULT_FOCUS_SECONDS,
    isRunning: false,
    stopConfirmOpen: false,
    activeSessionId: null,
    focusSessionInSet: 1,
    completedFocusSessions: 0,
    completedSets: 0,
    lastCompletedSessionType: null,
    lastCompletedAt: null,
    lastTickAt: null,
    setDurations: (durations, options) =>
        set((state) => {
            const nextState = {
                ...state,
                ...durations,
            };
            const nextCurrentDuration = getDurationForSession(nextState);
            const currentDuration = getDurationForSession(state);
            const shouldResetCurrent =
                options?.resetCurrent === true || (!state.isRunning && state.remainingSeconds === currentDuration);

            return {
                ...durations,
                remainingSeconds: shouldResetCurrent ? nextCurrentDuration : state.remainingSeconds,
            };
        }),
    start: () =>
        set((state) => {
            if (state.isRunning) {
                return state;
            }

            const currentDuration = getDurationForSession(state);
            const nextRemainingSeconds = state.remainingSeconds === 0 ? currentDuration : state.remainingSeconds;

            return {
                isRunning: true,
                remainingSeconds: nextRemainingSeconds,
                lastTickAt: Date.now(),
            };
        }),
    pause: () =>
        set((state) => ({
            ...state,
            isRunning: false,
            lastTickAt: null,
        })),
    toggle: () =>
        set((state) => {
            if (state.isRunning) {
                return {
                    isRunning: false,
                    lastTickAt: null,
                };
            }

            const currentDuration = getDurationForSession(state);

            return {
                isRunning: true,
                remainingSeconds: state.remainingSeconds === 0 ? currentDuration : state.remainingSeconds,
                lastTickAt: Date.now(),
            };
        }),
    tick: (now = Date.now()) =>
        set((state) => {
            if (!state.isRunning || state.lastTickAt === null) {
                return state;
            }

            // INFO: 전역 ticker는 1초마다 돌지만, 실제 감소량은 lastTickAt 기준 경과 시간으로 계산한다.
            // INFO: 이 방식이면 FocusMode 같은 오버레이가 열려도 같은 세션 시간을 공유할 수 있다.
            const elapsedSeconds = Math.floor((now - state.lastTickAt) / 1000);

            if (elapsedSeconds < 1) {
                return state;
            }

            const nextRemainingSeconds = Math.max(0, state.remainingSeconds - elapsedSeconds);

            if (nextRemainingSeconds === 0) {
                return {
                    ...state,
                    ...getNextSessionState(state, { autoStart: true, now }),
                    lastCompletedSessionType: state.sessionType,
                    lastCompletedAt: now,
                };
            }

            return {
                ...state,
                remainingSeconds: nextRemainingSeconds,
                lastTickAt: state.lastTickAt + elapsedSeconds * 1000,
            };
        }),
    advanceSession: () =>
        set((state) => ({
            ...state,
            ...getNextSessionState(state),
        })),
    openStopConfirm: () => set({ stopConfirmOpen: true }),
    closeStopConfirm: () => set({ stopConfirmOpen: false }),
    setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
    clearActiveSessionId: () => set({ activeSessionId: null }),
    confirmStop: () =>
        set((state) => ({
            // INFO: confirmStop은 현재 세션을 완전히 중단하고, 남은 시간을 현재 세션 타입의 기본값으로 되돌린다.
            remainingSeconds: getDurationForSession(state),
            isRunning: false,
            stopConfirmOpen: false,
            activeSessionId: null,
            lastTickAt: null,
        })),
}));
