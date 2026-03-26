import type { ButtonHTMLAttributes, ForwardedRef, ReactElement, ReactNode } from 'react';
import { cloneElement, forwardRef, isValidElement } from 'react';

import { Icon } from './index';

export type PlayerButtonVariant = 'filled' | 'outline' | 'ghost';
export type PlayerButtonSize = 'lg' | 'md' | 'sm';

export interface PlayerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: PlayerButtonVariant;
    size?: PlayerButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveClassName =
    'transition-colors duration-200 ease-out hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed';

const variantClassNames: Record<PlayerButtonVariant, string> = {
    filled: 'border-transparent bg-primary text-white hover:bg-primary-darker disabled:border-transparent disabled:bg-neutral-lighter disabled:text-neutral',
    outline:
        'border-2 border-neutral-subtle bg-transparent text-neutral-darker hover:border-primary hover:text-primary-darker disabled:border-neutral disabled:bg-transparent disabled:text-neutral',
    ghost: 'border-transparent bg-transparent text-neutral-darker hover:bg-neutral-subtle disabled:border-transparent disabled:bg-transparent disabled:text-neutral',
};

const sizeClassNames: Record<PlayerButtonSize, { button: string; icon: number }> = {
    lg: {
        button: 'size-20 rounded-full',
        icon: 60,
    },
    md: {
        button: 'size-15 rounded-full',
        icon: 40,
    },
    sm: {
        button: 'size-10 rounded-full',
        icon: 30,
    },
};

const getPlayerButtonClassName = ({
    variant = 'filled',
    size = 'lg',
    fullWidth = false,
}: Pick<PlayerButtonProps, 'variant' | 'size' | 'fullWidth'>) => {
    return cx(
        'inline-flex shrink-0 items-center justify-center border text-current',
        interactiveClassName,
        sizeClassNames[size].button,
        fullWidth && 'w-full',
        variantClassNames[variant]
    );
};

const getPlayerButtonIconSize = ({ size = 'lg' }: Pick<PlayerButtonProps, 'size'>) => {
    return sizeClassNames[size].icon;
};

const renderPlayerButtonIcon = ({ icon, size = 'lg' }: Pick<PlayerButtonProps, 'icon' | 'size'>) => {
    const iconSize = getPlayerButtonIconSize({ size });

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

    return <Icon name='play' size={iconSize} />;
};

const PlayerButtonComponent = (
    {
        variant = 'filled',
        size = 'lg',
        fullWidth = false,
        icon,
        children,
        className,
        type = 'button',
        disabled = false,
        ...props
    }: PlayerButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
) => {
    return (
        <button
            {...props}
            ref={ref}
            className={cx(
                getPlayerButtonClassName({
                    variant,
                    size,
                    fullWidth,
                }),
                className
            )}
            disabled={disabled}
            type={type}
        >
            <span className='inline-flex items-center justify-center'>{renderPlayerButtonIcon({ icon, size })}</span>
            <span className='sr-only'>{children ?? 'Play'}</span>
        </button>
    );
};

export const PlayerButton = forwardRef(PlayerButtonComponent);

PlayerButton.displayName = 'PlayerButton';
