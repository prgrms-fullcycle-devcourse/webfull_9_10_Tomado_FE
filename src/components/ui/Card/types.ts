import type { ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler } from 'react';

export type DailyLogCardState = 'default' | 'selected' | 'hover';
export type RetroCardState = DailyLogCardState | 'empty';
export type RetroCategoryTone = 'danger' | 'warning' | 'info' | 'success';

export interface CardActionProps {
    deleteLabel?: string;
    deleteButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    onDeleteClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface DailyLogCardProps extends HTMLAttributes<HTMLDivElement>, CardActionProps {
    title: string;
    dateLabel: string;
    state?: DailyLogCardState;
}

export interface RetroCategoryItem {
    label: string;
    iconName: string;
    tone: RetroCategoryTone;
}

export interface RetroCardProps extends HTMLAttributes<HTMLDivElement>, CardActionProps {
    date?: string;
    categories?: RetroCategoryItem[];
    state?: RetroCardState;
    emptyText?: string;
}
