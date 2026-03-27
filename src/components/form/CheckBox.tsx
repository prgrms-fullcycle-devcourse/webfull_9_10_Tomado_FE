import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';

import { Icon } from '@@/ui';

export interface CheckBoxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked?: boolean;
    defaultChecked?: boolean;
    size?: number;
    ariaLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const getCheckBoxClassName = ({ disabled = false }: Pick<CheckBoxProps, 'disabled'>) => {
    return cx(
        'inline-flex shrink-0 items-center w-7 h-7 justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        !disabled && 'hover:cursor-pointer hover:opacity-80',
        disabled && 'cursor-not-allowed opacity-60'
    );
};

const checkboxIconClassName = 'text-inherit';

export const CheckBox = ({
    checked,
    defaultChecked = false,
    size = 24,
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
            className={cx(getCheckBoxClassName({ disabled }), className)}
            disabled={disabled}
            onClick={handleClick}
            role='checkbox'
            style={{ width: size, height: size }}
            type={type}
        >
            <Icon className={checkboxIconClassName} name={isChecked ? 'unchecked' : 'checked'} size={size} />
        </button>
    );
};
