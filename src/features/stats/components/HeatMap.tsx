import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRef, useState } from 'react';

import HeatMapComponent from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import type { DailyFocusStat } from '@/api/generated/model/dailyFocusStat';
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
    values?: DailyFocusStat[];
    isLoading?: boolean;
}

const wrapperClassName = 'relative w-full border border-neutral-lighter rounded-2xl p-5';
const scrollAreaClassName = 'w-full overflow-x-auto';
const contentClassName = 'min-w-[860px]';
const tooltipClassName = 'pointer-events-none absolute z-20';
const legendWrapperClassName = 'flex w-full justify-end';
const legendClassName = 'flex items-center gap-2 text-sm text-neutral-darker';
const legendScaleClassName = 'flex items-center gap-1';
const legendCellBaseClassName = 'h-[10px] w-[10px] rounded-[2px]';

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

const formatFocusTime = (focusSeconds = 0) => {
    const hours = Math.floor(focusSeconds / 3600);
    const minutes = Math.floor((focusSeconds % 3600) / 60);

    return `${hours}시간 ${String(minutes).padStart(2, '0')}분`;
};

export function HeatMap({ selectedDate, onSelectDate, values = [], isLoading = false }: HeatMapProps) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [hoveredValue, setHoveredValue] = useState<HeatMapValue | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ left: 0, top: 0 });
    const heatMapData: HeatMapValue[] = values.map((value) => ({
        date: value.focus_date ?? '',
        count: value.completed_sessions ?? 0,
        focusTime: formatFocusTime(value.total_focus_sec ?? 0),
    }));

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
            {isLoading ? (
                <div className='flex flex-col gap-4 animate-pulse'>
                    <div className='grid grid-cols-12 gap-1'>
                        {Array.from({ length: 84 }, (_, index) => (
                            <div
                                className='h-[12px] rounded-[2px] bg-neutral-subtle'
                                key={`heatmap-skeleton-${index}`}
                            />
                        ))}
                    </div>
                    <div className='flex justify-end gap-2 items-center'>
                        <div className='h-3 w-6 rounded-full bg-neutral-subtle' />
                        <div className='flex gap-1'>
                            {Array.from({ length: 5 }, (_, index) => (
                                <div
                                    className='h-[10px] w-[10px] rounded-[2px] bg-neutral-subtle'
                                    key={`heatmap-legend-skeleton-${index}`}
                                />
                            ))}
                        </div>
                        <div className='h-3 w-6 rounded-full bg-neutral-subtle' />
                    </div>
                </div>
            ) : (
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
            )}

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
