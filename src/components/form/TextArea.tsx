import type { TextareaHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

export type TextAreaState = 'default' | 'filled' | 'error';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
    label?: string;
    helperText?: string;
    state?: TextAreaState;
    className?: string;
    fieldClassName?: string;
    textareaClassName?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName =
    'transition-colors duration-200 ease-out hover:border-neutral focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10';

const stateClassNames: Record<TextAreaState, string> = {
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
    state?: TextAreaState;
    disabled?: boolean;
}) => {
    return cx(
        'pl-[10px] text-xs leading-4 text-neutral-darker',
        disabled && 'text-neutral',
        state === 'error' && 'text-danger'
    );
};

const getTextAreaWrapperClassName = ({
    state = 'default',
    disabled = false,
}: {
    state?: TextAreaState;
    disabled?: boolean;
}) => {
    return cx(
        'flex min-h-48 w-full rounded-2xl border px-4 py-3.5',
        !disabled && state !== 'error' && interactiveClassName,
        disabled && 'border-transparent bg-neutral-lighter',
        stateClassNames[state]
    );
};

const getTextAreaClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'min-h-40 w-full resize-none border-none bg-transparent text-sm leading-6 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none',
        disabled && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            helperText,
            state = 'default',
            className,
            fieldClassName,
            textareaClassName,
            id,
            disabled = false,
            rows = 7,
            'aria-describedby': ariaDescribedBy,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const textareaId = id ?? generatedId;
        const helperTextId = helperText ? `${textareaId}-helper` : undefined;
        const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={cx(getFieldContainerClassName(), className)}>
                {label ? (
                    <label className={getFieldLabelClassName({ disabled })} htmlFor={textareaId}>
                        {label}
                    </label>
                ) : null}
                <div className={cx(getTextAreaWrapperClassName({ state, disabled }), fieldClassName)}>
                    <textarea
                        {...props}
                        ref={ref}
                        aria-describedby={describedBy}
                        aria-invalid={state === 'error' || undefined}
                        className={cx(getTextAreaClassName({ disabled }), textareaClassName)}
                        disabled={disabled}
                        id={textareaId}
                        rows={rows}
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

TextArea.displayName = 'TextArea';
