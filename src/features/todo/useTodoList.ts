import { useCallback, useMemo } from 'react';

import { useInputLimit, useToast } from '@/hooks';
import { getTodayDate } from '../../utils/dateUtils';
import { useTodoStore } from './useTodoStore';

export const TODO_MAX_CHARS = 30;
const TODO_LIMIT_TOAST_MESSAGE = '입력 가능한 글자 수를 초과하였습니다.';

export const useTodoList = () => {
    const { showToast } = useToast();
    const todos = useTodoStore((state) => state.todos);
    const addTodo = useTodoStore((state) => state.addTodo);
    const updateTodoLabel = useTodoStore((state) => state.updateTodoLabel);
    const updateTodoChecked = useTodoStore((state) => state.updateTodoChecked);
    const removeTodoFromStore = useTodoStore((state) => state.removeTodo);
    const restoreTodo = useTodoStore((state) => state.restoreTodo);
    const {
        value: todoInputValue,
        hasError: todoInputError,
        setLimitedValue,
    } = useInputLimit({
        maxChars: TODO_MAX_CHARS,
        toastMessage: TODO_LIMIT_TOAST_MESSAGE,
    });
    const todayTodoDate = getTodayDate();
    const visibleTodos = useMemo(
        () => todos.filter((todo) => todo.assignedDate === todayTodoDate).sort((a, b) => a.order - b.order),
        [todayTodoDate, todos]
    );

    const handleTodoInputChange = useCallback(
        (value: string) => {
            setLimitedValue(value);
        },
        [setLimitedValue]
    );

    const handleAddTodo = useCallback(() => {
        const nextTodo = todoInputValue.trim();

        if (!nextTodo || todoInputError) {
            return;
        }

        addTodo(nextTodo, todayTodoDate);
        setLimitedValue('');
    }, [addTodo, todoInputError, todoInputValue, setLimitedValue, todayTodoDate]);

    const removeTodo = useCallback(
        (id: number) => {
            const deletedIndex = visibleTodos.findIndex((todo) => todo.id === id);

            if (deletedIndex < 0) {
                return;
            }

            const deletedTodo = removeTodoFromStore(id);

            if (!deletedTodo) {
                return;
            }

            showToast(`투두 항목을 삭제했어요`, {
                icon: true,
                textButton: true,
                textButtonLabel: '취소',
                durationMs: 5000,
                onTextButtonClick: () => {
                    restoreTodo(deletedTodo, deletedIndex);
                },
            });
        },
        [removeTodoFromStore, restoreTodo, showToast, visibleTodos]
    );

    return {
        todos: visibleTodos,
        todoInputValue,
        todoInputError,
        handleTodoInputChange,
        handleAddTodo,
        updateTodoLabel,
        updateTodoChecked,
        removeTodo,
    };
};
