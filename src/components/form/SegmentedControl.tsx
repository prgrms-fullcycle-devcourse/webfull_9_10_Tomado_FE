import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export interface SegmentedControlOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}

export interface SegmentedControlProps extends HTMLAttributes<HTMLDivElement> {
    options: SegmentedControlOption[];
    value?: string;
    defaultValue?: string;
    size?: SegmentedControlSize;
    ariaLabel?: string;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const segmentedControlSizeClassNames: Record<SegmentedControlSize, { root: string; segment: string; label: string }> = {
    sm: {
        root: 'min-h-10 rounded-lg p-1.5',
        segment: 'rounded-md px-4',
        label: 'text-sm leading-none',
    },
    md: {
        root: 'min-h-14 rounded-xl p-1.5',
        segment: 'rounded-lg px-4',
        label: 'text-base leading-none',
    },
    lg: {
        root: 'min-h-18 rounded-2xl p-2',
        segment: 'rounded-xl px-6',
        label: 'text-xl leading-none',
    },
};

const getSegmentedControlClassName = ({
    size = 'lg',
    disabled = false,
}: Pick<SegmentedControlProps, 'size' | 'disabled'>) => {
    return cx(
        'inline-grid w-full items-stretch gap-1 bg-neutral-lighter',
        segmentedControlSizeClassNames[size].root,
        disabled && 'cursor-not-allowed opacity-80'
    );
};

const getSegmentButtonClassName = ({
    size = 'lg',
    selected = false,
    disabled = false,
}: Pick<SegmentedControlProps, 'size' | 'disabled'> & { selected?: boolean }) => {
    return cx(
        'inline-flex w-full items-center justify-center whitespace-nowrap text-neutral-darker transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        segmentedControlSizeClassNames[size].segment,
        segmentedControlSizeClassNames[size].label,
        selected ? 'bg-white font-bold shadow-sm' : 'bg-transparent font-normal',
        !disabled && 'hover:cursor-pointer',
        !disabled && !selected && 'hover:bg-white hover:font-bold',
        disabled && 'cursor-not-allowed text-neutral'
    );
};

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
            aria-disabled={disabled}
            aria-label={ariaLabel}
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
