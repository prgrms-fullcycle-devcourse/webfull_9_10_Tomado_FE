import { Icon } from '@@/ui/Icon';

import {
    cx,
    getNavigationIconSize,
    getRootClassName,
    getTextSlotStyle,
    getTitleClassName,
    hiddenTextClassName,
    navigationButtonClassName,
    rootClassName,
    textSlotClassName,
    titleFrameClassName,
    titleGroupClassName,
} from './styles';
import type { SectionHeaderProps } from './types';

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
