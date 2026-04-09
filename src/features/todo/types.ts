import type { Todo as TodoDto } from '@/api/generated/model/todo';

export interface Todo {
    id: string;
    title: string;
    description: string | null;
    assignedDate: string;
    sortOrder: number;
    completedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export const mapTodoDto = (todo: TodoDto): Todo => {
    return {
        id: todo.id ?? '',
        title: todo.title ?? '',
        description: todo.description ?? null,
        assignedDate: todo.assigned_date ?? '',
        sortOrder: todo.sort_order ?? 0,
        completedAt: todo.completed_at ?? null,
        createdAt: todo.created_at ?? null,
        updatedAt: todo.updated_at ?? null,
    };
};

export const isTodoCompleted = (todo: Todo) => {
    return Boolean(todo.completedAt);
};
