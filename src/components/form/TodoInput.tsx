import type { ButtonHTMLAttributes, InputHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { forwardRef, useState } from 'react';

import { Icon } from '@/components/ui/Icon';

export type TodoInputState = 'default' | 'filled' | 'error';

export interface TodoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    state?: TodoInputState;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    shortcutLabel?: string;
    actionLabel?: string;
    actionButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    onActionClick?: MouseEventHandler<HTMLButtonElement>;
    endAdornment?: ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName =
    'transition-colors duration-200 ease-out hover:border-neutral focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10';

const stateClassNames: Record<TodoInputState, string> = {
    default: 'border-transparent bg-neutral-subtle',
    filled: 'border-transparent bg-neutral-subtle',
    error: 'border-danger bg-neutral-subtle ring-2 ring-danger/10 hover:border-danger focus-within:border-danger focus-within:ring-danger/10',
};

const shortcutBadgeClassName =
    'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-neutral bg-white px-1.5 text-[10px] leading-none font-medium text-neutral-darker';

const todoActionButtonClassName =
    'inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-primary px-4 text-sm leading-5 font-semibold text-white transition-colors duration-200 ease-out hover:bg-primary-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-neutral-lighter disabled:text-neutral';

const getTodoInputWrapperClassName = ({
    state = 'default',
    disabled = false,
}: {
    state?: TodoInputState;
    disabled?: boolean;
}) => {
    return cx(
        'flex h-11 w-full items-center gap-2 rounded-2xl border px-4',
        !disabled && state !== 'error' && interactiveClassName,
        disabled && 'border-transparent bg-neutral-lighter',
        stateClassNames[state]
    );
};

const getTodoInputClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'min-w-0 flex-1 border-none bg-transparent text-sm leading-5 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none',
        disabled && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

const getLeadingIconClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx('shrink-0 text-neutral-darker', disabled && 'text-neutral');
};

const hasInputContent = (value: TodoInputProps['value'] | TodoInputProps['defaultValue']) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }

    if (typeof value === 'number') {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return false;
};

export const TodoInput = forwardRef<HTMLInputElement, TodoInputProps>(
    (
        {
            state = 'default',
            className,
            fieldClassName,
            inputClassName,
            shortcutLabel = 'T',
            actionLabel = 'Enter',
            actionButtonProps,
            onActionClick,
            endAdornment,
            disabled = false,
            value,
            defaultValue,
            onChange,
            ...props
        },
        ref
    ) => {
        const isControlled = value !== undefined;
        const [uncontrolledHasContent, setUncontrolledHasContent] = useState(() => hasInputContent(defaultValue));
        const shouldShowAction =
            Boolean(actionLabel) && (isControlled ? hasInputContent(value) : uncontrolledHasContent);

        const handleChange: TodoInputProps['onChange'] = (event) => {
            if (!isControlled) {
                setUncontrolledHasContent(event.target.value.trim().length > 0);
            }

            onChange?.(event);
        };

        return (
            <div className={cx('flex w-full items-center gap-3', className)}>
                <div className={cx(getTodoInputWrapperClassName({ state, disabled }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ disabled })} name='add' size={16} />
                    <input
                        {...props}
                        ref={ref}
                        aria-invalid={state === 'error' || undefined}
                        className={cx(getTodoInputClassName({ disabled }), inputClassName)}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        onChange={handleChange}
                        type='text'
                        value={value}
                    />
                    {!shouldShowAction && endAdornment ? (
                        endAdornment
                    ) : !shouldShowAction && shortcutLabel ? (
                        <span aria-hidden='true' className={shortcutBadgeClassName}>
                            {shortcutLabel}
                        </span>
                    ) : null}
                </div>
                {shouldShowAction ? (
                    <button
                        {...actionButtonProps}
                        className={cx(todoActionButtonClassName, actionButtonProps?.className)}
                        disabled={disabled || actionButtonProps?.disabled}
                        onClick={onActionClick}
                        type={actionButtonProps?.type ?? 'button'}
                    >
                        {actionLabel}
                    </button>
                ) : null}
            </div>
        );
    }
);

TodoInput.displayName = 'TodoInput';
