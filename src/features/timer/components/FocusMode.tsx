import { cn } from '@/utils';

import { Button, Icon, PlayerButton } from '@@/ui';

import { TodoPanel } from '@@@/todo';
import { FocusModeBackgroundLayer, SessionIndicator, useFocusModeController } from '@@@/timer';
import type { IFocusModeProps } from '@@@/timer';

const backgroundNavButtonWrapperClassName = 'bottom-0 group absolute inset-y-40 z-30 w-28 hover:cursor-pointer';
const backgroundNavButtonClassName =
    'pointer-events-none absolute top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-white/90 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100';
const mainButtonClassName =
    'glass-effect-base !border-white !bg-transparent !text-white hover:!bg-white/10 hover:!text-white';

export const FocusMode = ({
    open = true,
    backgroundIndex,
    onClose,
    onMusicClick,
    timerSession,
    handleToggleTimer,
    handleRequestStopTimer,
    handleSkipBreak,
    className,
    children,
    ...props
}: IFocusModeProps) => {
    const controller = useFocusModeController({ open, backgroundIndex, onClose });

    if (!open) return null;

    return (
        <div {...props} className={cn('fixed inset-0 z-50 overflow-hidden', className)}>
            <FocusModeBackgroundLayer
                backgroundSlideClassNames={controller.backgroundSlideClassNames}
                backgroundSources={controller.focusModeBackgrounds}
            />
            <div className='min-h-screen w-full p-8'>
                <div className='relative z-20 h-[calc(100vh-4rem)] w-full'>
                    <section className='absolute top-0 left-0 z-100 flex w-[360px] flex-col gap-2'>
                        <div className='glass-effect-base px-5 py-4 text-white'>
                            <div className='flex flex-col items-center gap-2.5'>
                                <SessionIndicator filledCount={timerSession.focusSessionInSet} tone='focusmode' />
                                <div className='text-4xl font-bold tabular-nums h-15 flex items-center'>
                                    {timerSession.timerParts.minutes}:{timerSession.timerParts.seconds}
                                </div>
                                <div className='flex items-center gap-6'>
                                    <PlayerButton
                                        aria-label={timerSession.isRunning ? '일시정지' : '재생'}
                                        className='!border-white !bg-transparent !text-white hover:!bg-white/10'
                                        icon={<Icon color='white' name={timerSession.isRunning ? 'pause' : 'play'} />}
                                        onClick={handleToggleTimer}
                                        size='sm'
                                        variant='outline'
                                    />
                                    <PlayerButton
                                        aria-label='정지'
                                        className='!border-transparent !bg-transparent !text-white hover:!bg-white/10'
                                        icon={<Icon color='white' name='stop' />}
                                        disabled={!timerSession.isRunning && !timerSession.hasStarted}
                                        onClick={handleRequestStopTimer}
                                        size='sm'
                                        variant='ghost'
                                    />
                                </div>
                                {timerSession.sessionType !== 'focus' ? (
                                    <Button
                                        className='!border-white !bg-transparent !text-white hover:!bg-white/10 hover:!text-white'
                                        icon={<Icon color='white' name='next' />}
                                        onClick={handleSkipBreak}
                                        size='md'
                                        variant='outline'
                                    >
                                        휴식 건너뛰기
                                    </Button>
                                ) : null}
                            </div>
                        </div>

                        <div className='glass-effect-base overflow-hidden p-5 text-white'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl font-bold'>TODO</h2>
                                <button
                                    aria-label={controller.isTodoExpanded ? '투두 접기' : '투두 펼치기'}
                                    className='inline-flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10 hover:cursor-pointer'
                                    onClick={controller.handleToggleTodo}
                                    type='button'
                                >
                                    <Icon
                                        color='white'
                                        name={controller.isTodoExpanded ? 'arrow_up' : 'arrow_down'}
                                        size={20}
                                    />
                                </button>
                            </div>

                            {controller.isTodoExpanded && <TodoPanel className='mt-4' tone='focus' />}
                        </div>
                    </section>

                    <div className='absolute top-0 right-0 flex items-center gap-2.5'>
                        <Button
                            className={mainButtonClassName}
                            icon={<Icon color='white' name='music_on' />}
                            onClick={onMusicClick}
                            size='md'
                            variant='outline'
                        >
                            배경음악
                        </Button>
                        <Button
                            className={mainButtonClassName}
                            icon={<Icon color='white' name='fullscreen_close' />}
                            onClick={onClose}
                            size='md'
                            variant='outline'
                        >
                            집중모드
                        </Button>
                    </div>

                    <button
                        aria-label='이전 배경'
                        className={cn(backgroundNavButtonWrapperClassName, 'left-0')}
                        onClick={controller.handlePrevBackground}
                        type='button'
                    >
                        <span className={cn(backgroundNavButtonClassName, 'left-6')}>
                            <Icon color='white' name='arrow_left' size={56} />
                        </span>
                    </button>
                    <button
                        aria-label='다음 배경'
                        className={cn(backgroundNavButtonWrapperClassName, 'right-0')}
                        onClick={controller.handleNextBackground}
                        type='button'
                    >
                        <span className={cn(backgroundNavButtonClassName, 'right-6')}>
                            <Icon color='white' name='arrow_right' size={56} />
                        </span>
                    </button>

                    {children}
                </div>
            </div>
        </div>
    );
};
