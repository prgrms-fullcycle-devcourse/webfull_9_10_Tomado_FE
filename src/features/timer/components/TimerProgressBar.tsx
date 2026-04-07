import { useState } from 'react';

import { formatTimeLabel } from '@/utils/timeUtils';
import { Tooltip } from '@@/ui';
import { useTimerSessionView, type TTimerSessionType } from '@@@/timer';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const rootClassName = 'relative z-40 h-1 w-full bg-neutral-lighter';
const fillClassName = 'h-full rounded-r-full will-change-[width]';
const tooltipWrapperClassName = 'pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 shadow-shadow-1';

const getProgressBarToneClassName = (sessionType: TTimerSessionType) => {
    if (sessionType === 'short_break') return 'bg-green-300';
    if (sessionType === 'long_break') return 'bg-green-600';
    return 'bg-primary';
};

export const TimerProgressBar = () => {
    const [hovered, setHovered] = useState(false);
    const { isRunning, sessionType, visualRemainingSeconds, progress } = useTimerSessionView();

    if (!isRunning) return null;

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
