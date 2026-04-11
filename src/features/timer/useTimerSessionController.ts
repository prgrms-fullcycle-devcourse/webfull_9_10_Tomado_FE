import { useCallback, useEffect, useRef } from 'react';

import { useModal, useToast } from '@/hooks';
import { useTimerStore, getDurationForSession } from './useTimerStore';
import { useStartPomodoroSession, useEndPomodoroSession } from '@/api/generated/pomodoro/pomodoro';

export const useTimerSessionController = () => {
    const { showModal } = useModal();
    const { showToast } = useToast();
    const lastHandledCompletedAtRef = useRef<number | null>(null);

    const isRunning = useTimerStore((state) => state.isRunning);
    const initialSeconds = useTimerStore(getDurationForSession);
    const activeSessionId = useTimerStore((state) => state.activeSessionId);
    const sessionType = useTimerStore((state) => state.sessionType);
    const lastCompletedAt = useTimerStore((state) => state.lastCompletedAt);

    const setActiveSessionId = useTimerStore((state) => state.setActiveSessionId);
    const clearActiveSessionId = useTimerStore((state) => state.clearActiveSessionId);
    const skipBreak = useTimerStore((state) => state.skipBreak);
    const startPomodoroSessionMutation = useStartPomodoroSession();
    const endPomodoroSessionMutation = useEndPomodoroSession();
    const toggle = useTimerStore((state) => state.toggle);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);

    const closeStopConfirm = useTimerStore((state) => state.closeStopConfirm);
    const confirmStop = useTimerStore((state) => state.confirmStop);

    // INFO: 타이머 토글 핸들러
    const handleToggleTimer = useCallback(async () => {
        // 타이머가 실행 중이면 토글만 실행 후 리턴 / 세션 ID 생성 X
        if (isRunning) {
            toggle();
            return;
        }

        // 서버 세션 ID가 이미 있으면 토글만 실행 후 리턴 / 세션 ID 생성 X
        if (activeSessionId) {
            toggle();
            return;
        }

        // 서버 호출 지연으로 인해 UI가 먼저 업데이트되도록 토글 실행
        toggle();

        try {
            const session = await startPomodoroSessionMutation.mutateAsync({
                data: { type: sessionType },
            });

            // 세션 ID를 store에 저장
            if (session.id) setActiveSessionId(session.id);
        } catch (error) {
            confirmStop();
            showToast({
                iconName: 'error',
                message: '포모도로 세션 시작에 실패했습니다. 잠시 후 다시 시도해주세요.',
                duration: 3000,
            });
        }
    }, [
        isRunning,
        sessionType,
        activeSessionId,
        setActiveSessionId,
        startPomodoroSessionMutation,
        toggle,
        confirmStop,
        showToast,
    ]);

    // INFO: 타이머 중단 핸들러
    const handleStopTimer = useCallback(async () => {
        if (!activeSessionId) {
            confirmStop();
            return;
        }

        await endPomodoroSessionMutation.mutateAsync({
            id: activeSessionId,
            data: {
                actual_sec: Math.max(0, Math.round(initialSeconds - remainingSeconds)),
                status: 'cancelled',
                ended_at: new Date().toISOString(),
            },
        });

        confirmStop();
    }, [activeSessionId, confirmStop, initialSeconds, remainingSeconds, endPomodoroSessionMutation]);

    // INFO: 타이머 중단 확인 모달
    const handleRequestStopTimer = useCallback(() => {
        showModal({
            title: '집중 세션 중단',
            description: '세션 중단 시 기록은 저장되지 않아요. 그래도 중단 하시겠어요?',
            tone: 'danger',
            confirmLabel: '중단하기',
            onConfirm: handleStopTimer,
            onCancel: closeStopConfirm,
            onClose: closeStopConfirm,
        });
    }, [closeStopConfirm, handleStopTimer, showModal]);

    const handleSkipBreak = useCallback(async () => {
        if (sessionType === 'focus') {
            return;
        }

        if (activeSessionId) {
            try {
                await endPomodoroSessionMutation.mutateAsync({
                    id: activeSessionId,
                    data: {
                        actual_sec: Math.max(0, Math.round(initialSeconds - remainingSeconds)),
                        // INFO: OpenAPI enum 반영 전이라 skipped는 로컬에서만 보정해 보냅니다.
                        status: 'skipped',
                        ended_at: new Date().toISOString(),
                    },
                });
            } catch {
                showToast({
                    iconName: 'error',
                    message: '휴식을 건너뛰지 못했습니다. 잠시 후 다시 시도해주세요.',
                    duration: 3000,
                });
                return;
            }
        }

        clearActiveSessionId();
        skipBreak();
    }, [
        activeSessionId,
        clearActiveSessionId,
        endPomodoroSessionMutation,
        initialSeconds,
        remainingSeconds,
        sessionType,
        showToast,
        skipBreak,
    ]);

    // INFO: 세션 완료 시 종료 API 호출 후 activeSessionId 정리
    useEffect(() => {
        if (!activeSessionId || !lastCompletedAt) {
            return;
        }

        if (lastHandledCompletedAtRef.current === lastCompletedAt) {
            return;
        }

        lastHandledCompletedAtRef.current = lastCompletedAt;

        const run = async () => {
            try {
                await endPomodoroSessionMutation.mutateAsync({
                    id: activeSessionId,
                    data: {
                        status: 'completed',
                        actual_sec: initialSeconds,
                        ended_at: new Date(lastCompletedAt).toISOString(),
                    },
                });

                clearActiveSessionId();

                const nextSession = await startPomodoroSessionMutation.mutateAsync({
                    data: { type: sessionType },
                });

                if (nextSession.id) {
                    setActiveSessionId(nextSession.id);
                }
            } catch (error) {
                showToast({
                    iconName: 'error',
                    message: '다음 타이머 세션을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.',
                    duration: 3000,
                });
            }
        };

        void run();
    }, [
        activeSessionId,
        clearActiveSessionId,
        endPomodoroSessionMutation,
        initialSeconds,
        lastCompletedAt,
        sessionType,
        setActiveSessionId,
        showToast,
        startPomodoroSessionMutation,
    ]);

    return {
        handleToggleTimer,
        handleRequestStopTimer,
        handleSkipBreak,
    };
};
