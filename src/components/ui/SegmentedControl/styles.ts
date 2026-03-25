import type { SegmentedControlProps, SegmentedControlSize } from './types';

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

export const getSegmentedControlClassName = ({
    size = 'lg',
    disabled = false,
}: Pick<SegmentedControlProps, 'size' | 'disabled'>) => {
    return cx(
        'inline-grid w-full items-stretch gap-1 bg-neutral-lighter',
        segmentedControlSizeClassNames[size].root,
        disabled && 'cursor-not-allowed opacity-80'
    );
};

export const getSegmentButtonClassName = ({
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

export { cx };
