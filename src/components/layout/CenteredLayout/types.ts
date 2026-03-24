import type { HTMLAttributes } from 'react';

export interface CenteredLayoutProps extends HTMLAttributes<HTMLDivElement> {
    maxWidth?: string;
    gap?: string;
}
