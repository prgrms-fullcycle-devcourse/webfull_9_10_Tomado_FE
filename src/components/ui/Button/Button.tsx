import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

import {
    buttonGroupClassName,
    cx,
    getButtonClassName,
    getButtonContentClassName,
    getButtonIconClassName,
} from './styles';
import type { ButtonGroupProps, ButtonProps } from './types';

// INFO: 커스텀 icon이 있으면 렌더링하고, iconOnly일 때도 접근성 텍스트는 유지합니다.
const renderButtonIcon = ({ icon, size = 'md' }: Pick<ButtonProps, 'icon' | 'size'>) => {
    if (!icon) {
        return null;
    }

    return <span className={cx('inline-flex shrink-0', getButtonIconClassName({ size }))}>{icon}</span>;
};

// INFO: Button의 공개 props를 받아 실제 button DOM으로 렌더링하는 본체입니다.
const ButtonComponent = (
    {
        variant = 'filled',
        state = 'default',
        size = 'md',
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
    const isDisabled = disabled || state === 'disabled';

    return (
        <button
            {...props}
            ref={ref}
            className={cx(
                getButtonClassName({
                    variant,
                    state: isDisabled ? 'disabled' : state,
                    size,
                    fullWidth,
                    iconOnly,
                }),
                className
            )}
            disabled={isDisabled}
            type={type}
        >
            {icon && !iconOnly ? renderButtonIcon({ icon, size }) : null}
            <span className={getButtonContentClassName({ iconOnly })}>
                {children ?? (iconOnly ? 'Button action' : null)}
            </span>
            {icon && iconOnly ? renderButtonIcon({ icon, size }) : null}
        </button>
    );
};

// INFO: 부모가 버튼 DOM에 직접 접근할 수 있도록 ref를 전달합니다.
export const Button = forwardRef(ButtonComponent);

Button.displayName = 'Button';

// INFO: 버튼들을 그룹으로 배치하는 wrapper이며, 모바일 세로 스택 여부를 제어합니다.
export const ButtonGroup = ({ className, stackOnMobile = true, ...props }: ButtonGroupProps) => {
    return <div {...props} className={cx(buttonGroupClassName, stackOnMobile && 'max-sm:flex-col', className)} />;
};
