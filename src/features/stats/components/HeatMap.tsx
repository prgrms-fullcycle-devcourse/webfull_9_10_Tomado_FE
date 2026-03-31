import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRef, useState } from 'react';

import HeatMapComponent from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { StatsTooltip } from '@/components/ui/Tooltip';
import { DATE_FORMAT, formatDate } from '@/utils';
import '@/styles/heatmap.css';

interface HeatMapValue {
    date: string;
    count: number;
    focusTime: string;
}

interface TooltipPosition {
    left: number;
    top: number;
}

const wrapperClassName = 'relative w-full pb-[116px]';
const scrollAreaClassName = 'w-full overflow-x-auto';
const contentClassName = 'min-w-[860px]';
const tooltipClassName = 'pointer-events-none absolute z-20';

// TODO: Replace with actual data from API
const heatMapData: HeatMapValue[] = [
    { date: '2025-03-31', count: 5, focusTime: '10시간 20분' },
    { date: '2025-04-15', count: 8, focusTime: '16시간 40분' },
    { date: '2025-05-06', count: 2, focusTime: '4시간 15분' },
    { date: '2025-08-14', count: 6, focusTime: '12시간 30분' },
    { date: '2025-10-03', count: 8, focusTime: '10시간 20분' },
    { date: '2025-12-22', count: 4, focusTime: '7시간 45분' },
    { date: '2026-01-11', count: 3, focusTime: '5시간 10분' },
    { date: '2026-03-28', count: 7, focusTime: '14시간 00분' },
];

const getCellClassName = (value?: HeatMapValue) => {
    if (!value || !value.count) return 'color-empty';
    if (value.count < 3) return 'color-scale-1';
    if (value.count < 5) return 'color-scale-2';
    if (value.count < 8) return 'color-scale-3';
    return 'color-scale-4';
};

const getTooltipDate = (date: string) => {
    return formatDate(date, DATE_FORMAT.log);
};

export function HeatMap() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [hoveredValue, setHoveredValue] = useState<HeatMapValue | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ left: 0, top: 0 });

    const handleMouseOver = (value?: HeatMapValue) => (event: ReactMouseEvent<SVGRectElement>) => {
        if (!value?.count) {
            setHoveredValue(null);
            return;
        }

        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        const targetRect = event.currentTarget.getBoundingClientRect();

        if (!wrapperRect) {
            return;
        }

        setHoveredValue(value);
        setTooltipPosition({
            left: targetRect.left - wrapperRect.left + targetRect.width + 12,
            top: targetRect.top - wrapperRect.top + targetRect.height + 12,
        });
    };

    const handleMouseLeave = () => {
        setHoveredValue(null);
    };

    return (
        <div className={wrapperClassName} onMouseLeave={handleMouseLeave} ref={wrapperRef}>
            <div className={scrollAreaClassName}>
                <div className={contentClassName}>
                    <HeatMapComponent
                        endDate={endDate}
                        gutterSize={1}
                        onMouseLeave={handleMouseLeave}
                        onMouseOver={(event, value) => {
                            handleMouseOver(value as HeatMapValue | undefined)(event);
                        }}
                        showWeekdayLabels={true}
                        startDate={startDate}
                        values={heatMapData}
                        classForValue={(value) => getCellClassName(value as HeatMapValue | undefined)}
                    />
                </div>
            </div>

            {hoveredValue ? (
                <StatsTooltip
                    className={tooltipClassName}
                    date={getTooltipDate(hoveredValue.date)}
                    focusTimeValue={hoveredValue.focusTime}
                    pomodoroValue={`${hoveredValue.count}세션`}
                    style={{
                        left: tooltipPosition.left,
                        top: tooltipPosition.top,
                    }}
                />
            ) : null}
        </div>
    );
}
