import type { ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler } from 'react';

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
