import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';

import { Icon } from '@/components/ui/Icon';

export type CheckBoxSize = 'sm' | 'md';

export interface CheckBoxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked?: boolean;
    defaultChecked?: boolean;
    size?: CheckBoxSize;
    ariaLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const checkboxSizeClassNames: Record<CheckBoxSize, { button: string; icon: number }> = {
    sm: {
        button: 'size-8 rounded-lg',
        icon: 18,
    },
    md: {
        button: 'size-11 rounded-xl',
        icon: 24,
    },
};

const getCheckBoxClassName = ({
    checked = false,
    size = 'md',
    disabled = false,
}: Pick<CheckBoxProps, 'checked' | 'size' | 'disabled'>) => {
    return cx(
        'inline-flex shrink-0 items-center justify-center border-2 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        checkboxSizeClassNames[size].button,
        checked ? 'border-primary bg-primary text-white' : 'border-neutral-lighter bg-white text-transparent',
        !disabled && !checked && 'hover:border-neutral',
        disabled && 'cursor-not-allowed opacity-60'
    );
};

const getCheckBoxIconSize = (size: CheckBoxSize = 'md') => checkboxSizeClassNames[size].icon;

const checkboxIconClassName = 'text-inherit';

export const CheckBox = ({
    checked,
    defaultChecked = false,
    size = 'md',
    ariaLabel,
    onCheckedChange,
    className,
    disabled = false,
    onClick,
    type = 'button',
    ...props
}: CheckBoxProps) => {
    const [localChecked, setLocalChecked] = useState(checked ?? defaultChecked);

    useEffect(() => {
        if (checked !== undefined) {
            setLocalChecked(checked);
        }
    }, [checked]);

    const isChecked = localChecked;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        const nextChecked = !isChecked;
        setLocalChecked(nextChecked);
        onCheckedChange?.(nextChecked);
    };

    return (
        <button
            {...props}
            aria-checked={isChecked}
            aria-label={ariaLabel ?? (isChecked ? 'Checked checkbox' : 'Unchecked checkbox')}
            className={cx(getCheckBoxClassName({ checked: isChecked, size, disabled }), className)}
            disabled={disabled}
            onClick={handleClick}
            role='checkbox'
            type={type}
        >
            {isChecked ? (
                <Icon className={checkboxIconClassName} color='white' name='check' size={getCheckBoxIconSize(size)} />
            ) : null}
        </button>
    );
};
