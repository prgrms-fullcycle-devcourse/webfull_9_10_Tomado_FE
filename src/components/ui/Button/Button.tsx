import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { Icon } from '@/components/ui/Icon';

import { buttonGroupClassName, cx, getButtonClassName, getButtonContentClassName, getButtonIconSize } from './styles';
import type { ButtonGroupProps, ButtonProps } from './types';

// INFO: 커스텀 icon이 있으면 우선 사용하고, 없으면 kind에 맞는 기본 아이콘을 렌더링합니다.
const renderButtonIcon = (props: ButtonProps) => {
    const iconSize = getButtonIconSize(props);

    if (props.icon) {
        return (
            <span className='inline-flex shrink-0' style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
                {props.icon}
            </span>
        );
    }

    if (props.kind === 'player') {
        return <Icon name='play' size={iconSize} />;
    }

    return <Icon name='arrow_up_right' size={iconSize} />;
};

// INFO: Button의 공개 props를 받아 실제 button DOM으로 렌더링하는 본체입니다.
const ButtonComponent = (
    {
        kind = 'standard',
        variant = 'filled',
        size = 'lg',
        fullWidth = false,
        iconOnly = false,
        icon,
        children,
        className,
        type = 'button',
        disabled = false,
        ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
) => {
    // INFO: player, iconOnly, 커스텀 icon 전달 시에는 시각적으로 아이콘이 노출됩니다.
    const hasVisualIcon = kind === 'player' || iconOnly || Boolean(icon);

    return (
        <button
            {...props}
            ref={ref}
            className={cx(
                getButtonClassName({
                    kind,
                    variant,
                    size,
                    fullWidth,
                    iconOnly,
                }),
                className
            )}
            disabled={disabled}
            type={type}
        >
            <span className={getButtonContentClassName({ kind, size, iconOnly })}>
                {hasVisualIcon ? renderButtonIcon({ kind, variant, size, iconOnly, icon }) : null}
                {/* INFO: player와 iconOnly는 텍스트를 시각적으로 숨기되 접근성용 이름은 유지합니다. */}
                {kind === 'player' ? (
                    <span className='sr-only'>{children ?? 'Play'}</span>
                ) : iconOnly ? (
                    <span className='sr-only'>{children ?? 'Button action'}</span>
                ) : (
                    children
                )}
            </span>
        </button>
    );
};

// INFO: 부모가 버튼 DOM에 직접 접근할 수 있도록 ref를 전달합니다.
export const Button = forwardRef(ButtonComponent);

Button.displayName = 'Button';

// INFO: 버튼들을 그룹으로 배치하는 wrapper이며, 모바일 세로 스택 여부를 제어합니다.
export const ButtonGroup = ({ className, stackOnMobile = true, ...props }: ButtonGroupProps) => {
    return (
        <div
            {...props}
            className={cx(
                'flex w-full items-stretch gap-4',
                stackOnMobile ? 'max-sm:flex-col sm:[&>*]:flex-1' : '[&>*]:flex-1',
                buttonGroupClassName,
                className
            )}
        />
    );
};
