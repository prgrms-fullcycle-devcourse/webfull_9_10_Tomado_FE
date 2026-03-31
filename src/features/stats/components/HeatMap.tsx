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

export interface HeatMapProps {
    selectedDate?: string;
    onSelectDate?: (date: string) => void;
}

const wrapperClassName = 'relative w-full border border-neutral-lighter rounded-2xl p-5';
const scrollAreaClassName = 'w-full overflow-x-auto';
const contentClassName = 'min-w-[860px]';
const tooltipClassName = 'pointer-events-none absolute z-20';
const legendWrapperClassName = 'flex w-full justify-end';
const legendClassName = 'flex items-center gap-2 text-sm text-neutral-darker';
const legendScaleClassName = 'flex items-center gap-1';
const legendCellBaseClassName = 'h-[10px] w-[10px] rounded-[2px]';

// TODO: Replace with actual data from API
const heatMapData: HeatMapValue[] = [
    { date: '2025-03-31', count: 5, focusTime: '10시간 20분' },
    { date: '2025-04-15', count: 8, focusTime: '16시간 40분' },
    { date: '2025-05-06', count: 2, focusTime: '4시간 15분' },
    { date: '2025-08-14', count: 6, focusTime: '12시간 30분' },
    { date: '2025-10-03', count: 8, focusTime: '10시간 20분' },
    { date: '2025-12-22', count: 4, focusTime: '7시간 45분' },
    { date: '2026-01-11', count: 3, focusTime: '5시간 10분' },
    { date: '2026-03-31', count: 7, focusTime: '14시간 00분' },
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

export function HeatMap({ selectedDate, onSelectDate }: HeatMapProps) {
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
            left: targetRect.left - wrapperRect.left + targetRect.width + 4,
            top: targetRect.top - wrapperRect.top + targetRect.height + 4,
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
                        classForValue={(value) => {
                            const baseClassName = getCellClassName(value as HeatMapValue | undefined);
                            const isSelected = value?.date === selectedDate;

                            return isSelected ? `${baseClassName} selected-cell` : baseClassName;
                        }}
                        endDate={endDate}
                        gutterSize={1}
                        onClick={(value) => {
                            if (typeof value?.date === 'string') {
                                onSelectDate?.(value.date);
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                        onMouseOver={(event, value) => {
                            handleMouseOver(value as HeatMapValue | undefined)(event);
                        }}
                        showWeekdayLabels={true}
                        startDate={startDate}
                        values={heatMapData}
                    />
                </div>
            </div>

            <div className={legendWrapperClassName}>
                <div className={legendClassName}>
                    <span>적음</span>
                    <div className={legendScaleClassName}>
                        <span className={`${legendCellBaseClassName} bg-[var(--color-heatmap-1)]`} />
                        <span className={`${legendCellBaseClassName} bg-[var(--color-heatmap-2)]`} />
                        <span className={`${legendCellBaseClassName} bg-[var(--color-heatmap-3)]`} />
                        <span className={`${legendCellBaseClassName} bg-[var(--color-heatmap-4)]`} />
                        <span className={`${legendCellBaseClassName} bg-[var(--color-heatmap-5)]`} />
                    </div>
                    <span>많음</span>
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
