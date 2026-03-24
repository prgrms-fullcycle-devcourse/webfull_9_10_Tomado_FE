import { sidebarContentLayoutClassName, cx } from './styles';
import type { SidebarContentLayoutProps } from './types';

export const SidebarContentLayout = ({
    className,
    sidebarWidth = '320px',
    gap = '24px',
    style,
    ...props
}: SidebarContentLayoutProps) => {
    return (
        <div
            {...props}
            className={cx(sidebarContentLayoutClassName, className)}
            style={{
                gap,
                gridTemplateColumns: `minmax(0, ${sidebarWidth}) minmax(0, 1fr)`,
                ...style,
            }}
        />
    );
};
