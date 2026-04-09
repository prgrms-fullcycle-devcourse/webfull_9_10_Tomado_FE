import { useEffect, useMemo, useState } from 'react';

import { formatTimeLabel, formatTimeParts } from '@/utils';
import { useTimerStore, getDurationForSession } from './useTimerStore';

export const useTimerSessionView = () => {
    const [now, setNow] = useState(() => Date.now());

    const isRunning = useTimerStore((state) => state.isRunning);

    const sessionType = useTimerStore((state) => state.sessionType);
    const initialSeconds = useTimerStore(getDurationForSession);

    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const focusSessionInSet = useTimerStore((state) => state.focusSessionInSet);
    const completedSets = useTimerStore((state) => state.completedSets);
    const lastTickAt = useTimerStore((state) => state.lastTickAt);

    // INFO: 타이머 실행 중일 시, 현재 시각 갱신하는 루프
    useEffect(() => {
        if (!isRunning) {
            return;
        }

        let frameId = 0;

        // now 상태를 현재 시각으로 갱신 + 다음 에니메이션 프레임에서도 자기 자신을 다시 예약
        const update = () => {
            setNow(Date.now());
            frameId = window.requestAnimationFrame(update);
        };

        frameId = window.requestAnimationFrame(update);

        // 컴포넌트 언마운트 또는 해당 effect가 다시 실행되기 전에 애니메이션 프레임 정리
        return () => window.cancelAnimationFrame(frameId);
    }, [isRunning]);

    // INFO: 시각적으로 표시할 남은 시간 계산
    const visualRemainingSeconds = useMemo(() => {
        // 타이머가 실행중이지 않다면, store에 저장된 기준으로 남은 시간 반환
        if (!isRunning || lastTickAt === null) return remainingSeconds;

        // 타이머가 실행중이라면, 현재 시각과 마지막 틱 시각의 차이를 계산하여 남은 시간 반환
        const elapsedSeconds = Math.max(0, (now - lastTickAt) / 1000);
        return Math.max(0, remainingSeconds - elapsedSeconds);
    }, [isRunning, lastTickAt, now, remainingSeconds]);

    // INFO: 타이머 파트 계산
    const timerParts = useMemo(() => formatTimeParts(Math.ceil(visualRemainingSeconds)), [visualRemainingSeconds]);
    const timeLabel = useMemo(() => formatTimeLabel(Math.ceil(visualRemainingSeconds)), [visualRemainingSeconds]);

    // INFO: 진행률 계산
    const progress = useMemo(
        () =>
            initialSeconds <= 0
                ? 0
                : Math.min(1, Math.max(0, (initialSeconds - visualRemainingSeconds) / initialSeconds)),
        [initialSeconds, visualRemainingSeconds]
    );

    return {
        isRunning,
        sessionType,
        completedSets,
        visualRemainingSeconds,
        timerParts,
        timeLabel,
        progress,
        hasStarted: remainingSeconds !== initialSeconds,
        focusSessionInSet,
    };
};
