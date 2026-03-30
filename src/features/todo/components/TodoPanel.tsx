import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Modal, Calendar } from '@@/ui';
import { useTodoList, TODO_MAX_CHARS, TodoInput, TodoItem, useTodoStore, type Todo } from '@@@/todo';
import { useInputFocus, useSubmitOnEnter } from '@/hooks';
import { getTodayDate, formatTodayDate, parseTodayDate } from '@/utils';

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
    const moveTodoDate = useTodoStore((state) => state.moveTodoDate);
    const reorderTodos = useTodoStore((state) => state.reorderTodos);
    const [moveTargetTodo, setMoveTargetTodo] = useState<Todo | null>(null);
    const [selectedMoveDate, setSelectedMoveDate] = useState<Date>(() => parseTodayDate(getTodayDate()));

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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        })
    );
    const handleTodoInputKeyDown = useSubmitOnEnter<HTMLInputElement>({ onSubmit: handleAddTodo });
    const moveModalOpen = Boolean(moveTargetTodo);
    const sortableIds = useMemo(() => todos.map((todo) => todo.id), [todos]);
    const handleCloseMoveModal = useCallback(() => {
        setMoveTargetTodo(null);
    }, []);
    const handleOpenMoveModal = useCallback((todo: Todo) => {
        setMoveTargetTodo(todo);
        setSelectedMoveDate(parseTodayDate(todo.assignedDate));
    }, []);
    const handleConfirmMoveDate = useCallback(() => {
        if (!moveTargetTodo) {
            return;
        }

        moveTodoDate(moveTargetTodo.id, formatTodayDate(selectedMoveDate));
        setMoveTargetTodo(null);
    }, [moveTargetTodo, moveTodoDate, selectedMoveDate]);
    const handleDragEnd = useCallback(
        ({ active, over }: DragEndEvent) => {
            if (!over || active.id === over.id) {
                return;
            }

            const oldIndex = todos.findIndex((todo) => todo.id === active.id);
            const newIndex = todos.findIndex((todo) => todo.id === over.id);

            if (oldIndex < 0 || newIndex < 0) {
                return;
            }

            const nextTodos = arrayMove(todos, oldIndex, newIndex);
            reorderTodos(
                getTodayDate(),
                nextTodos.map((todo) => todo.id)
            );
        },
        [reorderTodos, todos]
    );

    return (
        <>
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
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                        {todos.map((todo) => (
                            <SortableTodoItemRow
                                key={todo.id}
                                todo={todo}
                                showMoreButton={showMoreButton}
                                onCheckedChange={updateTodoChecked}
                                onDelete={removeTodo}
                                onLabelChange={updateTodoLabel}
                                onMoveDate={handleOpenMoveModal}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            <Modal
                cancelLabel='취소'
                confirmLabel='이동하기'
                onCancel={handleCloseMoveModal}
                onClose={handleCloseMoveModal}
                onConfirm={handleConfirmMoveDate}
                open={moveModalOpen}
                title='날짜 이동하기'
            >
                <Calendar onSelectDate={setSelectedMoveDate} selectedDate={selectedMoveDate} />
            </Modal>
        </>
    );
});

interface TodoItemRowProps {
    todo: Todo;
    showMoreButton: boolean;
    onCheckedChange: (id: number, checked: boolean) => void;
    onDelete: (id: number) => void;
    onLabelChange: (id: number, label: string) => void;
    onMoveDate: (todo: Todo) => void;
}

const SortableTodoItemRow = memo((props: TodoItemRowProps) => {
    const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props.todo.id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <TodoItem
                checked={props.todo.checked}
                className='touch-none'
                dragHandleAttributes={attributes}
                dragHandleListeners={listeners}
                dragHandleRef={setActivatorNodeRef}
                isDragging={isDragging}
                label={props.todo.label}
                maxChars={TODO_MAX_CHARS}
                moreButton={props.showMoreButton}
                onCheckedChange={(checked) => props.onCheckedChange(props.todo.id, checked)}
                onDelete={() => props.onDelete(props.todo.id)}
                onEmptyBlur={() => props.onDelete(props.todo.id)}
                onLabelChange={(nextLabel) => props.onLabelChange(props.todo.id, nextLabel)}
                onMoveDate={() => props.onMoveDate(props.todo)}
            />
        </div>
    );
});
