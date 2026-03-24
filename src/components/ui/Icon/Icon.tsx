import { forwardRef } from 'react';

import { getFixedIconStyle, getIconSvgStyle, isFixedColorIcon } from './styles';
import type { IconProps } from './types';

const iconAssetModules = import.meta.glob('./*.svg', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

const iconSrcMap = Object.fromEntries(
    Object.entries(iconAssetModules).map(([path, src]) => {
        const fileName = path.split('/').pop() ?? '';
        const name = fileName.replace(/\.svg$/i, '');
        return [name, src];
    })
);

type SvgNode = {
    d: string;
    type?: 'fill' | 'stroke';
    strokeWidth?: number;
    strokeLinecap?: 'round' | 'square' | 'butt';
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
};

type SvgDefinition = {
    viewBox: string;
    paths: SvgNode[];
};

const svgDefinitions: Record<string, SvgDefinition> = {
    arrow_up_right: {
        viewBox: '0 0 20 20',
        paths: [
            {
                d: 'M6.25 13.75L13.75 6.25M8.75 6.25H13.75V11.25',
                type: 'stroke',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
            },
        ],
    },
    fullscreen_close: {
        viewBox: '0 0 24 24',
        paths: [
            {
                d: 'M21.29 4.11997L16.7 8.70997L18.29 10.3C18.92 10.93 18.47 12.01 17.58 12.01H13C12.45 12.01 12 11.56 12 11.01V6.40997C12 5.51997 13.08 5.06997 13.71 5.69997L15.3 7.28997L19.89 2.69997C20.28 2.30997 20.91 2.30997 21.3 2.69997C21.68 3.09997 21.68 3.72997 21.29 4.11997ZM4.11997 21.29L8.70997 16.7L10.3 18.29C10.93 18.92 12.01 18.47 12.01 17.58V13C12.01 12.45 11.56 12 11.01 12H6.40997C5.51997 12 5.06997 13.08 5.69997 13.71L7.28997 15.3L2.69997 19.89C2.30997 20.28 2.30997 20.91 2.69997 21.3C3.09997 21.68 3.72997 21.68 4.11997 21.29Z',
            },
        ],
    },
    fullscreen_open: {
        viewBox: '0 0 24 24',
        paths: [
            {
                d: 'M21 8.59V4C21 3.45 20.55 3 20 3H15.41C14.52 3 14.07 4.08 14.7 4.71L16.29 6.3L6.29 16.3L4.7 14.71C4.08 14.08 3 14.52 3 15.41V20C3 20.55 3.45 21 4 21H8.59C9.48 21 9.93 19.92 9.3 19.29L7.71 17.7L17.71 7.7L19.3 9.29C19.92 9.92 21 9.48 21 8.59Z',
            },
        ],
    },
    music_on: {
        viewBox: '0 0 24 24',
        paths: [
            {
                d: 'M12 5V13.55C11.06 13.01 9.89997 12.8 8.66997 13.23C7.32997 13.71 6.29997 14.9 6.05997 16.3C5.59997 19.04 7.91997 21.38 10.65 20.95C12.61 20.64 14 18.84 14 16.85V7H16C17.1 7 18 6.1 18 5C18 3.9 17.1 3 16 3H14C12.9 3 12 3.9 12 5Z',
            },
        ],
    },
    play: {
        viewBox: '0 0 24 24',
        paths: [
            {
                d: 'M8 6.82001V17.18C8 17.97 8.87 18.45 9.54 18.02L17.68 12.84C18.3 12.45 18.3 11.55 17.68 11.15L9.54 5.98001C8.87 5.55001 8 6.03001 8 6.82001Z',
            },
        ],
    },
};

export const availableIconNames = Object.keys(iconSrcMap).sort();

const renderSvgIcon = (name: string) => {
    const definition = svgDefinitions[name];

    if (!definition) {
        return null;
    }

    return (
        <svg
            aria-hidden='true'
            className='block size-full'
            fill='none'
            viewBox={definition.viewBox}
            xmlns='http://www.w3.org/2000/svg'
        >
            {definition.paths.map((path, index) => {
                if (path.type === 'stroke') {
                    return (
                        <path
                            key={`${name}-${index}`}
                            d={path.d}
                            stroke='currentColor'
                            strokeLinecap={path.strokeLinecap}
                            strokeLinejoin={path.strokeLinejoin}
                            strokeWidth={path.strokeWidth ?? 1.5}
                        />
                    );
                }

                return <path key={`${name}-${index}`} d={path.d} fill='currentColor' />;
            })}
        </svg>
    );
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
    ({ name, size = 24, color, className, label, ...props }, ref) => {
        const assetSrc = iconSrcMap[name];
        const vectorIcon = renderSvgIcon(name);

        if (!assetSrc && !vectorIcon) {
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

        if (vectorIcon) {
            return (
                <span {...sharedProps} style={{ ...getFixedIconStyle(size), ...getIconSvgStyle(color) }}>
                    {vectorIcon}
                </span>
            );
        }

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
);

Icon.displayName = 'Icon';
