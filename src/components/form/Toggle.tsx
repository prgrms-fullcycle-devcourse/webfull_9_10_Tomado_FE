import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked?: boolean;
    defaultChecked?: boolean;
    size?: ToggleSize;
    ariaLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const toggleSizeClassNames: Record<ToggleSize, { track: string; thumb: string; checkedOffset: string }> = {
    sm: {
        track: 'h-9 w-16 p-1',
        thumb: 'size-7',
        checkedOffset: 'translate-x-7',
    },
    md: {
        track: 'h-14 w-28 p-1.5',
        thumb: 'size-11',
        checkedOffset: 'translate-x-13',
    },
};

const getToggleTrackClassName = ({
    checked = false,
    size = 'md',
    disabled = false,
}: Pick<ToggleProps, 'checked' | 'size' | 'disabled'>) => {
    return cx(
        'inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        toggleSizeClassNames[size].track,
        checked ? 'bg-primary' : 'bg-neutral-lighter',
        !disabled && !checked && 'hover:bg-neutral',
        !disabled && checked && 'hover:bg-primary-darker',
        disabled && 'cursor-not-allowed opacity-60'
    );
};

const getToggleThumbClassName = ({ checked = false, size = 'md' }: Pick<ToggleProps, 'checked' | 'size'>) => {
    return cx(
        'block rounded-full bg-white shadow-[0_6px_18px_rgba(13,17,23,0.12)] transition-transform duration-200 ease-out',
        toggleSizeClassNames[size].thumb,
        checked ? toggleSizeClassNames[size].checkedOffset : 'translate-x-0'
    );
};

export const Toggle = ({
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
            className={cx(getToggleTrackClassName({ checked: isChecked, size, disabled }), className)}
            disabled={disabled}
            onClick={handleClick}
            role='switch'
            type={type}
        >
            <span className={getToggleThumbClassName({ checked: isChecked, size })} />
        </button>
    );
};
