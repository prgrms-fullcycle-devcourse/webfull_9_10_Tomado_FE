import { forwardRef } from 'react';

import { Icon } from '@/components/ui/Icon';

import {
    cx,
    getInputClassName,
    getInputWrapperClassName,
    getLeadingIconClassName,
    resolveInputState,
    shortcutBadgeClassName,
} from './styles';
import type { SearchInputProps } from './types';

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            state = 'default',
            className,
            fieldClassName,
            inputClassName,
            shortcutLabel,
            endAdornment,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const resolvedState = resolveInputState({ state, disabled });
        const isDisabled = resolvedState === 'disabled';

        return (
            <div className={className}>
                <div className={cx(getInputWrapperClassName({ state: resolvedState }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ state: resolvedState })} name='search' size={16} />
                    <input
                        {...props}
                        ref={ref}
                        aria-invalid={resolvedState === 'error' || undefined}
                        className={cx(getInputClassName({ state: resolvedState }), inputClassName)}
                        disabled={isDisabled}
                        type='search'
                    />
                    {endAdornment ? (
                        endAdornment
                    ) : shortcutLabel ? (
                        <span aria-hidden='true' className={shortcutBadgeClassName}>
                            {shortcutLabel}
                        </span>
                    ) : null}
                </div>
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
