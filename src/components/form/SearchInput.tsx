import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Icon, Shortcut } from '@@/ui';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName = 'transition-shadow duration-200 ease-out hover:shadow-1 focus-within:border-neutral';

const getSearchInputWrapperClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'flex h-10 w-full items-center gap-2 rounded-xl border border-transparent bg-gray-50 px-4',
        !disabled && interactiveClassName,
        disabled && 'bg-neutral-subtle'
    );
};

const getSearchInputClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx(
        'min-w-0 flex-1 border-none bg-transparent text-sm leading-5 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
        disabled && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

const getLeadingIconClassName = ({ disabled = false }: { disabled?: boolean }) => {
    return cx('shrink-0 text-neutral-darker', disabled && 'text-neutral');
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, fieldClassName, inputClassName, disabled = false, ...props }, ref) => {
        return (
            <div className={cx('w-full', className)}>
                <div className={cx(getSearchInputWrapperClassName({ disabled }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ disabled })} name='search' size={16} />
                    <input
                        {...props}
                        ref={ref}
                        className={cx(getSearchInputClassName({ disabled }), inputClassName)}
                        disabled={disabled}
                        placeholder='제목 또는 내용으로 검색하세요'
                        type='search'
                    />
                    <Shortcut keys={['F']} />
                </div>
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
