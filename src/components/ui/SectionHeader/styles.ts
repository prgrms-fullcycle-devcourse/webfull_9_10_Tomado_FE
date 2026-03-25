import type { CSSProperties } from 'react';

import type { SectionHeaderType } from './types';

export const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const rootClassName = 'flex w-full items-center justify-between gap-4';

export const getRootClassName = (type: SectionHeaderType = 'main') => {
    return type === 'main' ? 'h-[60px]' : 'h-[54px]';
};

export const titleGroupClassName = 'flex min-w-0 items-center gap-2.5';

export const navigationButtonClassName =
    'inline-flex shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-neutral-darker disabled:pointer-events-none disabled:text-neutral hover:cursor-pointer';

export const titleFrameClassName = (datePicker: boolean = false) =>
    datePicker
        ? 'inline-flex min-w-0 items-center rounded-lg px-3 py-2 transition-colors hover:bg-neutral-subtle hover:cursor-pointer'
        : 'inline-flex min-w-0 items-center';

export const getTitleClassName = (type: SectionHeaderType = 'main') => {
    return type === 'main'
        ? 'truncate text-3xl leading-none font-bold text-black'
        : 'truncate text-2xl leading-none font-bold text-black';
};

export const getNavigationIconSize = (type: SectionHeaderType = 'main') => {
    return type === 'main' ? 24 : 20;
};

export const textSlotClassName = 'shrink-0 text-right text-sm leading-5 text-neutral';

export const getTextSlotStyle = (width: CSSProperties['width'] = '11rem') => {
    return { width } satisfies CSSProperties;
};

export const hiddenTextClassName = 'invisible select-none';
