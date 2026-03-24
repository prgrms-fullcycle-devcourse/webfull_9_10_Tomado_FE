import { forwardRef, useId } from 'react';

import {
    cx,
    getFieldContainerClassName,
    getFieldHelperTextClassName,
    getFieldLabelClassName,
    getInputClassName,
    getInputWrapperClassName,
    resolveInputState,
} from './styles';
import type { StandardInputProps } from './types';

export const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
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
        const resolvedState = resolveInputState({ state, disabled });
        const isDisabled = resolvedState === 'disabled';
        const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={cx(getFieldContainerClassName(), className)}>
                {label ? (
                    <label className={getFieldLabelClassName({ state: resolvedState })} htmlFor={inputId}>
                        {label}
                    </label>
                ) : null}
                <div className={cx(getInputWrapperClassName({ state: resolvedState }), fieldClassName)}>
                    <input
                        {...props}
                        ref={ref}
                        aria-describedby={describedBy}
                        aria-invalid={resolvedState === 'error' || undefined}
                        className={cx(getInputClassName({ state: resolvedState }), inputClassName)}
                        disabled={isDisabled}
                        id={inputId}
                        type={type}
                    />
                </div>
                {helperText ? (
                    <p className={getFieldHelperTextClassName({ state: resolvedState })} id={helperTextId}>
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

StandardInput.displayName = 'StandardInput';
