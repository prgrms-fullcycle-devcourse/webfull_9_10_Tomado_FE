import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Icon } from '@@/ui';

export type SearchInputState = 'default' | 'filled' | 'error';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    state?: SearchInputState;
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    shortcutLabel?: string;
    endAdornment?: ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName =
    'transition-colors duration-200 ease-out hover:border-neutral focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10';

const stateClassNames: Record<SearchInputState, string> = {
    default: 'border-transparent bg-neutral-subtle',
    filled: 'border-transparent bg-neutral-subtle',
    error: 'border-danger bg-neutral-subtle ring-2 ring-danger/10 hover:border-danger focus-within:border-danger focus-within:ring-danger/10',
};

const shortcutBadgeClassName =
    'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-neutral bg-white px-1.5 text-[10px] leading-none font-medium text-neutral-darker';

const getSearchInputWrapperClassName = ({
    state = 'default',
    disabled = false,
}: {
    state?: SearchInputState;
    disabled?: boolean;
}) => {
    return cx(
        'flex h-11 w-full items-center gap-2 rounded-2xl border px-4',
        !disabled && state !== 'error' && interactiveClassName,
        disabled && 'border-transparent bg-neutral-lighter',
        stateClassNames[state]
    );
};

const getSearchInputClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'min-w-0 flex-1 border-none bg-transparent text-sm leading-5 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none',
        disabled && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

const getLeadingIconClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx('shrink-0 text-neutral-darker', disabled && 'text-neutral');
};

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
        return (
            <div className={className}>
                <div className={cx(getSearchInputWrapperClassName({ state, disabled }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ disabled })} name='search' size={16} />
                    <input
                        {...props}
                        ref={ref}
                        aria-invalid={state === 'error' || undefined}
                        className={cx(getSearchInputClassName({ disabled }), inputClassName)}
                        disabled={disabled}
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
