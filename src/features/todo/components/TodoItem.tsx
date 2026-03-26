import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, MouseEventHandler } from 'react';

import { Icon } from '../../../components/ui/index';

export type TodoItemState = 'default' | 'filled' | 'focus' | 'empty';

export interface TodoItemProps extends HTMLAttributes<HTMLDivElement> {
    state?: TodoItemState;
    checked?: boolean;
    defaultChecked?: boolean;
    label?: string;
    emptyText?: string;
    checkboxLabel?: string;
    dragHandleLabel?: string;
    checkboxButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    dragHandleButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    onCheckClick?: MouseEventHandler<HTMLButtonElement>;
    onDragHandleClick?: MouseEventHandler<HTMLButtonElement>;
    onCheckedChange?: (checked: boolean) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const todoItemStateClassNames: Record<Exclude<TodoItemState, 'empty'>, string> = {
    default: 'bg-white',
    filled: 'bg-white',
    focus: 'bg-white shadow-md/10',
};

const getTodoItemClassName = (state: Exclude<TodoItemState, 'empty'> = 'default') => {
    return cx(
        'mx-2 my-3 flex w-full items-center gap-3 rounded-[0.65rem] px-3 py-2 transition-shadow duration-200 ease-out hover:cursor-pointer hover:shadow-md/10',
        todoItemStateClassNames[state]
    );
};

const todoItemEmptyClassName =
    'mx-2 my-3 flex min-h-10 w-full items-center text-base leading-tight font-medium text-neutral';

const dragHandleButtonClassName =
    'inline-flex h-7 shrink-0 items-center justify-center rounded-xl text-neutral transition-colors duration-200 ease-out hover:bg-neutral-subtle hover:text-neutral-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

const dragHandleIconClassName = 'text-inherit';
const checkboxIconClassName = 'text-inherit';

const getCheckboxButtonClassName = ({ checked = false }: Pick<TodoItemProps, 'checked'>) => {
    return cx(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        checked ? 'border-primary bg-primary text-white' : 'border-neutral-lighter bg-white text-transparent'
    );
};

const getTodoLabelClassName = ({ state = 'default', checked = false }: Pick<TodoItemProps, 'state' | 'checked'>) => {
    if (checked) {
        return 'truncate text-base font-medium text-neutral';
    }

    return cx('truncate text-base font-medium', state === 'default' ? 'text-neutral' : 'text-black');
};

export const TodoItem = ({
    state = 'default',
    checked,
    defaultChecked = false,
    label = '할일 작성',
    emptyText = '아직 작성된 할 일이 없습니다',
    checkboxLabel,
    dragHandleLabel = '순서 변경',
    checkboxButtonProps,
    dragHandleButtonProps,
    onCheckClick,
    onDragHandleClick,
    onCheckedChange,
    className,
    ...props
}: TodoItemProps) => {
    const [localChecked, setLocalChecked] = useState(checked ?? defaultChecked);

    useEffect(() => {
        if (checked !== undefined) {
            setLocalChecked(checked);
        }
    }, [checked]);

    const isChecked = localChecked;
    const resolvedCheckboxLabel = checkboxLabel ?? (isChecked ? '완료한 할 일' : '미완료 할 일');

    if (state === 'empty') {
        return (
            <div {...props} className={cx(todoItemEmptyClassName, className)}>
                <p>{emptyText}</p>
            </div>
        );
    }

    const handleCheckClick = (event: MouseEvent<HTMLButtonElement>) => {
        checkboxButtonProps?.onClick?.(event);
        onCheckClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const nextChecked = !isChecked;
        setLocalChecked(nextChecked);
        onCheckedChange?.(nextChecked);
    };

    const handleDragHandleClick = (event: MouseEvent<HTMLButtonElement>) => {
        dragHandleButtonProps?.onClick?.(event);
        onDragHandleClick?.(event);
    };

    return (
        <div {...props} className={cx(getTodoItemClassName(state), className)}>
            <button
                {...dragHandleButtonProps}
                aria-label={dragHandleButtonProps?.['aria-label'] ?? dragHandleLabel}
                className={cx(dragHandleButtonClassName, dragHandleButtonProps?.className)}
                onClick={handleDragHandleClick}
                type={dragHandleButtonProps?.type ?? 'button'}
            >
                <Icon className={dragHandleIconClassName} name='drag_indicator' size={18} />
            </button>

            <button
                {...checkboxButtonProps}
                aria-checked={isChecked}
                aria-label={checkboxButtonProps?.['aria-label'] ?? resolvedCheckboxLabel}
                className={cx(getCheckboxButtonClassName({ checked: isChecked }), checkboxButtonProps?.className)}
                onClick={handleCheckClick}
                role='checkbox'
                type={checkboxButtonProps?.type ?? 'button'}
            >
                {isChecked ? <Icon className={checkboxIconClassName} name='check' size={18} /> : null}
            </button>

            <p className={getTodoLabelClassName({ state, checked: isChecked })} style={{ lineHeight: 'normal' }}>
                {label}
            </p>
        </div>
    );
};
