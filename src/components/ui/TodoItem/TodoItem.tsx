import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';

import { Icon } from '@/components/ui/Icon';

import {
    checkboxIconClassName,
    cx,
    dragHandleButtonClassName,
    dragHandleIconClassName,
    getCheckboxButtonClassName,
    getTodoItemClassName,
    getTodoLabelClassName,
    todoItemEmptyClassName,
} from './styles';
import type { TodoItemProps } from './types';

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
