export interface formatDateOptions {
    separator: 'api' | 'display' | 'log';
}

export const DATE_FORMAT = {
    api: { separator: 'api' },
    log: { separator: 'log' },
    display: { separator: 'display' },
} as const satisfies Record<string, formatDateOptions>;

export const getTodayDate = () => {
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Seoul',
    }).format(new Date());
};

export const formatDate = (date: string | Date, options: formatDateOptions = DATE_FORMAT.api) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    let dateStr: string;
    switch (options.separator) {
        case 'display':
            dateStr = `${year}. ${month}. ${day}`;
            break;
        case 'log':
            dateStr = `${year}년 ${month}월 ${day}일`;
            break;
        case 'api':
        default:
            dateStr = `${year}-${month}-${day}`;
            break;
    }

    return dateStr;
};

export const parseDate = (value: string, options: formatDateOptions = DATE_FORMAT.api) => {
    switch (options.separator) {
        case 'log': {
            const normalizedValue = value.replace('년 ', '-').replace('월 ', '-').replace('일', '');
            const [year, month, day] = normalizedValue.split('-').map(Number);
            return new Date(year, month - 1, day);
        }
        case 'display': {
            const [year, month, day] = value.split('. ').map(Number);
            return new Date(year, month - 1, day);
        }
        case 'api':
        default:
            return new Date(`${value}T00:00:00`);
    }
};

export const isValidApiDate = (value: string | null | undefined): value is string => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const parsedDate = parseDate(value);

    return !Number.isNaN(parsedDate.getTime()) && formatDate(parsedDate, DATE_FORMAT.api) === value;
};

export const isSameDate = (a: Date | string, b: Date | string) => {
    const aDate = typeof a === 'string' ? new Date(a) : a;
    const bDate = typeof b === 'string' ? new Date(b) : b;

    return (
        aDate.getFullYear() === bDate.getFullYear() &&
        aDate.getMonth() === bDate.getMonth() &&
        aDate.getDate() === bDate.getDate()
    );
};
