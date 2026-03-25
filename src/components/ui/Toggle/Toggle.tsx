import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';

import { cx, getToggleThumbClassName, getToggleTrackClassName } from './styles';
import type { ToggleProps } from './types';

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
