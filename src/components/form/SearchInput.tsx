import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Icon, Shortcut } from '@@/ui';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    className?: string;
    fieldClassName?: string;
    inputClassName?: string;
    rightElement?: ReactNode;
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

const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;

    const tagName = target.tagName.toLowerCase();

    return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, fieldClassName, inputClassName, rightElement, disabled = false, ...props }, ref) => {
        const [isFocus, setIsFocus] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        useEffect(() => {
            if (disabled) return;

            const handleShortcutKeyDown = (event: KeyboardEvent) => {
                if (event.code !== 'KeyF') return;
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.isComposing) return;
                if (document.activeElement === inputRef.current || isEditableTarget(event.target)) return;

                event.preventDefault();
                inputRef.current?.focus();
            };

            window.addEventListener('keydown', handleShortcutKeyDown);

            return () => {
                window.removeEventListener('keydown', handleShortcutKeyDown);
            };
        }, [disabled]);

        return (
            <div className={cx('w-full', className)}>
                <div className={cx(getSearchInputWrapperClassName({ disabled }), fieldClassName)}>
                    <Icon className={getLeadingIconClassName({ disabled })} name='search' size={16} />
                    <input
                        {...props}
                        ref={inputRef}
                        className={cx(getSearchInputClassName({ disabled }), inputClassName)}
                        disabled={disabled}
                        placeholder='제목 또는 내용으로 검색하세요'
                        type='search'
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                    />
                    {rightElement}
                    {!rightElement && !isFocus && <Shortcut keys={['F']} />}
                </div>
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
