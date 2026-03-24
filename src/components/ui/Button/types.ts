import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type ButtonKind = 'standard' | 'player';
export type ButtonVariant = 'filled' | 'outline' | 'ghost';
export type ButtonState = 'default' | 'hover' | 'disabled';
export type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    kind?: ButtonKind;
    variant?: ButtonVariant;
    state?: ButtonState;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconOnly?: boolean;
}

// INFO: mobile에서 세로 배치 여부를 결정합니다.
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    stackOnMobile?: boolean;
}
