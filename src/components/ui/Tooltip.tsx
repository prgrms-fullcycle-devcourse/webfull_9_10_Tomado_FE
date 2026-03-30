import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '.';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
    label: ReactNode;
}

export interface StatsTooltipProps extends HTMLAttributes<HTMLDivElement> {
    date: ReactNode;
    pomodoroValue: ReactNode;
    focusTimeValue: ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const rootClassName = 'w-fit rounded-xl bg-gray-900 px-4 py-2';
const StatsTooltipClassName = 'flex h-[100px] flex-col justify-center gap-2';
const dateClassName = 'text-base text-white';
const metricsClassName = 'flex flex-col gap-1';
const metricRowClassName = 'flex items-center gap-2 text-sm text-white';
const metricLabelClassName = 'text-sm text-white';
const metricValueClassName = 'text-sm text-white';

const getMetricValueStateClassName = (empty = false) => {
    return cx(empty && 'text-white/70');
};

export const Tooltip = ({ label, className, ...props }: TooltipProps) => {
    return (
        <div {...props} className={cx(rootClassName, className)}>
            <p className={dateClassName}>{label}</p>
        </div>
    );
};

export const StatsTooltip = ({ date, pomodoroValue, focusTimeValue, className, ...props }: StatsTooltipProps) => {
    const pomodoroEmpty = pomodoroValue === '-' || pomodoroValue == null;
    const focusTimeEmpty = focusTimeValue === '-' || focusTimeValue == null;

    return (
        <div {...props} className={cx(rootClassName, className)}>
            <div className={StatsTooltipClassName}>
                <p className={dateClassName}>{date}</p>

                <div className={metricsClassName}>
                    <div className={metricRowClassName}>
                        <Icon name='pomodoro' size={16} />
                        <span className={metricLabelClassName}>포모도로</span>
                        <span className={cx(metricValueClassName, getMetricValueStateClassName(pomodoroEmpty))}>
                            {pomodoroValue}
                        </span>
                    </div>

                    <div className={metricRowClassName}>
                        <Icon name='fire' size={16} />
                        <span className={metricLabelClassName}>집중시간</span>
                        <span className={cx(metricValueClassName, getMetricValueStateClassName(focusTimeEmpty))}>
                            {focusTimeValue}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
