import type { ButtonHTMLAttributes } from 'react';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked?: boolean;
    defaultChecked?: boolean;
    size?: ToggleSize;
    ariaLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
}
