import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked?: boolean;
    defaultChecked?: boolean;
    ariaLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const getToggleTrackClassName = ({ checked = false, disabled = false }: Pick<ToggleProps, 'checked' | 'disabled'>) => {
    return cx(
        'inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        'h-6 w-12 p-1',
        checked ? 'bg-primary' : 'bg-neutral-lighter',
        !disabled && !checked && 'hover:bg-neutral hover:cursor-pointer',
        !disabled && checked && 'hover:bg-primary-darker hover:cursor-pointer',
        disabled && 'cursor-not-allowed opacity-60'
    );
};

const getToggleThumbClassName = ({ checked = false }: Pick<ToggleProps, 'checked'>) => {
    return cx(
        'block rounded-full bg-white shadow-[0_6px_18px_rgba(13,17,23,0.12)] transition-transform duration-200 ease-out',
        'size-5',
        checked ? 'translate-x-[22px]' : 'translate-x-[-2px]'
    );
};

export const Toggle = ({
    checked,
    defaultChecked = false,
    ariaLabel,
    onCheckedChange,
    className,
    disabled = false,
    onClick,
    type = 'button',
    ...props
}: ToggleProps) => {
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
            aria-label={ariaLabel ?? (isChecked ? 'Enabled toggle' : 'Disabled toggle')}
            className={cx(getToggleTrackClassName({ checked: isChecked, disabled }), className)}
            disabled={disabled}
            onClick={handleClick}
            role='switch'
            type={type}
        >
            <span className={getToggleThumbClassName({ checked: isChecked })} />
        </button>
    );
};
