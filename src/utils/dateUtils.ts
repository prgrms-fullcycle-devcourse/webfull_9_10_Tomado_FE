// INFO: 투두 도메인은 날짜별 조회/이동이 예정되어 있어, 오늘 날짜 포맷을 한 곳에서 계산합니다.
export const getTodayDate = () => {
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Seoul',
    }).format(new Date());
};

export const formatTodayDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const parseTodayDate = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
};
