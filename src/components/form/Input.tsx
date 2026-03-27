import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

import { Icon } from '@@/ui';

export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    helperText?: string;
    iconName?: string;
    state?: InputState;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName = 'transition-shadow duration-200 ease-out hover:shadow-2 focus-within:border-neutral';

const stateClassNames: Record<InputState, string> = {
    default: 'border border-transparent',
    error: 'box-border border-2 border-danger',
    success: 'border border-transparent',
};

const getFieldContainerClassName = () => {
    return 'flex w-full flex-col gap-2';
};

const getFieldLabelClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx('pl-[5px] text-sm leading-5 font-semibold text-gray-800', disabled && 'text-neutral');
};

const getFieldHelperTextClassName = ({
    state = 'default',
    disabled = false,
}: {
    state?: InputState;
    disabled?: boolean;
}) => {
    return cx(
        'pl-[5px] text-xs leading-4 text-gray-500',
        disabled && 'text-neutral',
        state === 'error' && 'text-danger'
    );
};

const getInputWrapperClassName = ({
    state = 'default',
    disabled = false,
}: {
    state?: InputState;
    disabled?: boolean;
}) => {
    return cx(
        'flex h-10 w-full items-center gap-2 rounded-xl bg-gray-50 px-4',
        !disabled && interactiveClassName,
        disabled && 'bg-neutral-subtle',
        stateClassNames[state]
    );
};

const getInputClassName = ({ disabled = false, state = 'default' }: { disabled?: boolean; state?: InputState }) => {
    return cx(
        'w-full min-w-0 flex-1 overflow-hidden text-ellipsis border-none bg-transparent text-sm leading-5 placeholder:font-normal placeholder:text-neutral focus:outline-none',
        state === 'success' ? 'text-gray-900' : 'text-black',
        disabled && 'cursor-not-allowed text-neutral placeholder:text-neutral'
    );
};

const getInputIconClassName = ({ state = 'default', disabled = false }: { state?: InputState; disabled?: boolean }) => {
    if (disabled) {
        return 'shrink-0 text-neutral';
    }

    if (state === 'error') {
        return 'shrink-0 text-danger';
    }

    if (state === 'success') {
        return 'shrink-0 text-success';
    }

    return 'shrink-0 text-gray-800';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            iconName,
            state = 'default',
            className,
            fieldClassName,
            inputClassName,
            id,
            disabled = false,
            type = 'text',
            'aria-describedby': ariaDescribedBy,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const helperTextId = helperText ? `${inputId}-helper` : undefined;
        const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={cx(getFieldContainerClassName(), className)}>
                {label ? (
                    <label className={getFieldLabelClassName({ disabled })} htmlFor={inputId}>
                        {label}
                    </label>
                ) : null}

                <div className={cx(getInputWrapperClassName({ state, disabled }), fieldClassName)}>
                    <input
                        {...props}
                        ref={ref}
                        aria-describedby={describedBy}
                        aria-invalid={state === 'error' || undefined}
                        className={cx(getInputClassName({ disabled, state }), inputClassName)}
                        disabled={disabled}
                        id={inputId}
                        type={type}
                    />

                    {iconName ? (
                        <Icon className={getInputIconClassName({ state, disabled })} name={iconName} size={20} />
                    ) : null}
                </div>

                {helperText ? (
                    <p className={getFieldHelperTextClassName({ state, disabled })} id={helperTextId}>
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
