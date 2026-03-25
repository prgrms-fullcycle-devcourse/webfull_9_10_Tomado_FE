import type { HTMLAttributes, ReactNode } from 'react';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    label: ReactNode;
    icon?: boolean;
    textButton?: boolean;
    textButtonLabel?: ReactNode;
    onTextButtonClick?: () => void;
}
