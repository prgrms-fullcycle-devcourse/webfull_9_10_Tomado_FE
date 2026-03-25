import { Icon } from '@/components/ui/Icon';

import {
    dateClassName,
    getMetricValueStateClassName,
    metricLabelClassName,
    metricRowClassName,
    metricValueClassName,
    metricsClassName,
    rootClassName,
} from './styles';
import type { TooltipProps } from './types';

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const Tooltip = ({ date, pomodoroValue, focusTimeValue, className, ...props }: TooltipProps) => {
    const pomodoroEmpty = pomodoroValue === '-' || pomodoroValue == null;
    const focusTimeEmpty = focusTimeValue === '-' || focusTimeValue == null;

    return (
        <div {...props} className={cx(rootClassName, className)}>
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
    );
};
