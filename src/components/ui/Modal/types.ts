import type { ChangeEventHandler, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export type ModalVariant = 'standard' | 'player' | 'menu';
export type ModalTone = 'default' | 'danger' | 'focusmode';

export type MenuModalItem = {
    label: string;
    tone?: 'default' | 'danger';
    onClick?: () => void;
    active?: boolean;
};

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    open?: boolean;
    inline?: boolean;
    variant?: ModalVariant;
    tone?: ModalTone;
    title?: ReactNode;
    description?: ReactNode;
    headerSlot?: ReactNode;
    footer?: ReactNode;
    closeButton?: boolean;
    onClose?: () => void;
    onBackdropClick?: MouseEventHandler<HTMLButtonElement>;
    menuItems?: MenuModalItem[];
    playerVolume?: number;
    onPlayerVolumeChange?: ChangeEventHandler<HTMLInputElement>;
    playerPlaying?: boolean;
    onPlayerPrevious?: () => void;
    onPlayerToggle?: () => void;
    onPlayerNext?: () => void;
}
