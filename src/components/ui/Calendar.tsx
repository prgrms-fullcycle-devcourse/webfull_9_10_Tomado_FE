import ReactCalendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/shared/types.js';
import 'react-calendar/dist/Calendar.css';
import { Badge } from './Badge';
import { formatDate } from '@/utils';

type tileContentItem = {
    focus_date: string;
    total_focus_sec?: number;
    completed_sessions?: number;
};

type CalendarProps = {
    maxDate?: Date;
    tileContent?: tileContentItem[];
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
};

const formatTileContent = (data: tileContentItem) => {
    if (!data) return null;

    return <Badge label={data.completed_sessions} />;
};

export const Calendar = ({ tileContent = [], selectedDate, onSelectDate, maxDate }: CalendarProps) => {
    const mapByDate = tileContent.reduce(
        (acc, item) => {
            acc[item.focus_date] = item;
            return acc;
        },
        {} as Record<string, (typeof tileContent)[number]>
    );

    console.log(mapByDate);

    const handleChange = (nextValue: Value) => {
        const nextDate = Array.isArray(nextValue) ? nextValue[0] : nextValue;

        if (!nextDate) {
            return;
        }

        onSelectDate(nextDate);
    };

    return (
        <div className='w-full'>
            <ReactCalendar
                className='!w-full !border-0 !bg-transparent'
                calendarType='gregory'
                maxDate={maxDate}
                onChange={handleChange}
                tileClassName='flex flex-col items-center rounded-xl'
                tileContent={({ date }) => formatTileContent(mapByDate[formatDate(date)])}
                value={selectedDate}
            />
        </div>
    );
};
