import type { HTMLAttributes, ReactNode } from 'react';

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
