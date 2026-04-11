import { create } from 'zustand';
import type { ITimerState, TTimerSessionType, TTimerStore } from './types';
import { devtools, persist } from 'zustand/middleware';

import { getTodayDate } from '@/utils';

const FALLBACK_FOCUS_SECONDS = 25 * 60;
const FALLBACK_SHORT_BREAK_SECONDS = 5 * 60;
const FALLBACK_LONG_BREAK_SECONDS = 15 * 60;
const FOCUS_SESSIONS_PER_SET = 4;
const TIMER_CONTEXT_STORAGE_KEY = 'timer-session-context';

type TTimerPersistedContext = Pick<
    ITimerState,
    | 'sessionType'
    | 'focusSeconds'
    | 'shortBreakSeconds'
    | 'longBreakSeconds'
    | 'sessionsPerSet'
    | 'activeSessionId'
    | 'focusSessionInSet'
    | 'completedFocusSessions'
    | 'completedSets'
> & {
    persistedAtDate: string;
};

const createInitialTimerState = (): ITimerState => ({
    focusSeconds: FALLBACK_FOCUS_SECONDS,
    shortBreakSeconds: FALLBACK_SHORT_BREAK_SECONDS,
    longBreakSeconds: FALLBACK_LONG_BREAK_SECONDS,
    sessionsPerSet: FOCUS_SESSIONS_PER_SET,
    sessionType: 'focus',
    remainingSeconds: FALLBACK_FOCUS_SECONDS,
    isRunning: false,
    stopConfirmOpen: false,
    activeSessionId: null,
    focusSessionInSet: 1,
    completedFocusSessions: 0,
    completedSets: 0,
    lastCompletedSessionType: null,
    lastCompletedAt: null,
    lastTickAt: null,
});

export const getDurationForSession = (
    state: Pick<ITimerState, 'sessionType' | 'focusSeconds' | 'shortBreakSeconds' | 'longBreakSeconds'>
) => {
    if (state.sessionType === 'short_break') return state.shortBreakSeconds;
    if (state.sessionType === 'long_break') return state.longBreakSeconds;
    return state.focusSeconds;
};

const getNextSessionState = (
    state: ITimerState,
    options?: { autoStart?: boolean; now?: number }
): Pick<
    ITimerState,
    | 'sessionType'
    | 'remainingSeconds'
    | 'isRunning'
    | 'lastTickAt'
    | 'focusSessionInSet'
    | 'completedFocusSessions'
    | 'completedSets'
> => {
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
        const completedCurrentSet = nextCompletedFocusSessions % state.sessionsPerSet === 0;
        const nextSessionType: TTimerSessionType = completedCurrentSet ? 'long_break' : 'short_break';

        return {
            sessionType: nextSessionType,
            remainingSeconds: completedCurrentSet ? state.longBreakSeconds : state.shortBreakSeconds,
            ...runningState,
            focusSessionInSet: state.focusSessionInSet,
            completedFocusSessions: nextCompletedFocusSessions,
            completedSets: completedCurrentSet ? state.completedSets + 1 : state.completedSets,
        };
    }

    if (state.sessionType === 'short_break') {
        return {
            sessionType: 'focus',
            remainingSeconds: state.focusSeconds,
            ...runningState,
            focusSessionInSet: Math.min(state.sessionsPerSet, state.focusSessionInSet + 1),
            completedFocusSessions: state.completedFocusSessions,
            completedSets: state.completedSets,
        };
    }

    return {
        sessionType: 'focus',
        remainingSeconds: state.focusSeconds,
        ...runningState,
        focusSessionInSet: 1,
        completedFocusSessions: state.completedFocusSessions,
        completedSets: state.completedSets,
    };
};

const resetRuntimeState = <
    T extends Pick<
        ITimerState,
        | 'sessionType'
        | 'focusSeconds'
        | 'shortBreakSeconds'
        | 'longBreakSeconds'
        | 'remainingSeconds'
        | 'isRunning'
        | 'stopConfirmOpen'
        | 'lastCompletedSessionType'
        | 'lastCompletedAt'
        | 'lastTickAt'
    >,
>(
    state: T
) => ({
    ...state,
    remainingSeconds: getDurationForSession(state),
    isRunning: false,
    stopConfirmOpen: false,
    lastCompletedSessionType: null,
    lastCompletedAt: null,
    lastTickAt: null,
});

const mergePersistedTimerContext = (persistedState: unknown, currentState: TTimerStore) => {
    const persistedContext = persistedState as Partial<TTimerPersistedContext> | undefined;

    if (!persistedContext || persistedContext.persistedAtDate !== getTodayDate()) {
        return currentState;
    }

    const { persistedAtDate: _persistedAtDate, ...context } = persistedContext;
    const mergedState = {
        ...currentState,
        ...context,
    };

    return {
        ...mergedState,
        ...resetRuntimeState(mergedState),
    };
};

export const useTimerStore = create<TTimerStore>()(
    persist(
        devtools((set) => ({
            ...createInitialTimerState(),
            setDurations: (durations, options) =>
                set((state) => {
                    const nextState = {
                        ...state,
                        ...durations,
                    };
                    const nextCurrentDuration = getDurationForSession(nextState);
                    const currentDuration = getDurationForSession(state);
                    const shouldResetCurrent =
                        options?.resetCurrent === true ||
                        (!state.isRunning && state.remainingSeconds === currentDuration);

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
                    const nextRemainingSeconds =
                        state.remainingSeconds === 0 ? currentDuration : state.remainingSeconds;

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
                set((state): Partial<TTimerStore> => {
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
                set((state): TTimerStore | Partial<TTimerStore> => {
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
                set(
                    (state): Partial<TTimerStore> => ({
                        ...state,
                        ...getNextSessionState(state),
                    })
                ),
            skipBreak: () =>
                set(
                    (state) => {
                        if (state.sessionType === 'focus') {
                            return state;
                        }

                        return {
                            ...getNextSessionState(state, { autoStart: true }),
                            activeSessionId: null,
                            stopConfirmOpen: false,
                            lastCompletedSessionType: null,
                            lastCompletedAt: null,
                        };
                    },
                    false,
                    'timer/skipBreak'
                ),
            openStopConfirm: () => set({ stopConfirmOpen: true }, false, 'timer/openStopConfirm'),
            closeStopConfirm: () => set({ stopConfirmOpen: false }, false, 'timer/closeStopConfirm'),
            setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }, false, 'timer/setActiveSessionId'),
            clearActiveSessionId: () => set({ activeSessionId: null }, false, 'timer/clearActiveSessionId'),
            confirmStop: () =>
                set((state) => ({
                    // INFO: confirmStop은 현재 세션을 완전히 중단하고, 남은 시간을 현재 세션 타입의 기본값으로 되돌린다.
                    remainingSeconds: getDurationForSession(state),
                    isRunning: false,
                    stopConfirmOpen: false,
                    activeSessionId: null,
                    lastTickAt: null,
                })),
        })),
        {
            name: TIMER_CONTEXT_STORAGE_KEY,
            partialize: (state) =>
                ({
                    persistedAtDate: getTodayDate(),
                    sessionType: state.sessionType,
                    focusSeconds: state.focusSeconds,
                    shortBreakSeconds: state.shortBreakSeconds,
                    longBreakSeconds: state.longBreakSeconds,
                    sessionsPerSet: state.sessionsPerSet,
                    activeSessionId: state.activeSessionId,
                    focusSessionInSet: state.focusSessionInSet,
                    completedFocusSessions: state.completedFocusSessions,
                    completedSets: state.completedSets,
                }) as unknown as TTimerStore,
            merge: (persistedState, currentState) => mergePersistedTimerContext(persistedState, currentState),
        }
    )
);
