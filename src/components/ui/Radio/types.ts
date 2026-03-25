import type { InputHTMLAttributes } from 'react';

export type RadioSize = 'sm' | 'md';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    name: string;
    value: string;
    checked?: boolean;
    defaultChecked?: boolean;
    size?: RadioSize;
    ariaLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
}
