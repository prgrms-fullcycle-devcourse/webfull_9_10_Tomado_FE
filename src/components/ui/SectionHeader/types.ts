import type { CSSProperties, HTMLAttributes, MouseEventHandler } from 'react';

export type SectionHeaderType = 'main' | 'sub';

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    type?: SectionHeaderType;
    datePicker?: boolean;
    text?: string;
    showText?: boolean;
    textSlotWidth?: CSSProperties['width'];
    onPreviousClick?: MouseEventHandler<HTMLButtonElement>;
    onNextClick?: MouseEventHandler<HTMLButtonElement>;
    previousDisabled?: boolean;
    nextDisabled?: boolean;
}
