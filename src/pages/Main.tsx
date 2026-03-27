import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { SectionHeader, DoubleColumnLayout, Container } from '@@/layout';
import { Icon, PlayerButton, Modal, Badge } from '@@/ui';
import { SessionIndicator, TomatoVisual } from '@@@/timer';
import { TodoPanel } from '@@@/todo';

const panelClassName = 'flex flex-col items-center  h-full w-full rounded-2xl bg-white px-6 py-5 shadow-shadow-1';
const panelHeadingRowClassName = 'flex items-start w-full justify-between';
const panelHeadingClassName = 'text-2xl font-bold gray-900';
const timerInitialSeconds = 1 * 60; // 세션 시간 조정

const formatTimeParts = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};

export default function Main() {
    const [remainingSeconds, setRemainingSeconds] = useState(timerInitialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
    const hasStarted = remainingSeconds !== timerInitialSeconds;

    // ============================================================= 타이머 로직
    // TODO: timer hooks 분리
    // TODO: timer component 분리 + 전역 상태 관리 적용
    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    window.clearInterval(intervalId);
                    setIsRunning(false);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isRunning]);

    const timerParts = useMemo(() => formatTimeParts(remainingSeconds), [remainingSeconds]);
    const tomatoProgress = useMemo(
        () => (timerInitialSeconds - remainingSeconds) / timerInitialSeconds,
        [remainingSeconds]
    );

    const handleToggleTimer = () => {
        if (remainingSeconds === 0) {
            setRemainingSeconds(timerInitialSeconds);
        }

        setIsRunning((prev) => !prev);
    };

    const handleConfirmStopTimer = () => {
        setIsRunning(false);
        setRemainingSeconds(timerInitialSeconds);
        setStopConfirmOpen(false);
    };

    const handleRequestStopTimer = useCallback(() => setStopConfirmOpen(true), []);
    const handleCloseStopConfirm = useCallback(() => setStopConfirmOpen(false), []);

    return (
        <main>
            <Container>
                <SectionHeader title='2026. 03. 18' />

                <DoubleColumnLayout className='flex-1'>
                    <TimerPanel
                        hasStarted={hasStarted}
                        isRunning={isRunning}
                        timerMinutes={timerParts.minutes}
                        timerSeconds={timerParts.seconds}
                        tomatoProgress={tomatoProgress}
                        onRequestStop={handleRequestStopTimer}
                        onToggleTimer={handleToggleTimer}
                    />
                    <section className={`${panelClassName} relative`}>
                        <div className={panelHeadingRowClassName}>
                            <h2 className={panelHeadingClassName}>TODO</h2>
                            <Badge label='1/3' />
                        </div>
                        <TodoPanel className='mt-5' tone='default' />
                    </section>
                </DoubleColumnLayout>

                <Modal
                    open={stopConfirmOpen}
                    tone='danger'
                    title='집중 세션 중단'
                    description={
                        <>
                            세션 중단 시 기록은 저장되지 않아요
                            <br />
                            그래도 중단 하시겠어요?
                        </>
                    }
                    onClose={handleCloseStopConfirm}
                    confirmLabel='중단하기'
                    onCancel={handleCloseStopConfirm}
                    onConfirm={handleConfirmStopTimer}
                />
            </Container>
        </main>
    );
}

interface TimerPanelProps {
    hasStarted: boolean;
    isRunning: boolean;
    timerMinutes: string;
    timerSeconds: string;
    tomatoProgress: number;
    onRequestStop: () => void;
    onToggleTimer: () => void;
}

const TimerPanel = memo(
    ({
        hasStarted,
        isRunning,
        timerMinutes,
        timerSeconds,
        tomatoProgress,
        onRequestStop,
        onToggleTimer,
    }: TimerPanelProps) => {
        return (
            <section className={panelClassName}>
                <div className={panelHeadingRowClassName}>
                    <h2 className={panelHeadingClassName}>TODAY</h2>
                    <Badge label='0set' />
                </div>

                <div className='flex flex-col gap-5 mt-18 mb-8 items-center'>
                    <SessionIndicator />
                    <div className='flex gap-5 text-xl mb-8 font-bold'>
                        <span>집중</span>
                        <span>휴식</span>
                        <span>장휴식</span>
                    </div>
                    <TomatoVisual size={200} progress={tomatoProgress} />
                </div>

                <div className='flex flex-col items-center gap-10'>
                    <div className='flex w-[170px] items-center justify-center text-5xl font-bold tabular-nums'>
                        <span className='inline-flex w-[2ch] justify-end'>{timerMinutes}</span>
                        <span className='mx-1 shrink-0'>:</span>
                        <span className='inline-flex w-[2ch] justify-start'>{timerSeconds}</span>
                    </div>
                    <div className='flex gap-5'>
                        <PlayerButton
                            size='md'
                            aria-label={isRunning ? '일시정지' : '재생'}
                            icon={<Icon name={isRunning ? 'pause' : 'play'} />}
                            onClick={onToggleTimer}
                        />
                        <PlayerButton
                            variant='outline'
                            size='md'
                            aria-label='정지'
                            icon={<Icon name='stop' />}
                            disabled={!isRunning && !hasStarted}
                            onClick={onRequestStop}
                        />
                    </div>
                </div>
            </section>
        );
    }
);
