import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

export type InputState = 'default' | 'filled' | 'error';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    helperText?: string;
    state?: InputState;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName =
    'transition-colors duration-200 ease-out hover:border-neutral focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10';

const stateClassNames: Record<InputState, string> = {
    default: 'border-transparent bg-neutral-subtle',
    filled: 'border-transparent bg-neutral-subtle',
    error: 'border-danger bg-neutral-subtle ring-2 ring-danger/10 hover:border-danger focus-within:border-danger focus-within:ring-danger/10',
};

const getFieldContainerClassName = () => {
    return 'flex w-full flex-col gap-2';
};

const getFieldLabelClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx('pl-[10px] text-sm leading-5 font-semibold text-black', disabled && 'text-neutral-darker');
};

const getFieldHelperTextClassName = ({
    state = 'default',
    disabled = false,
}: {
    state?: InputState;
    disabled?: boolean;
}) => {
    return cx(
        'pl-[10px] text-xs leading-4 text-neutral-darker',
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
        'flex h-11 w-full items-center gap-2 rounded-2xl border px-4',
        !disabled && state !== 'error' && interactiveClassName,
        disabled && 'border-transparent bg-neutral-lighter',
        stateClassNames[state]
    );
};

const getInputClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'min-w-0 flex-1 border-none bg-transparent text-sm leading-5 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none',
        disabled && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
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
                        className={cx(getInputClassName({ disabled }), inputClassName)}
                        disabled={disabled}
                        id={inputId}
                        type={type}
                    />
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
