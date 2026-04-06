export const formatTimeParts = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};

export const formatTimeLabel = (totalSeconds: number) => {
    const { minutes, seconds } = formatTimeParts(totalSeconds);
    return `${minutes}:${seconds}`;
};
