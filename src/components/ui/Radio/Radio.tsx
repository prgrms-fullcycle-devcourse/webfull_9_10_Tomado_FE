import type { ChangeEvent } from 'react';

import { cx, getRadioIndicatorClassName, getRadioWrapperClassName } from './styles';
import type { RadioProps } from './types';

export const Radio = ({
    size = 'md',
    ariaLabel,
    onCheckedChange,
    className,
    disabled = false,
    onChange,
    ...props
}: RadioProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);

        if (event.defaultPrevented) {
            return;
        }

        onCheckedChange?.(event.target.checked);
    };

    return (
        <label className={cx(getRadioWrapperClassName({ disabled }), className)}>
            <input
                {...props}
                aria-label={ariaLabel}
                className='peer sr-only'
                disabled={disabled}
                onChange={handleChange}
                type='radio'
            />
            <span aria-hidden='true' className={getRadioIndicatorClassName({ size, disabled })} />
        </label>
    );
};
