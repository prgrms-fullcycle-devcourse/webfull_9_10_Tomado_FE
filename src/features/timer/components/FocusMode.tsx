import { useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { useDirectionKey, useGlobalKeyboardShortcuts, useToast } from '@/hooks';
import { useTimerStore, getInitialSeconds } from '@/features/timer';
import { formatTimeParts } from '@/utils/timeUtils';

import { Button } from '@@/ui/Button';
import { Icon } from '@@/ui/Icon/Icon';
import { PlayerButton } from '@@/ui/PlayerButton';
import { TodoPanel } from '@@@/todo';
import { useFocusModeBackground, FocusModeBackgroundLayer, SessionIndicator } from '@@@/timer';

const backgroundNavButtonWrapperClassName = 'bottom-0 group absolute inset-y-40 z-30 w-28 hover:cursor-pointer';

const backgroundNavButtonClassName =
    'pointer-events-none absolute top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-white/90 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100';

const mainButtonClassName =
    'glass-effect-base !border-white !bg-transparent !text-white hover:!bg-white/10 hover:!text-white';

export interface FocusModeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    open?: boolean;
    backgroundIndex?: number;
    onClose?: () => void;
    onMusicClick?: () => void;
    handleToggleTimer: () => void;
    handleRequestStopTimer: () => void;
    children?: ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const FocusMode = ({
    open = true,
    backgroundIndex,
    onClose,
    onMusicClick,
    handleToggleTimer,
    handleRequestStopTimer,
    className,
    children,
    ...props
}: FocusModeProps) => {
    const wasOpenRef = useRef(false);
    const [isTodoExpanded, setIsTodoExpanded] = useState(false);
    const { showToast } = useToast();
    const { focusModeBackgrounds, backgroundSlideClassNames, handleNextBackground, handlePrevBackground } =
        useFocusModeBackground({
            backgroundIndex,
        });

    const isRunning = useTimerStore((state) => state.isRunning);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const sessionType = useTimerStore((state) => state.sessionType);
    const focusSessionInSet = useTimerStore((state) => state.focusSessionInSet);
    const focusSeconds = useTimerStore((state) => state.focusSeconds);
    const shortBreakSeconds = useTimerStore((state) => state.shortBreakSeconds);
    const longBreakSeconds = useTimerStore((state) => state.longBreakSeconds);

    const initialSeconds = getInitialSeconds({
        sessionType,
        focusSeconds,
        shortBreakSeconds,
        longBreakSeconds,
    });

    const hasStarted = remainingSeconds !== initialSeconds;
    const sessionIndicatorFilledCount = focusSessionInSet;
    const timerParts = formatTimeParts(remainingSeconds);

    const handleClose = useCallback(() => onClose?.(), [onClose]);
    const handleToggleTodoExpanded = useCallback(() => setIsTodoExpanded((prev) => !prev), []);
    const handleTodoExpand = useCallback(() => setIsTodoExpanded(true), []);
    const handleTodoCollapse = useCallback(() => setIsTodoExpanded(false), []);

    const handleDirection = useCallback(
        (direction: 'left' | 'right' | 'up' | 'down') => {
            if (direction === 'left') {
                handlePrevBackground();
                return;
            }

            if (direction === 'right') {
                handleNextBackground();
                return;
            }

            if (direction === 'up') {
                handleTodoCollapse();
                return;
            }

            if (direction === 'down') {
                handleTodoExpand();
            }
        },
        [handleNextBackground, handlePrevBackground, handleTodoCollapse, handleTodoExpand]
    );

    useGlobalKeyboardShortcuts({
        enabled: open,
        onEscape: onClose,
    });

    useDirectionKey(handleDirection, { enabled: open });

    useEffect(() => {
        if (!open) {
            wasOpenRef.current = false;
            return;
        }

        if (!wasOpenRef.current) {
            showToast({
                message: '집중모드를 종료하려면 Esc 키를 누르세요',
                iconName: 'noti_focus',
                duration: 5000,
            });
        }

        wasOpenRef.current = open;
    }, [open, showToast]);

    if (!open) {
        return null;
    }

    return (
        <div {...props} className={cx('fixed inset-0 z-50 overflow-hidden', className)}>
            <FocusModeBackgroundLayer
                backgroundSlideClassNames={backgroundSlideClassNames}
                backgroundSources={focusModeBackgrounds}
            />
            <div className='min-h-screen w-full p-8'>
                <div className='relative z-20 h-[calc(100vh-4rem)] w-full'>
                    {/* Timer + Todo */}
                    <section className='absolute top-0 left-0 z-100 flex w-[360px] flex-col gap-2'>
                        <div className='glass-effect-base px-5 py-4 text-white'>
                            <div className='flex flex-col items-center gap-2.5'>
                                <SessionIndicator filledCount={sessionIndicatorFilledCount} tone='focusmode' />
                                <div className='text-4xl font-bold tabular-nums h-15 flex items-center'>
                                    {timerParts.minutes}:{timerParts.seconds}
                                </div>
                                <div className='flex items-center gap-6'>
                                    <PlayerButton
                                        aria-label={isRunning ? '일시정지' : '재생'}
                                        className='!border-white !bg-transparent !text-white hover:!bg-white/10'
                                        icon={<Icon color='white' name={isRunning ? 'pause' : 'play'} />}
                                        onClick={handleToggleTimer}
                                        size='sm'
                                        variant='outline'
                                    />
                                    <PlayerButton
                                        aria-label='정지'
                                        className='!border-transparent !bg-transparent !text-white hover:!bg-white/10'
                                        icon={<Icon color='white' name='stop' />}
                                        disabled={!isRunning && !hasStarted}
                                        onClick={handleRequestStopTimer}
                                        size='sm'
                                        variant='ghost'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='glass-effect-base overflow-hidden p-5 text-white'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl font-bold'>TODO</h2>
                                <button
                                    aria-label={isTodoExpanded ? '투두 접기' : '투두 펼치기'}
                                    className='inline-flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10 hover:cursor-pointer'
                                    onClick={handleToggleTodoExpanded}
                                    type='button'
                                >
                                    <Icon color='white' name={isTodoExpanded ? 'arrow_up' : 'arrow_down'} size={20} />
                                </button>
                            </div>

                            {isTodoExpanded ? <TodoPanel className='mt-4' tone='focus' /> : null}
                        </div>
                    </section>

                    {/* Main button group */}
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
                            onClick={handleClose}
                            size='md'
                            variant='outline'
                        >
                            집중모드
                        </Button>
                    </div>

                    {/* Background navigation */}
                    <button
                        aria-label='이전 배경'
                        className={cx(backgroundNavButtonWrapperClassName, 'left-0')}
                        onClick={handlePrevBackground}
                        type='button'
                    >
                        <span className={cx(backgroundNavButtonClassName, 'left-6')}>
                            <Icon color='white' name='arrow_left' size={56} />
                        </span>
                    </button>
                    <button
                        aria-label='다음 배경'
                        className={cx(backgroundNavButtonWrapperClassName, 'right-0')}
                        onClick={handleNextBackground}
                        type='button'
                    >
                        <span className={cx(backgroundNavButtonClassName, 'right-6')}>
                            <Icon color='white' name='arrow_right' size={56} />
                        </span>
                    </button>

                    {children}
                </div>
            </div>
        </div>
    );
};
