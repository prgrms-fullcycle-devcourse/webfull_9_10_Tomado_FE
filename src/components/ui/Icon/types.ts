import type { CSSProperties, HTMLAttributes } from 'react';

export type IconSize = number | string;

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    name: string;
    size?: IconSize;
    color?: CSSProperties['color'];
    label?: string;
}
