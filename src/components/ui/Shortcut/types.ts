import type { HTMLAttributes, ReactNode } from 'react';

export type ShortcutSize = 'sm' | 'md';

export interface ShortcutProps extends HTMLAttributes<HTMLDivElement> {
    keys: ReactNode[];
    size?: ShortcutSize;
}
