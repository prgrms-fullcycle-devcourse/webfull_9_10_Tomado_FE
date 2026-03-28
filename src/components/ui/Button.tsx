import type { ButtonHTMLAttributes, ForwardedRef, ReactElement, ReactNode } from 'react';
import { cloneElement, forwardRef, isValidElement } from 'react';

import { Icon } from './Icon/Icon';

export type ButtonVariant = 'filled' | 'outline' | 'ghost';
export type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconOnly?: boolean;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName =
    'transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed hover:cursor-pointer';

const variantClassNames: Record<ButtonVariant, string> = {
    filled: 'border-transparent bg-primary text-white hover:bg-primary-darker disabled:border-transparent disabled:bg-neutral-lighter disabled:text-neutral',
    outline:
        'border-2 border-neutral-subtle bg-transparent text-neutral-darker hover:border-primary hover:text-primary-darker disabled:border-neutral disabled:bg-transparent disabled:text-neutral',
    ghost: 'border-transparent bg-transparent text-neutral-darker hover:bg-neutral-subtle disabled:border-transparent disabled:bg-transparent disabled:text-neutral',
};

const sizeClassNames: Record<ButtonSize, { withLabel: string; iconOnly: string; icon: number }> = {
    lg: {
        withLabel: 'h-10 rounded-[0.625rem] px-4 text-base leading-5 font-medium',
        iconOnly: 'size-10 rounded-[0.625rem]',
        icon: 16,
    },
    md: {
        withLabel: 'h-8 rounded-lg px-3 text-sm leading-4 font-medium',
        iconOnly: 'size-8 rounded-lg',
        icon: 14,
    },
    sm: {
        withLabel: 'h-6 rounded-md px-2 text-xs leading-3 font-medium',
        iconOnly: 'size-6 rounded-md',
        icon: 10,
    },
};

const getButtonClassName = ({
    variant = 'filled',
    size = 'lg',
    fullWidth = false,
    iconOnly = false,
}: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth' | 'iconOnly'>) => {
    const resolvedSize = sizeClassNames[size];

    return cx(
        'inline-flex shrink-0 items-center justify-center gap-2 border text-current',
        interactiveClassName,
        fullWidth && 'w-full',
        iconOnly ? resolvedSize.iconOnly : resolvedSize.withLabel,
        variantClassNames[variant]
    );
};

const getButtonContentClassName = () => {
    return 'inline-flex items-center justify-center gap-2 whitespace-nowrap';
};

const renderButtonIcon = ({ icon, size = 'lg' }: Pick<ButtonProps, 'icon' | 'size'>) => {
    const iconSize = sizeClassNames[size].icon;

    if (icon) {
        const iconNode = isValidElement(icon)
            ? cloneElement(icon as ReactElement<Record<string, unknown>>, {
                  size: iconSize,
              })
            : icon;

        return (
            <span className='inline-flex shrink-0' style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
                {iconNode}
            </span>
        );
    }

    return <Icon name='arrow_up_right' size={iconSize} />;
};

const ButtonComponent = (
    {
        variant = 'filled',
        size = 'lg',
        fullWidth = false,
        iconOnly = false,
        icon,
        children,
        className,
        type = 'button',
        disabled = false,
        ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
) => {
    const hasVisualIcon = iconOnly || Boolean(icon);

    return (
        <button
            {...props}
            ref={ref}
            className={cx(
                getButtonClassName({
                    variant,
                    size,
                    fullWidth,
                    iconOnly,
                }),
                className
            )}
            disabled={disabled}
            type={type}
        >
            <span className={getButtonContentClassName()}>
                {hasVisualIcon ? renderButtonIcon({ icon, size }) : null}
                {iconOnly ? <span className='sr-only'>{children ?? 'Button action'}</span> : children}
            </span>
        </button>
    );
};

export const Button = forwardRef(ButtonComponent);

Button.displayName = 'Button';
