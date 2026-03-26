import type { CSSProperties, HTMLAttributes, MouseEventHandler } from 'react';

import { Icon } from '@@/ui';

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

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const rootClassName = 'flex w-full items-center justify-between gap-4';
const titleGroupClassName = 'flex min-w-0 items-center gap-2.5';
const textSlotClassName = 'shrink-0 text-right text-sm leading-5 text-neutral';
const hiddenTextClassName = 'invisible select-none';

const getRootClassName = (type: SectionHeaderType = 'main') => {
    return type === 'main' ? 'h-[60px]' : 'h-[54px]';
};

const navigationButtonClassName =
    'inline-flex shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-neutral-darker disabled:pointer-events-none disabled:text-neutral hover:cursor-pointer';

const titleFrameClassName = (datePicker: boolean = false) => {
    return datePicker
        ? 'inline-flex min-w-0 items-center rounded-lg px-3 py-2 transition-colors hover:bg-neutral-subtle hover:cursor-pointer'
        : 'inline-flex min-w-0 items-center';
};

const getTitleClassName = (type: SectionHeaderType = 'main') => {
    return type === 'main'
        ? 'truncate text-3xl leading-none font-bold text-black'
        : 'truncate text-2xl leading-none font-bold text-black';
};

const getNavigationIconSize = (type: SectionHeaderType = 'main') => {
    return type === 'main' ? 24 : 20;
};

const getTextSlotStyle = (width: CSSProperties['width'] = '11rem') => {
    return { width } satisfies CSSProperties;
};

export const SectionHeader = ({
    title,
    type = 'main',
    datePicker = false,
    text,
    showText = false,
    textSlotWidth = '11rem',
    onPreviousClick,
    onNextClick,
    previousDisabled = false,
    nextDisabled = false,
    className,
    ...props
}: SectionHeaderProps) => {
    const shouldRenderTextSlot = text !== undefined;
    const navigationIconSize = getNavigationIconSize(type);

    return (
        <div {...props} className={cx(rootClassName, getRootClassName(type), className)}>
            <div className={titleGroupClassName}>
                {datePicker ? (
                    <button
                        aria-label='이전으로 이동'
                        className={navigationButtonClassName}
                        disabled={previousDisabled}
                        onClick={onPreviousClick}
                        type='button'
                    >
                        <Icon name='arrow_left' size={navigationIconSize} />
                    </button>
                ) : null}

                <div className={titleFrameClassName(datePicker)}>
                    <p className={getTitleClassName(type)}>{title}</p>
                </div>

                {datePicker ? (
                    <button
                        aria-label='다음으로 이동'
                        className={navigationButtonClassName}
                        disabled={nextDisabled}
                        onClick={onNextClick}
                        type='button'
                    >
                        <Icon name='arrow_right' size={navigationIconSize} />
                    </button>
                ) : null}
            </div>

            {shouldRenderTextSlot ? (
                <div className={textSlotClassName} style={getTextSlotStyle(textSlotWidth)}>
                    <span className={showText ? undefined : hiddenTextClassName}>{text}</span>
                </div>
            ) : null}
        </div>
    );
};
