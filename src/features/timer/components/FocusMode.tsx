import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { useDirectionKey, useEscapeKey, useInputFocus, useToast } from '@/hooks';
import { Button, Icon, PlayerButton } from '@@/ui';
import { TODO_MAX_CHARS, TodoInput, TodoItem, useTodoList } from '@@@/todo';
import { SessionIndicator, focusModeBackgrounds, useFocusModeBackground } from '@@@/timer';

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
    className,
    children,
    ...props
}: FocusModeProps) => {
    const todoInputRef = useRef<HTMLInputElement>(null);
    const wasOpenRef = useRef(false);
    const [isTodoExpanded, setIsTodoExpanded] = useState(false);
    const { showToast } = useToast();
    const { getBackgroundSlideClassName, handleNextBackground, handlePrevBackground } = useFocusModeBackground({
        backgroundIndex,
    });
    const {
        todos,
        todoInputValue,
        todoInputError,
        handleTodoInputChange,
        handleAddTodo,
        updateTodoLabel,
        updateTodoChecked,
        removeTodo,
    } = useTodoList();

    useInputFocus(todoInputRef, ['t', 'ㅅ']);

    useEscapeKey(() => onClose?.(), { enabled: open && Boolean(onClose) });

    useDirectionKey(
        (direction) => {
            if (direction === 'left') {
                handlePrevBackground();
                return;
            }

            if (direction === 'right') {
                handleNextBackground();
                return;
            }

            if (direction === 'up') {
                setIsTodoExpanded(false);
                return;
            }

            if (direction === 'down') {
                setIsTodoExpanded(true);
                return;
            }
        },
        { enabled: open }
    );

    useEffect(() => {
        if (!open) {
            wasOpenRef.current = false;
            return;
        }

        if (!wasOpenRef.current) {
            showToast('집중모드를 종료하려면 Esc 키를 누르세요', {
                icon: true,
                textButton: false,
                durationMs: 5000,
            });
        }

        wasOpenRef.current = open;
    }, [open, showToast]);

    if (!open) {
        return null;
    }

    return (
        <div {...props} className={cx('fixed inset-0 z-50 overflow-hidden', className)}>
            <div className='absolute inset-0 z-0 overflow-hidden'>
                {focusModeBackgrounds.map((src, index) => (
                    <img
                        key={src}
                        alt=''
                        className={cx(
                            'absolute top-0 -left-px h-full w-[calc(100%+2px)] max-w-none object-cover transition-transform duration-500 ease-in-out will-change-transform',
                            getBackgroundSlideClassName(index)
                        )}
                        src={src}
                    />
                ))}
            </div>

            {/* 살짝 어둡게 하려면 투명도 조절 필요 */}
            <div className='absolute inset-0 z-10 bg-black/10' />
            <div className='min-h-screen w-full p-8'>
                <div className='relative z-20 h-[calc(100vh-4rem)] w-full'>
                    {/* Timer + Todo */}
                    <section className='absolute top-0 left-0 z-100 flex w-[360px] flex-col gap-2'>
                        <div className='glass-effect-base px-5 py-4 text-white'>
                            <div className='flex flex-col items-center gap-2.5'>
                                <SessionIndicator tone='focusmode' />
                                <div className='text-4xl font-bold tabular-nums h-15 flex items-center'>23:12</div>
                                <div className='flex items-center gap-6'>
                                    <PlayerButton
                                        aria-label='일시정지'
                                        className='!border-white !bg-transparent !text-white hover:!bg-white/10'
                                        icon={<Icon color='white' name='pause' />}
                                        size='sm'
                                        variant='outline'
                                    />
                                    <PlayerButton
                                        aria-label='정지'
                                        className='!border-transparent !bg-transparent !text-white hover:!bg-white/10'
                                        icon={<Icon color='white' name='stop' />}
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
                                    onClick={() => setIsTodoExpanded((prev) => !prev)}
                                    type='button'
                                >
                                    <Icon color='white' name={isTodoExpanded ? 'arrow_up' : 'arrow_down'} size={20} />
                                </button>
                            </div>

                            {isTodoExpanded ? (
                                <div className='mt-4 flex flex-col gap-2.5'>
                                    <TodoInput
                                        ref={todoInputRef}
                                        placeholder='할 일을 추가해보세요'
                                        state={todoInputError ? 'error' : 'default'}
                                        value={todoInputValue}
                                        onChange={(event) => handleTodoInputChange(event.target.value)}
                                        onActionClick={handleAddTodo}
                                        onKeyDown={(event) => {
                                            if (event.nativeEvent.isComposing || event.keyCode === 229) {
                                                return;
                                            }

                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleAddTodo();
                                            }
                                        }}
                                    />
                                    {todos.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            checked={todo.checked}
                                            label={todo.label}
                                            maxChars={TODO_MAX_CHARS}
                                            moreButton={false}
                                            onCheckedChange={(checked) => updateTodoChecked(todo.id, checked)}
                                            onDelete={() => removeTodo(todo.id)}
                                            onEmptyBlur={() => removeTodo(todo.id)}
                                            onLabelChange={(nextLabel) => updateTodoLabel(todo.id, nextLabel)}
                                        />
                                    ))}
                                </div>
                            ) : null}
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
                            onClick={onClose}
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
