import type {
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    MouseEventHandler,
    ReactNode,
    TextareaHTMLAttributes,
} from 'react';

export type InputState = 'default' | 'filled' | 'focus' | 'disabled' | 'error';

export interface BaseFieldProps {
    label?: string;
    helperText?: string;
    state?: InputState;
    className?: string;
    fieldClassName?: string;
}

export interface StandardInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseFieldProps {
    inputClassName?: string;
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    state?: InputState;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    shortcutLabel?: string;
    endAdornment?: ReactNode;
}

export interface TodoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    state?: InputState;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    shortcutLabel?: string;
    actionLabel?: string;
    actionButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    onActionClick?: MouseEventHandler<HTMLButtonElement>;
    endAdornment?: ReactNode;
}

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'>, BaseFieldProps {
    textareaClassName?: string;
}
