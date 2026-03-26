import type { CSSProperties } from 'react';

import type { IconSize } from './types';

const DEFAULT_ICON_SIZE = 24;

const fixedColorIconNames = new Set(['avatar', 'pomodoro', 'fire']);

const toCssLength = (size: IconSize = DEFAULT_ICON_SIZE) => {
    return typeof size === 'number' ? `${size}px` : size;
};

const resolveIconColor = (color?: CSSProperties['color']) => {
    if (!color) {
        return 'currentColor';
    }

    if (
        color === 'currentColor' ||
        color.startsWith('var(') ||
        color.startsWith('#') ||
        color.startsWith('rgb') ||
        color.startsWith('hsl')
    ) {
        return color;
    }

    return `var(--${color})`;
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

export const getIconSvgStyle = (color?: CSSProperties['color']) => {
    if (!color) {
        return undefined;
    }

    return {
        color: resolveIconColor(color),
    } satisfies CSSProperties;
};

export const getFixedIconStyle = (size?: IconSize) => {
    return getIconWrapperStyle(size);
};

export const isFixedColorIcon = (name: string) => {
    return fixedColorIconNames.has(name);
};
