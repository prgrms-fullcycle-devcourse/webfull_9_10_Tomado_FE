import type { HTMLAttributes, ReactNode } from 'react';

export interface HeaderNavItem {
    label: string;
    href?: string;
    active?: boolean;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
    leftSlot?: ReactNode;
    centerSlot?: ReactNode;
    rightSlot?: ReactNode;
}

export interface GuestHeaderProps extends HTMLAttributes<HTMLElement> {
    signupHref?: string;
    loginHref?: string;
    brandHref?: string;
}

export interface DefaultHeaderProps extends HTMLAttributes<HTMLElement> {
    navItems?: HeaderNavItem[];
    utilitySlot?: ReactNode;
    profileSlot?: ReactNode;
    avatarSrc?: string;
}
