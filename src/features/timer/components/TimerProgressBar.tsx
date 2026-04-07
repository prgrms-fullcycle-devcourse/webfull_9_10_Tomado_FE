import { useEffect, useMemo, useState } from 'react';
import { Tooltip } from '@@/ui';
import { useTimerStore } from '../useTimerStore';
import { formatTimeLabel } from '@/utils/timeUtils';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const rootClassName = 'relative z-40 h-1 w-full bg-neutral-lighter';
const fillClassName = 'h-full rounded-r-full will-change-[width]';
const tooltipWrapperClassName = 'pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 shadow-shadow-1';

const getProgressBarToneClassName = (sessionType: 'focus' | 'short_break' | 'long_break') => {
    if (sessionType === 'short_break') {
        return 'bg-green-300';
    }

    if (sessionType === 'long_break') {
        return 'bg-green-600';
    }

    return 'bg-primary';
};

export const TimerProgressBar = () => {
    const focusSeconds = useTimerStore((state) => state.focusSeconds);
    const shortBreakSeconds = useTimerStore((state) => state.shortBreakSeconds);
    const longBreakSeconds = useTimerStore((state) => state.longBreakSeconds);
    const sessionType = useTimerStore((state) => state.sessionType);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const isRunning = useTimerStore((state) => state.isRunning);
    const lastTickAt = useTimerStore((state) => state.lastTickAt);
    const [hovered, setHovered] = useState(false);
    const [now, setNow] = useState(() => Date.now());

    const totalSeconds = useMemo(() => {
        if (sessionType === 'short_break') {
            return shortBreakSeconds;
        }

        if (sessionType === 'long_break') {
            return longBreakSeconds;
        }

        return focusSeconds;
    }, [focusSeconds, longBreakSeconds, sessionType, shortBreakSeconds]);

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

    const visualRemainingSeconds = useMemo(() => {
        if (!isRunning || lastTickAt === null) {
            return remainingSeconds;
        }

        const elapsedSeconds = Math.max(0, (now - lastTickAt) / 1000);

        return Math.max(0, remainingSeconds - elapsedSeconds);
    }, [isRunning, lastTickAt, now, remainingSeconds]);

    const progress = useMemo(() => {
        if (totalSeconds <= 0) {
            return 0;
        }

        return Math.min(1, Math.max(0, (totalSeconds - visualRemainingSeconds) / totalSeconds));
    }, [totalSeconds, visualRemainingSeconds]);

    if (!isRunning) {
        return null;
    }

    return (
        <div className={rootClassName} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div
                className={cx(fillClassName, getProgressBarToneClassName(sessionType))}
                style={{ width: `${progress * 100}%` }}
            />

            {hovered ? (
                <Tooltip
                    className={tooltipWrapperClassName}
                    label={`남은 시간 ${formatTimeLabel(Math.ceil(visualRemainingSeconds))}`}
                />
            ) : null}
        </div>
    );
};
