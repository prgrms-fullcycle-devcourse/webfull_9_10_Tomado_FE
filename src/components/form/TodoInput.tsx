import type { InputHTMLAttributes, MouseEventHandler } from 'react';
import { forwardRef } from 'react';

import { Button, Icon, Shortcut } from '@@/ui';

export interface TodoInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    onActionClick?: MouseEventHandler<HTMLButtonElement>;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName = 'transition-shadow duration-200 ease-out hover:shadow-1 focus-within:border-neutral';

const getTodoInputWrapperClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'flex h-11 w-full items-center gap-2 rounded-xl bg-gray-50 px-4 border border-transparent',
        !disabled && interactiveClassName,
        disabled && 'bg-neutral-subtle'
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
    ({ className, fieldClassName, inputClassName, onActionClick, disabled = false, value, ...props }, ref) => {
        const isControlled = value !== undefined;
        const shouldShowAction = isControlled ? hasInputContent(value) : false;

        return (
            <div className={cx('flex w-full items-center gap-1', className)}>
                <div className={cx(getTodoInputWrapperClassName({ disabled }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ disabled })} name='add' size={16} />
                    <input
                        {...props}
                        ref={ref}
                        className={cx(getTodoInputClassName({ disabled }), inputClassName)}
                        disabled={disabled}
                        placeholder='할 일을 추가해보세요'
                        value={value}
                    />
                    {!shouldShowAction ? <Shortcut keys={['T']} /> : null}
                </div>
                {shouldShowAction ? <Button onClick={onActionClick}>Enter</Button> : null}
            </div>
        );
    }
);

TodoInput.displayName = 'TodoInput';
