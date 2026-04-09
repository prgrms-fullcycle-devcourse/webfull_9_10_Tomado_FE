import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { queryClient } from '@/api/queryClient';
import {
    getGetTodosQueryKey,
    useCreateTodo,
    useDeleteTodo,
    useGetTodos,
    useReorderTodo,
    useToggleTodoComplete,
    useUpdateTodo,
} from '@/api/generated/todos/todos';
import type { Todo as TodoDto } from '@/api/generated/model/todo';
import { useInputLimit, useToast } from '@/hooks';
import { getTodayDate } from '@/utils';

import { isTodoCompleted, mapTodoDto, type Todo } from './types';

export const TODO_MAX_CHARS = 30;
const TODO_LIMIT_TOAST_MESSAGE = '입력 가능한 글자 수를 초과하였습니다.';
const TODO_DELETE_UNDO_DURATION = 3000;

interface UseTodoListOptions {
    assignedDate?: string;
}

export const useTodoList = ({ assignedDate = getTodayDate() }: UseTodoListOptions = {}) => {
    const { showToast } = useToast();
    const todosQueryKey = getGetTodosQueryKey({ date: assignedDate });
    const { data: todoResponse = [], isLoading } = useGetTodos({ date: assignedDate });
    const { mutateAsync: createTodo } = useCreateTodo();
    const { mutateAsync: updateTodo } = useUpdateTodo();
    const { mutateAsync: toggleTodoComplete } = useToggleTodoComplete();
    const { mutateAsync: deleteTodo } = useDeleteTodo();
    const { mutateAsync: reorderTodo } = useReorderTodo();
    const {
        value: todoInputValue,
        hasError: todoInputError,
        setLimitedValue,
    } = useInputLimit({
        maxChars: TODO_MAX_CHARS,
        toastMessage: TODO_LIMIT_TOAST_MESSAGE,
    });
    const [optimisticTodos, setOptimisticTodos] = useState<Todo[]>([]);
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
    const deleteTimerMapRef = useRef<Record<string, number>>({});

    const visibleTodos = useMemo(() => {
        return [...todoResponse.map(mapTodoDto), ...optimisticTodos]
            .filter((todo) => !pendingDeleteIds.includes(todo.id))
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [optimisticTodos, pendingDeleteIds, todoResponse]);

    useEffect(() => {
        return () => {
            Object.values(deleteTimerMapRef.current).forEach((timerId) => {
                window.clearTimeout(timerId);
            });
        };
    }, []);

    const handleTodoInputChange = useCallback(
        (value: string) => {
            setLimitedValue(value);
        },
        [setLimitedValue]
    );

    const invalidateTodoQueries = useCallback(() => {
        return queryClient.invalidateQueries({ queryKey: todosQueryKey });
    }, [todosQueryKey]);

    const clearPendingDelete = useCallback((id: string) => {
        const timerId = deleteTimerMapRef.current[id];

        if (timerId) {
            window.clearTimeout(timerId);
            delete deleteTimerMapRef.current[id];
        }

        setPendingDeleteIds((prev) => prev.filter((todoId) => todoId !== id));
    }, []);

    const handleAddTodo = useCallback(async () => {
        const nextTodo = todoInputValue.trim();

        if (!nextTodo || todoInputError) {
            return;
        }

        const optimisticTodo: Todo = {
            id: `temp-${Date.now()}`,
            title: nextTodo,
            description: null,
            assignedDate,
            sortOrder: (visibleTodos.at(-1)?.sortOrder ?? 0) + 1,
            completedAt: null,
            createdAt: null,
            updatedAt: null,
        };

        setOptimisticTodos((prev) => [...prev, optimisticTodo]);
        setLimitedValue('');

        try {
            const createdTodo = await createTodo({
                data: {
                    title: nextTodo,
                    assigned_date: assignedDate,
                },
            });

            queryClient.setQueryData(todosQueryKey, (previous: typeof todoResponse = []) => {
                return [...previous, createdTodo];
            });

            setOptimisticTodos((prev) => prev.filter((todo) => todo.id !== optimisticTodo.id));
            void invalidateTodoQueries();
        } catch {
            setOptimisticTodos((prev) => prev.filter((todo) => todo.id !== optimisticTodo.id));
            setLimitedValue(nextTodo);
            showToast({
                message: '투두를 추가하지 못했어요',
                iconName: 'error',
                duration: 3000,
            });
        }
    }, [
        assignedDate,
        createTodo,
        invalidateTodoQueries,
        setLimitedValue,
        showToast,
        todoInputError,
        todoInputValue,
        todosQueryKey,
        visibleTodos,
    ]);

    const handleUpdateTodoLabel = useCallback(
        async (id: string, nextLabel: string) => {
            const trimmedLabel = nextLabel.trim();

            if (!trimmedLabel) {
                return;
            }

            try {
                await updateTodo({
                    id,
                    data: {
                        title: trimmedLabel,
                    },
                });
                await invalidateTodoQueries();
            } catch {
                showToast({
                    message: '투두 수정에 실패했어요',
                    iconName: 'error',
                    duration: 3000,
                });
            }
        },
        [invalidateTodoQueries, showToast, updateTodo]
    );

    const handleUpdateTodoChecked = useCallback(
        async (id: string, checked: boolean) => {
            const previousTodos = queryClient.getQueryData<TodoDto[]>(todosQueryKey) ?? [];

            queryClient.setQueryData<TodoDto[]>(todosQueryKey, (current = []) => {
                return current.map((todo) => {
                    if (todo.id !== id) {
                        return todo;
                    }

                    return {
                        ...todo,
                        completed_at: checked ? new Date().toISOString() : null,
                    };
                });
            });

            try {
                await toggleTodoComplete({
                    id,
                    data: {
                        completed: checked,
                    },
                });
                await invalidateTodoQueries();
            } catch {
                queryClient.setQueryData(todosQueryKey, previousTodos);
                showToast({
                    message: '투두 상태 변경에 실패했어요',
                    iconName: 'error',
                    duration: 3000,
                });
            }
        },
        [invalidateTodoQueries, showToast, todosQueryKey, toggleTodoComplete]
    );

    const removeTodo = useCallback(
        async (id: string) => {
            const targetTodo = visibleTodos.find((todo) => todo.id === id);

            if (!targetTodo) {
                return;
            }

            if (isTodoCompleted(targetTodo)) {
                showToast({
                    message: '완료된 투두는 삭제할 수 없어요',
                    iconName: 'error',
                    duration: 3000,
                });
                return;
            }

            if (deleteTimerMapRef.current[id]) {
                return;
            }

            setPendingDeleteIds((prev) => [...prev, id]);

            deleteTimerMapRef.current[id] = window.setTimeout(async () => {
                try {
                    await deleteTodo({ id });
                    await invalidateTodoQueries();
                } catch {
                    showToast({
                        message: '투두 삭제에 실패했어요',
                        iconName: 'error',
                        duration: 3000,
                    });
                } finally {
                    clearPendingDelete(id);
                }
            }, TODO_DELETE_UNDO_DURATION);

            showToast({
                message: '투두 항목을 삭제했어요',
                iconName: 'delete',
                textButton: true,
                textButtonLabel: '취소',
                onTextButtonClick: () => clearPendingDelete(id),
                duration: TODO_DELETE_UNDO_DURATION,
            });
        },
        [clearPendingDelete, deleteTodo, invalidateTodoQueries, showToast, visibleTodos]
    );

    const moveTodoDate = useCallback(
        async (id: string, nextAssignedDate: string) => {
            try {
                await updateTodo({
                    id,
                    data: {
                        assigned_date: nextAssignedDate,
                    },
                });
                await invalidateTodoQueries();
            } catch {
                showToast({
                    message: '투두 날짜 이동에 실패했어요',
                    iconName: 'error',
                    duration: 3000,
                });
            }
        },
        [invalidateTodoQueries, showToast, updateTodo]
    );

    const reorderTodos = useCallback(
        async (activeId: string, orderedIds: string[]) => {
            const reorderedTodos = orderedIds
                .map((id) => visibleTodos.find((todo) => todo.id === id))
                .filter((todo): todo is Todo => Boolean(todo));

            const movedIndex = reorderedTodos.findIndex((todo) => todo.id === activeId);

            if (movedIndex < 0) {
                return;
            }

            const movedTodo = reorderedTodos[movedIndex];
            const prevTodo = reorderedTodos[movedIndex - 1];
            const nextTodo = reorderedTodos[movedIndex + 1];
            const previousTodos = queryClient.getQueryData<TodoDto[]>(todosQueryKey) ?? [];
            const todoMap = new Map(previousTodos.map((todo) => [todo.id, todo]));

            queryClient.setQueryData<TodoDto[]>(todosQueryKey, () => {
                return orderedIds.reduce<TodoDto[]>((nextTodos, id, index) => {
                    const todo = todoMap.get(id);

                    if (!todo) {
                        return nextTodos;
                    }

                    nextTodos.push({
                        ...todo,
                        sort_order: index + 1,
                    });

                    return nextTodos;
                }, []);
            });

            try {
                await reorderTodo({
                    id: movedTodo.id,
                    data: {
                        prev_order: prevTodo?.sortOrder,
                        next_order: nextTodo?.sortOrder,
                    },
                });
                await invalidateTodoQueries();
            } catch {
                queryClient.setQueryData(todosQueryKey, previousTodos);
                showToast({
                    message: '투두 순서 변경에 실패했어요',
                    iconName: 'error',
                    duration: 3000,
                });
            }
        },
        [invalidateTodoQueries, reorderTodo, showToast, visibleTodos]
    );

    return {
        todos: visibleTodos,
        isLoading,
        todoInputValue,
        todoInputError,
        handleTodoInputChange,
        handleAddTodo,
        updateTodoLabel: handleUpdateTodoLabel,
        updateTodoChecked: handleUpdateTodoChecked,
        removeTodo,
        moveTodoDate,
        reorderTodos,
    };
};
