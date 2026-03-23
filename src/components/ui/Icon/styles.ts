import type { CSSProperties } from 'react';

import type { IconSize } from './types';

const DEFAULT_ICON_SIZE = 24;

const fixedColorIconNames = new Set(['Avatar']);

const toCssLength = (size: IconSize = DEFAULT_ICON_SIZE) => {
    return typeof size === 'number' ? `${size}px` : size;
};

export const getIconWrapperStyle = (size?: IconSize): CSSProperties => {
    const length = toCssLength(size);

    return {
        width: length,
        height: length,
        flexShrink: 0,
        display: 'inline-block',
    };
};

export const getMaskIconStyle = (src: string, size?: IconSize, color?: CSSProperties['color']) => {
    return {
        ...getIconWrapperStyle(size),
        backgroundColor: color ?? 'currentColor',
        maskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
    } satisfies CSSProperties;
};

export const getFixedIconStyle = (size?: IconSize) => {
    return getIconWrapperStyle(size);
};

export const isFixedColorIcon = (name: string) => {
    return fixedColorIconNames.has(name);
};
