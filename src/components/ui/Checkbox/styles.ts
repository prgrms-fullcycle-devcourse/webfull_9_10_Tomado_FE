import type { CheckboxProps, CheckboxSize } from './types';

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const checkboxSizeClassNames: Record<CheckboxSize, { button: string; icon: number }> = {
    sm: {
        button: 'size-8 rounded-lg',
        icon: 18,
    },
    md: {
        button: 'size-11 rounded-xl',
        icon: 24,
    },
};

export const getCheckboxClassName = ({
    checked = false,
    size = 'md',
    disabled = false,
}: Pick<CheckboxProps, 'checked' | 'size' | 'disabled'>) => {
    return cx(
        'inline-flex shrink-0 items-center justify-center border-2 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        checkboxSizeClassNames[size].button,
        checked ? 'border-primary bg-primary text-white' : 'border-neutral-lighter bg-white text-transparent',
        !disabled && !checked && 'hover:border-neutral',
        disabled && 'cursor-not-allowed opacity-60'
    );
};

export const getCheckboxIconSize = (size: CheckboxSize) => checkboxSizeClassNames[size].icon;

export const checkboxIconClassName = 'text-inherit';

export { cx };
