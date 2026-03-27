import { memo, useCallback, useRef } from 'react';

import { useTodoList, type Todo, TODO_MAX_CHARS } from '../useTodoList';
import { TodoInput } from './TodoInput';
import { TodoItem } from './TodoItem';
import { useInputFocus, useSubmitOnEnter } from '@/hooks';

type TodoPanelTone = 'default' | 'focus';

export interface TodoPanelProps {
    className?: string;
    tone?: TodoPanelTone;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const TodoPanel = memo(({ className, tone = 'default' }: TodoPanelProps) => {
    const todoInputRef = useRef<HTMLInputElement>(null);
    const showMoreButton = tone === 'default';

    useInputFocus(todoInputRef, ['t', 'ㅅ']);

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

    const handleTodoInputKeyDown = useSubmitOnEnter<HTMLInputElement>({ onSubmit: handleAddTodo });

    return (
        <div className={cx('flex w-full flex-col gap-2.5', className)}>
            <TodoInput
                ref={todoInputRef}
                placeholder='할 일을 추가해보세요'
                state={todoInputError ? 'error' : 'default'}
                value={todoInputValue}
                onChange={(event) => handleTodoInputChange(event.target.value)}
                onActionClick={handleAddTodo}
                onKeyDown={handleTodoInputKeyDown}
            />
            {todos.map((todo) => (
                <TodoItemRow
                    key={todo.id}
                    todo={todo}
                    showMoreButton={showMoreButton}
                    onCheckedChange={updateTodoChecked}
                    onDelete={removeTodo}
                    onLabelChange={updateTodoLabel}
                />
            ))}
        </div>
    );
});

interface TodoItemRowProps {
    todo: Todo;
    showMoreButton: boolean;
    onCheckedChange: (id: number, checked: boolean) => void;
    onDelete: (id: number) => void;
    onLabelChange: (id: number, label: string) => void;
}

const TodoItemRow = memo(({ todo, showMoreButton, onCheckedChange, onDelete, onLabelChange }: TodoItemRowProps) => {
    const handleCheckedChange = useCallback(
        (checked: boolean) => onCheckedChange(todo.id, checked),
        [onCheckedChange, todo.id]
    );
    const handleDelete = useCallback(() => onDelete(todo.id), [onDelete, todo.id]);
    const handleLabelChange = useCallback(
        (nextLabel: string) => onLabelChange(todo.id, nextLabel),
        [onLabelChange, todo.id]
    );

    return (
        <TodoItem
            checked={todo.checked}
            label={todo.label}
            maxChars={TODO_MAX_CHARS}
            moreButton={showMoreButton}
            onCheckedChange={handleCheckedChange}
            onDelete={handleDelete}
            onEmptyBlur={handleDelete}
            onLabelChange={handleLabelChange}
        />
    );
});
