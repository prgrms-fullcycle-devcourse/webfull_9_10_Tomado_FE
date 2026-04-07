import { useState } from 'react';

import { cn } from '@/utils';
import { Tooltip } from '@@/ui';
import { useTimerSessionView, type TTimerSessionType } from '@@@/timer';

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
    const timerSession = useTimerSessionView();

    if (!timerSession.isRunning) return null;

    return (
        <div className={rootClassName} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div
                className={cn(fillClassName, getProgressBarToneClassName(timerSession.sessionType))}
                style={{ width: `${timerSession.progress * 100}%` }}
            />

            {hovered ? (
                <Tooltip className={tooltipWrapperClassName} label={`남은 시간 ${timerSession.timeLabel}`} />
            ) : null}
        </div>
    );
};
