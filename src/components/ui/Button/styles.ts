import type { ButtonProps, ButtonSize, ButtonState, ButtonVariant } from './types';

export const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const baseClassName =
    'inline-flex shrink-0 items-center justify-center gap-2 border transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed';

const variantClassNames: Record<ButtonVariant, Record<ButtonState, string>> = {
    filled: {
        default: 'border-transparent bg-primary text-white hover:bg-primary-darker',
        disabled: 'border-transparent bg-neutral-lighter text-neutral',
    },
    outline: {
        default: 'border-neutral-lighter bg-white text-neutral-darker hover:border-primary hover:text-primary',
        disabled: 'border-neutral-lighter bg-white text-neutral',
    },
    ghost: {
        default: 'border-transparent bg-transparent text-neutral-darker hover:text-primary',
        disabled: 'border-transparent bg-transparent text-neutral',
    },
};

const sizeClassNames: Record<ButtonSize, { button: string; icon: string }> = {
    md: {
        button: 'h-10 rounded-[0.625rem] px-4 text-base leading-5 font-medium',
        icon: 'size-4',
    },
    sm: {
        button: 'h-8 rounded-lg px-3 text-sm leading-4 font-medium',
        icon: 'size-3.5',
    },
};

export const getButtonClassName = ({
    variant = 'filled',
    state = 'default',
    size = 'md',
    fullWidth = false,
    iconOnly = false,
}: Pick<ButtonProps, 'variant' | 'state' | 'size' | 'fullWidth' | 'iconOnly'>) => {
    const palette = variantClassNames[variant][state];
    const sizing = sizeClassNames[size];

    return cx(
        baseClassName,
        palette,
        fullWidth && 'w-full',
        iconOnly ? 'aspect-square px-0' : sizing.button,
        !iconOnly && sizing.button
    );
};

export const getButtonContentClassName = ({ iconOnly = false }: Pick<ButtonProps, 'iconOnly'>) => {
    return cx('inline-flex items-center justify-center gap-2 whitespace-nowrap', iconOnly && 'sr-only');
};

export const getButtonIconClassName = ({ size = 'md' }: Pick<ButtonProps, 'size'>) => {
    return sizeClassNames[size].icon;
};

export const buttonGroupClassName = 'flex w-full items-stretch gap-4';
