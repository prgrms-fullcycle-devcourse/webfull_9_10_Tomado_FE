import { forwardRef, useState } from 'react';

import { Icon } from '@/components/ui/Icon';

import {
    cx,
    getInputClassName,
    getInputWrapperClassName,
    getLeadingIconClassName,
    resolveInputState,
    shortcutBadgeClassName,
    todoActionButtonClassName,
} from './styles';
import type { TodoInputProps } from './types';

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
        const resolvedState = resolveInputState({ state, disabled });
        const isDisabled = resolvedState === 'disabled';
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
                <div className={cx(getInputWrapperClassName({ state: resolvedState }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ state: resolvedState })} name='add' size={16} />
                    <input
                        {...props}
                        ref={ref}
                        aria-invalid={resolvedState === 'error' || undefined}
                        className={cx(getInputClassName({ state: resolvedState }), inputClassName)}
                        defaultValue={defaultValue}
                        disabled={isDisabled}
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
                        disabled={isDisabled || actionButtonProps?.disabled}
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
