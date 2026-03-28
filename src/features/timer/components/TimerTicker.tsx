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
        // INFO: requestAnimationFrame으로 더 자주 시각을 확인해 setInterval 드리프트 때문에 2초씩 건너뛰어 보이는 현상을 줄인다.
        let frameId = 0;

        const run = () => {
            tick(Date.now());
            frameId = window.requestAnimationFrame(run);
        };

        frameId = window.requestAnimationFrame(run);

        return () => window.cancelAnimationFrame(frameId);
    }, [isRunning, tick]);

    return null;
};
