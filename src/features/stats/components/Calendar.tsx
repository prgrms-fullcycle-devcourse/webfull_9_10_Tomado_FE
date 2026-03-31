import { useEffect, useMemo, useState } from 'react';

import { formatDate, getTodayDate, parseDate } from '@/utils';
import { Icon } from '@@/ui';

interface CalendarTileData {
    focus_date: string;
    completed_sessions?: number;
    total_focus_sec?: number;
}

interface CalendarProps {
    selectedDate?: string;
    onSelectDate?: (date: string) => void;
    tileContent?: CalendarTileData[];
}

const rootClassName = 'mt-5 flex flex-col gap-5';
const headerClassName = 'flex items-center gap-2';
const monthButtonClassName =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-neutral-darker hover:cursor-pointer';
const monthTitleClassName = 'text-2xl font-bold';
const weekdayGridClassName = 'grid grid-cols-7 gap-2';
const weekdayClassName = 'px-3 py-2 text-center text-sm font-semibold text-neutral';
const monthGridClassName = 'grid grid-cols-7 gap-2';
const dayButtonBaseClassName =
    'flex min-h-[92px] flex-col items-start rounded-xl border p-3 text-left transition-colors hover:cursor-pointer';
const dayNumberClassName = 'text-base font-semibold';
const tileMetaClassName = 'mt-auto text-xs text-neutral';

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const getGridStart = (date: Date) => {
    const monthStart = getMonthStart(date);
    return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate() - monthStart.getDay());
};

const isSameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

const getDayButtonClassName = ({
    isSelected,
    isCurrentMonth,
    isToday,
}: {
    isSelected: boolean;
    isCurrentMonth: boolean;
    isToday: boolean;
}) => {
    if (isSelected) {
        return `${dayButtonBaseClassName} border-primary bg-primary-subtle text-primary`;
    }

    if (!isCurrentMonth) {
        return `${dayButtonBaseClassName} border-transparent bg-neutral-subtle/50 text-neutral`;
    }

    if (isToday) {
        return `${dayButtonBaseClassName} border-primary-subtle bg-neutral-subtle text-neutral-darker`;
    }

    return `${dayButtonBaseClassName} border-neutral-lighter bg-white text-neutral-darker hover:border-primary-subtle hover:bg-neutral-subtle`;
};

const formatMonthTitle = (date: Date) => {
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;
};

export function Calendar({ selectedDate = getTodayDate(), onSelectDate, tileContent = [] }: CalendarProps) {
    const selected = useMemo(() => parseDate(selectedDate), [selectedDate]);
    const today = useMemo(() => parseDate(getTodayDate()), []);
    const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(selected));

    useEffect(() => {
        setVisibleMonth(getMonthStart(selected));
    }, [selected]);

    const tileContentMap = useMemo(
        () =>
            tileContent.reduce(
                (acc, item) => {
                    acc[item.focus_date] = item;
                    return acc;
                },
                {} as Record<string, CalendarTileData>
            ),
        [tileContent]
    );

    const days = useMemo(() => {
        const gridStart = getGridStart(visibleMonth);

        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(gridStart);
            date.setDate(gridStart.getDate() + index);

            const apiDate = formatDate(date);
            return {
                date,
                apiDate,
                isCurrentMonth: date.getMonth() === visibleMonth.getMonth(),
                isSelected: apiDate === selectedDate,
                isToday: isSameDay(date, today),
                summary: tileContentMap[apiDate],
            };
        });
    }, [selectedDate, tileContentMap, today, visibleMonth]);

    const handleMonthMove = (diff: number) => {
        setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + diff, 1));
    };

    return (
        <section className={rootClassName}>
            <div className={headerClassName}>
                <button
                    aria-label='이전 달'
                    className={monthButtonClassName}
                    onClick={() => handleMonthMove(-1)}
                    type='button'
                >
                    <Icon name='arrow_left' size={20} />
                </button>
                <h3 className={monthTitleClassName}>{formatMonthTitle(visibleMonth)}</h3>
                <button
                    aria-label='다음 달'
                    className={monthButtonClassName}
                    onClick={() => handleMonthMove(1)}
                    type='button'
                >
                    <Icon name='arrow_right' size={20} />
                </button>
            </div>

            <div className={weekdayGridClassName}>
                {weekdayLabels.map((label) => (
                    <span className={weekdayClassName} key={label}>
                        {label}
                    </span>
                ))}
            </div>

            <div className={monthGridClassName}>
                {days.map(({ apiDate, date, isCurrentMonth, isSelected, isToday, summary }) => (
                    <button
                        className={getDayButtonClassName({ isCurrentMonth, isSelected, isToday })}
                        key={apiDate}
                        onClick={() => onSelectDate?.(apiDate)}
                        type='button'
                    >
                        <span className={dayNumberClassName}>{date.getDate()}</span>
                        {summary?.completed_sessions ? (
                            <span className={tileMetaClassName}>{summary.completed_sessions}세션</span>
                        ) : null}
                    </button>
                ))}
            </div>
        </section>
    );
}
