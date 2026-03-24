import { forwardRef, useId } from 'react';

import {
    cx,
    getFieldContainerClassName,
    getFieldHelperTextClassName,
    getFieldLabelClassName,
    getTextAreaClassName,
    getTextAreaWrapperClassName,
    resolveInputState,
} from './styles';
import type { TextAreaProps } from './types';

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
        const resolvedState = resolveInputState({ state, disabled });
        const isDisabled = resolvedState === 'disabled';
        const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={cx(getFieldContainerClassName(), className)}>
                {label ? (
                    <label className={getFieldLabelClassName({ state: resolvedState })} htmlFor={textareaId}>
                        {label}
                    </label>
                ) : null}
                <div className={cx(getTextAreaWrapperClassName({ state: resolvedState }), fieldClassName)}>
                    <textarea
                        {...props}
                        ref={ref}
                        aria-describedby={describedBy}
                        aria-invalid={resolvedState === 'error' || undefined}
                        className={cx(getTextAreaClassName({ state: resolvedState }), textareaClassName)}
                        disabled={isDisabled}
                        id={textareaId}
                        rows={rows}
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

TextArea.displayName = 'TextArea';
