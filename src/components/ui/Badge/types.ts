import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    iconName?: string;
    size?: BadgeSize;
}
