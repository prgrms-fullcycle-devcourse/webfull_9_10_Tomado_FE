import { useEffect } from 'react';
import { useTimerStore } from '../useTimerStore';

export const TimerTicker = () => {
    const isRunning = useTimerStore((state) => state.isRunning);
    const tick = useTimerStore((state) => state.tick);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        // INFO: TimerTicker는 전역 타이머를 실제로 진행시키는 실행기다.
        // INFO: Main, FocusMode 등 여러 화면이 같은 세션을 봐도 ticker는 앱 전체에서 하나만 돌도록 루트에 마운트한다.
        // INFO: 백그라운드 탭에서도 멈추지 않도록 requestAnimationFrame 대신 interval로 tick을 발생시킨다.
        const intervalId = window.setInterval(() => {
            tick(Date.now());
        }, 250);

        return () => window.clearInterval(intervalId);
    }, [isRunning, tick]);

    return null;
};
