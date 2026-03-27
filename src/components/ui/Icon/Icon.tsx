import { forwardRef } from 'react';
import type { ComponentType, SVGProps } from 'react';

import { getFixedIconStyle, getIconSvgStyle, isFixedColorIcon } from './styles';
import type { IconProps } from './types';

const iconAssetModules = import.meta.glob('./*.svg', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

const iconComponentModules = import.meta.glob('./*.svg', {
    eager: true,
    query: '?react',
    import: 'default',
}) as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

const iconSrcMap = Object.fromEntries(
    Object.entries(iconAssetModules).map(([path, src]) => {
        const fileName = path.split('/').pop() ?? '';
        const name = fileName.replace(/\.svg$/i, '');
        return [name, src];
    })
);

const iconComponentMap = Object.fromEntries(
    Object.entries(iconComponentModules).map(([path, component]) => {
        const fileName = path.split('/').pop() ?? '';
        const name = fileName.replace(/\.svg$/i, '');
        return [name, component];
    })
);

export const availableIconNames = Object.keys(iconSrcMap).sort();

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
    ({ name, size = 24, color, className, label, ...props }, ref) => {
        const SvgComponent = iconComponentMap[name];
        const assetSrc = iconSrcMap[name];
        const wrapperStyle = getFixedIconStyle(size);
        const svgColorStyle = getIconSvgStyle(color);

        if (!SvgComponent && !assetSrc) {
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

        if (isFixedColorIcon(name) && assetSrc) {
            return (
                <span {...sharedProps} style={getFixedIconStyle(size)}>
                    <img
                        alt=''
                        aria-hidden='true'
                        className='block size-full object-contain'
                        draggable={false}
                        src={assetSrc}
                    />
                </span>
            );
        }

        if (!SvgComponent) {
            return null;
        }

        return (
            <span {...sharedProps} style={svgColorStyle ? { ...wrapperStyle, ...svgColorStyle } : wrapperStyle}>
                <SvgComponent
                    aria-hidden='true'
                    className='block'
                    focusable='false'
                    height='100%'
                    preserveAspectRatio='xMidYMid meet'
                    width='100%'
                />
            </span>
        );
    }
);

Icon.displayName = 'Icon';
