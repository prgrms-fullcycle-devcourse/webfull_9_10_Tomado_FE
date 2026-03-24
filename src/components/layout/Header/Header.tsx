import {
    cx,
    headerCenterClassName,
    headerClassName,
    headerInnerClassName,
    headerLeftClassName,
    headerRightClassName,
    headerSlotClassName,
    headerTrailingGroupClassName,
} from './Hedaer.styles';
import type { HeaderProps } from './types';

export const Header = ({ leftSlot, centerSlot, rightSlot, className, ...props }: HeaderProps) => {
    return (
        <header {...props} className={cx(headerClassName, className)}>
            <div className={headerInnerClassName}>
                <div className={cx(headerSlotClassName, headerLeftClassName)}>{leftSlot}</div>
                <div className={headerTrailingGroupClassName}>
                    <div className={cx(headerSlotClassName, headerCenterClassName)}>{centerSlot}</div>
                    <div className={cx(headerSlotClassName, headerRightClassName)}>{rightSlot}</div>
                </div>
            </div>
        </header>
    );
};
