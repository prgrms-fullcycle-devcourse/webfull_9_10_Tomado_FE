import { useState } from 'react';

import { useInputLimit, useToast } from '@/hooks';

export const TODO_MAX_CHARS = 30;
const TODO_LIMIT_TOAST_MESSAGE = '입력 가능한 글자 수를 초과하였습니다.';

export interface Todo {
    id: number;
    label: string;
    checked: boolean;
}

export const useTodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const { showToast } = useToast();
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
            icon: true,
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

    return {
        todos,
        todoInputValue,
        todoInputError,
        handleTodoInputChange,
        handleAddTodo,
        updateTodoLabel,
        updateTodoChecked,
        removeTodo,
    };
};
