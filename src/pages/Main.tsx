import { useEffect, useMemo, useRef, useState } from 'react';

import { SectionHeader, DoubleColumnLayout, Container } from '@@/layout';
import { Icon, PlayerButton, Modal, Badge } from '@@/ui';
import { SessionIndicator, TomatoVisual } from '@@@/timer';
import { TodoInput, TodoItem } from '@@@/todo';
import { useInputLimit, useInputFocus, useToast } from '@/hooks';

const panelClassName = 'flex flex-col items-center  h-full w-full rounded-2xl bg-white px-6 py-5 shadow-shadow-1';
const panelHeadingRowClassName = 'flex items-start w-full justify-between';
const panelHeadingClassName = 'text-2xl font-bold gray-900';
const timerInitialSeconds = 1 * 60; // 세션 시간 조정
const TODO_MAX_CHARS = 30;
const TODO_LIMIT_TOAST_MESSAGE = '입력 가능한 글자 수를 초과하였습니다.';

interface Todo {
    id: number;
    label: string;
    checked: boolean;
}

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
    const [todos, setTodos] = useState<Todo[]>([]);
    const { showToast } = useToast();

    const todoInputRef = useRef<HTMLInputElement>(null);
    const hasStarted = remainingSeconds !== timerInitialSeconds;

    // ============================================================= 타이머 로직
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

    // ============================================================= 투두 리스트 로직
    // TODO: modularize ==> features/todo/components/TodoList.tsx (variant: 'default' | 'focus')
    // TODO: in focus mode, more button should be hidden
    useInputFocus(todoInputRef, ['t', 'ㅅ']);

    const {
        value: todoInputValue,
        hasError: todoInputError,
        setLimitedValue,
    } = useInputLimit({
        maxChars: TODO_MAX_CHARS,
        toastMessage: TODO_LIMIT_TOAST_MESSAGE,
    });

    const handleTodoInputChange = (value: string) => {
        setLimitedValue(value);
    };

    const handleAddTodo = () => {
        const nextTodo = todoInputValue.trim();

        if (!nextTodo || todoInputError) {
            return;
        }

        setTodos((prev) => [{ id: Date.now(), label: nextTodo, checked: false }, ...prev]);
        setLimitedValue('');
    };

    const updateTodoLabel = (id: number, nextLabel: string) => {
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, label: nextLabel } : todo)));
    };

    const updateTodoChecked = (id: number, checked: boolean) => {
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, checked } : todo)));
    };

    const removeTodo = (id: number) => {
        const deletedIndex = todos.findIndex((todo) => todo.id === id);

        if (deletedIndex < 0) {
            return;
        }

        const deletedTodo = todos[deletedIndex];

        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        showToast(`투두 항목을 삭제했어요`, {
            icon: <Icon name='delete' size={16} />,
            textButton: true,
            textButtonLabel: '취소',
            durationMs: 5000,
            onTextButtonClick: () => {
                setTodos((prev) => {
                    if (prev.some((todo) => todo.id === deletedTodo.id)) {
                        return prev;
                    }

                    const nextTodos = [...prev];
                    const restoredIndex = Math.min(deletedIndex, nextTodos.length);
                    nextTodos.splice(restoredIndex, 0, deletedTodo);
                    return nextTodos;
                });
            },
        });
    };

    return (
        <main>
            <Container>
                <SectionHeader title='2026. 03. 18' />

                <DoubleColumnLayout className='flex-1'>
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
                                <span className='inline-flex w-[2ch] justify-end'>{timerParts.minutes}</span>
                                <span className='mx-1 shrink-0'>:</span>
                                <span className='inline-flex w-[2ch] justify-start'>{timerParts.seconds}</span>
                            </div>
                            <div className='flex gap-5'>
                                <PlayerButton
                                    size='md'
                                    aria-label={isRunning ? '일시정지' : '재생'}
                                    icon={<Icon name={isRunning ? 'pause' : 'play'} />}
                                    onClick={handleToggleTimer}
                                />
                                <PlayerButton
                                    variant='outline'
                                    size='md'
                                    aria-label='정지'
                                    icon={<Icon name='stop' />}
                                    disabled={!isRunning && !hasStarted}
                                    onClick={() => setStopConfirmOpen(true)}
                                />
                            </div>
                        </div>
                    </section>

                    <section className={`${panelClassName} relative`}>
                        <div className={panelHeadingRowClassName}>
                            <h2 className={panelHeadingClassName}>TODO</h2>
                            <Badge label='1/3' />
                        </div>

                        <div className='flex flex-col mt-5 gap-2.5 w-full'>
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
                                    moreButton
                                    onCheckedChange={(checked) => updateTodoChecked(todo.id, checked)}
                                    onDelete={() => removeTodo(todo.id)}
                                    onEmptyBlur={() => removeTodo(todo.id)}
                                    onLabelChange={(nextLabel) => updateTodoLabel(todo.id, nextLabel)}
                                />
                            ))}
                        </div>
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
                    onClose={() => setStopConfirmOpen(false)}
                    confirmLabel='중단하기'
                    onCancel={() => setStopConfirmOpen(false)}
                    onConfirm={handleConfirmStopTimer}
                />
            </Container>
        </main>
    );
}
