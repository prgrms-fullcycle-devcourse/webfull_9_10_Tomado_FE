import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'filled' | 'outline' | 'ghost';
export type ButtonState = 'default' | 'disabled';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    state?: ButtonState;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconOnly?: boolean;
}

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    stackOnMobile?: boolean;
}
