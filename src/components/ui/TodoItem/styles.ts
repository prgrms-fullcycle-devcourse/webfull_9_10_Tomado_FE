import type { TodoItemProps, TodoItemState } from './types';

export const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const todoItemStateClassNames: Record<Exclude<TodoItemState, 'empty'>, string> = {
    default: 'bg-white',
    filled: 'bg-white',
    focus: 'bg-white shadow-md/10',
};

export const getTodoItemClassName = (state: Exclude<TodoItemState, 'empty'> = 'default') => {
    return cx(
        'mx-2 my-3 flex w-full items-center gap-3 rounded-[0.65rem] px-3 py-2 transition-shadow duration-200 ease-out hover:cursor-pointer hover:shadow-md/10',
        todoItemStateClassNames[state]
    );
};

export const todoItemEmptyClassName =
    'flex w-full items-center text-base mx-2 my-3 min-h-10 leading-tight font-medium text-neutral';

export const dragHandleButtonClassName =
    'inline-flex h-7 shrink-0 items-center justify-center rounded-xl text-neutral transition-colors duration-200 ease-out hover:bg-neutral-subtle hover:text-neutral-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

export const dragHandleIconClassName = 'text-inherit';

export const getCheckboxButtonClassName = ({ checked = false }: Pick<TodoItemProps, 'checked'>) => {
    return cx(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        checked ? 'border-primary bg-primary text-white' : 'border-neutral-lighter bg-white text-transparent'
    );
};

export const checkboxIconClassName = 'text-inherit';

export const getTodoLabelClassName = ({
    state = 'default',
    checked = false,
}: Pick<TodoItemProps, 'state' | 'checked'>) => {
    if (checked) {
        return 'truncate text-base font-medium text-neutral';
    }

    return cx('truncate text-base font-medium', state === 'default' ? 'text-neutral' : 'text-black');
};
