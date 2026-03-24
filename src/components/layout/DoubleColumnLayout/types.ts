import type { HTMLAttributes } from 'react';

export interface TwoColumnLayoutProps extends HTMLAttributes<HTMLDivElement> {
    minColumnWidth?: string;
    gap?: string;
}
