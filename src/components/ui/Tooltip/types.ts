import type { HTMLAttributes, ReactNode } from 'react';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
    date: ReactNode;
    pomodoroValue: ReactNode;
    focusTimeValue: ReactNode;
}
