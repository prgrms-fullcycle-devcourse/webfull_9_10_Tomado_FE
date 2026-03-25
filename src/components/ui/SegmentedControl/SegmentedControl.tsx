import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { cx, getSegmentButtonClassName, getSegmentedControlClassName } from './styles';
import type { SegmentedControlOption, SegmentedControlProps } from './types';

const getInitialValue = (options: SegmentedControlOption[], value?: string, defaultValue?: string) => {
    return value ?? defaultValue ?? options.find((option) => !option.disabled)?.value;
};

export const SegmentedControl = ({
    options,
    value,
    defaultValue,
    size = 'lg',
    ariaLabel = 'Segmented control',
    onValueChange,
    className,
    style,
    disabled = false,
    ...props
}: SegmentedControlProps) => {
    const [localValue, setLocalValue] = useState(() => getInitialValue(options, value, defaultValue));
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

    useEffect(() => {
        if (value !== undefined) {
            setLocalValue(value);
        }
    }, [value]);

    useEffect(() => {
        const hasSelectedOption = options.some((option) => option.value === localValue && !option.disabled);

        if (hasSelectedOption) {
            return;
        }

        const nextValue = getInitialValue(options, value, defaultValue);

        if (nextValue !== undefined && nextValue !== localValue) {
            setLocalValue(nextValue);
        }
    }, [defaultValue, localValue, options, value]);

    const selectValue = (nextValue: string) => {
        setLocalValue(nextValue);
        onValueChange?.(nextValue);
    };

    const focusOption = (index: number) => {
        buttonRefs.current[index]?.focus();
    };

    const getEnabledIndex = (startIndex: number, direction: 1 | -1) => {
        if (!options.length || disabled) {
            return -1;
        }

        let currentIndex = startIndex;

        for (let step = 0; step < options.length; step += 1) {
            currentIndex = (currentIndex + direction + options.length) % options.length;

            if (!options[currentIndex]?.disabled) {
                return currentIndex;
            }
        }

        return -1;
    };

    const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!options.length || disabled) {
            return;
        }

        let nextIndex = -1;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = getEnabledIndex(index, 1);
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = getEnabledIndex(index, -1);
        }

        if (event.key === 'Home') {
            nextIndex = options.findIndex((option) => !option.disabled);
        }

        if (event.key === 'End') {
            nextIndex = options.findLastIndex((option) => !option.disabled);
        }

        if (nextIndex < 0) {
            return;
        }

        event.preventDefault();
        selectValue(options[nextIndex].value);
        focusOption(nextIndex);
    };

    return (
        <div
            {...props}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            className={cx(getSegmentedControlClassName({ size, disabled }), className)}
            role='radiogroup'
            style={{
                ...style,
                gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
            }}
        >
            {options.map((option, index) => {
                const isSelected = option.value === localValue;
                const isDisabled = disabled || option.disabled;

                return (
                    <button
                        key={option.value}
                        ref={(element) => {
                            buttonRefs.current[index] = element;
                        }}
                        aria-checked={isSelected}
                        className={getSegmentButtonClassName({
                            size,
                            selected: isSelected,
                            disabled: isDisabled,
                        })}
                        disabled={isDisabled}
                        onClick={() => selectValue(option.value)}
                        onKeyDown={handleKeyDown(index)}
                        role='radio'
                        type='button'
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
