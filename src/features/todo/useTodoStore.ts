import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Todo {
    id: number;
    label: string;
    checked: boolean;
    assignedDate: string;
    order: number;
}

interface TodoStore {
    todos: Todo[];
    addTodo: (label: string, assignedDate: string) => Todo;
    updateTodoLabel: (id: number, nextLabel: string) => void;
    updateTodoChecked: (id: number, checked: boolean) => void;
    moveTodoDate: (id: number, nextAssignedDate: string) => void;
    reorderTodos: (assignedDate: string, orderedIds: number[]) => void;
    removeTodo: (id: number) => Todo | null;
    restoreTodo: (todo: Todo, restoreOrder: number) => void;
}

const normalizeOrdersForDate = (todos: Todo[], assignedDate: string) => {
    const targetIds = todos
        .filter((todo) => todo.assignedDate === assignedDate)
        .sort((a, b) => a.order - b.order)
        .map((todo) => todo.id);

    return todos.map((todo) => {
        if (todo.assignedDate !== assignedDate) {
            return todo;
        }

        return {
            ...todo,
            order: targetIds.indexOf(todo.id),
        };
    });
};

export const useTodoStore = create<TodoStore>()(
    devtools((set, get) => ({
        todos: [],

        addTodo: (label, assignedDate) => {
            const nextTodo: Todo = {
                id: Date.now(),
                label,
                checked: false,
                assignedDate,
                order: 0,
            };

            set((state) => ({
                todos: [
                    nextTodo,
                    ...state.todos.map((todo) =>
                        todo.assignedDate === assignedDate ? { ...todo, order: todo.order + 1 } : todo
                    ),
                ],
            }));

            return nextTodo;
        },

        updateTodoLabel: (id, nextLabel) => {
            set((state) => ({
                todos: state.todos.map((todo) => (todo.id === id ? { ...todo, label: nextLabel } : todo)),
            }));
        },

        updateTodoChecked: (id, checked) => {
            set((state) => ({
                todos: state.todos.map((todo) => (todo.id === id ? { ...todo, checked } : todo)),
            }));
        },

        moveTodoDate: (id, nextAssignedDate) => {
            set((state) => {
                const targetTodo = state.todos.find((todo) => todo.id === id);

                if (!targetTodo || targetTodo.assignedDate === nextAssignedDate) {
                    return state;
                }

                const nextOrder = state.todos.filter((todo) => todo.assignedDate === nextAssignedDate).length;
                const movedTodos = state.todos.map((todo) =>
                    todo.id === id
                        ? {
                              ...todo,
                              assignedDate: nextAssignedDate,
                              order: nextOrder,
                          }
                        : todo
                );

                return {
                    todos: normalizeOrdersForDate(movedTodos, targetTodo.assignedDate),
                };
            });
        },

        reorderTodos: (assignedDate, orderedIds) => {
            set((state) => {
                const orderedIdSet = new Set(orderedIds);
                const dateTodos = state.todos
                    .filter((todo) => todo.assignedDate === assignedDate)
                    .sort((a, b) => a.order - b.order);

                if (dateTodos.length === 0) {
                    return state;
                }

                const fallbackIds = dateTodos.map((todo) => todo.id).filter((id) => !orderedIdSet.has(id));

                const nextIds = [...orderedIds, ...fallbackIds];

                return {
                    todos: state.todos.map((todo) => {
                        if (todo.assignedDate !== assignedDate) {
                            return todo;
                        }

                        const nextOrder = nextIds.indexOf(todo.id);

                        return {
                            ...todo,
                            order: nextOrder < 0 ? todo.order : nextOrder,
                        };
                    }),
                };
            });
        },

        removeTodo: (id) => {
            const deletedTodo = get().todos.find((todo) => todo.id === id) ?? null;

            if (!deletedTodo) {
                return null;
            }

            set((state) => ({
                todos: normalizeOrdersForDate(
                    state.todos.filter((todo) => todo.id !== id),
                    deletedTodo.assignedDate
                ),
            }));

            return deletedTodo;
        },

        restoreTodo: (todo, restoreOrder) => {
            set((state) => {
                const exists = state.todos.some((item) => item.id === todo.id);

                if (exists) {
                    return state;
                }

                const insertedTodos = state.todos.map((item) =>
                    item.assignedDate === todo.assignedDate && item.order >= restoreOrder
                        ? { ...item, order: item.order + 1 }
                        : item
                );

                return {
                    todos: normalizeOrdersForDate(
                        [...insertedTodos, { ...todo, order: restoreOrder }],
                        todo.assignedDate
                    ),
                };
            });
        },
    }))
);
