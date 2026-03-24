import { forwardRef } from 'react';

import { getFixedIconStyle, getMaskIconStyle, getIconWrapperStyle, isFixedColorIcon } from './styles';
import type { IconProps } from './types';

const iconModules = import.meta.glob('./*.svg', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

const iconAssetMap = Object.fromEntries(
    Object.entries(iconModules).map(([path, src]) => {
        const fileName = path.split('/').pop() ?? '';
        const name = fileName.replace(/\.svg$/i, '');
        return [name, src];
    })
);

export const availableIconNames = Object.keys(iconAssetMap).sort();

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
    ({ name, size = 24, color, className, label, ...props }, ref) => {
        const src = iconAssetMap[name];

        if (!src) {
            if (import.meta.env.DEV) {
                console.warn(`[Icon] Unknown icon name: ${name}`);
            }

            return null;
        }

        const sharedProps = {
            ...props,
            ref,
            className,
            role: label ? 'img' : undefined,
            'aria-label': label,
            'aria-hidden': label ? undefined : true,
        };

        if (isFixedColorIcon(name)) {
            return (
                <span {...sharedProps} style={getFixedIconStyle(size)}>
                    <img
                        alt=''
                        aria-hidden='true'
                        className='block size-full object-contain'
                        draggable={false}
                        src={src}
                    />
                </span>
            );
        }

        return <span {...sharedProps} style={getMaskIconStyle(src, size, color)} />;
    }
);

Icon.displayName = 'Icon';

export { getIconWrapperStyle };
