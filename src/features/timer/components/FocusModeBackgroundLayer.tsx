import { memo } from 'react';

const cx = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface FocusModeBackgroundLayerProps {
    backgroundSources: string[];
    backgroundSlideClassNames: string[];
}

export const FocusModeBackgroundLayer = memo(
    ({ backgroundSources, backgroundSlideClassNames }: FocusModeBackgroundLayerProps) => {
        return (
            <>
                <div className='absolute inset-0 z-0 overflow-hidden'>
                    {backgroundSources.map((src, index) => (
                        <img
                            key={src}
                            alt=''
                            className={cx(
                                'absolute top-0 -left-px h-full w-[calc(100%+2px)] max-w-none object-cover transition-transform duration-500 ease-in-out will-change-transform',
                                backgroundSlideClassNames[index]
                            )}
                            src={src}
                        />
                    ))}
                </div>
                {/* 살짝 어둡게 하려면 투명도 조절 필요 */}
                <div className='absolute inset-0 z-10 bg-black/10' />
            </>
        );
    }
);
