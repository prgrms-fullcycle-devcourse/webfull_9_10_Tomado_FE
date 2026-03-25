import type { HTMLAttributes, ReactNode } from 'react';

export type TagSize = 'sm' | 'md';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    iconName?: string;
    size?: TagSize;
}
