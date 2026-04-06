import { memo } from 'react';

import { Icon, PlayerButton } from '@@/ui';
import { SessionIndicator, TomatoVisual, type ITimerPanelProps } from '@@@/timer';

export const TimerPanel = memo(
    ({
        hasStarted,
        isRunning,
        sessionType = 'focus',
        sessionIndicatorFilledCount = 1,
        timerMinutes,
        timerSeconds,
        tomatoProgress,
        onRequestStop,
        onToggleTimer,
    }: ITimerPanelProps) => {
        return (
            <div>
                <div className='flex flex-col gap-5 mt-18 mb-8 items-center'>
                    <SessionIndicator filledCount={sessionIndicatorFilledCount} />
                    <div className='flex gap-5 text-xl mb-8 font-bold'>
                        <span className={sessionType === 'focus' ? 'text-neutral-darker' : 'text-neutral-lighter'}>
                            집중
                        </span>
                        <span
                            className={sessionType === 'short_break' ? 'text-neutral-darker' : 'text-neutral-lighter'}
                        >
                            휴식
                        </span>
                        <span className={sessionType === 'long_break' ? 'text-neutral-darker' : 'text-neutral-lighter'}>
                            장휴식
                        </span>
                    </div>
                    <TomatoVisual size={200} progress={tomatoProgress} sessionType={sessionType} />
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
            </div>
        );
    }
);
