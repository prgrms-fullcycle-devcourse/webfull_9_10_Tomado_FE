import type { HTMLAttributes } from 'react';

export interface SidebarContentLayoutProps extends HTMLAttributes<HTMLDivElement> {
    sidebarWidth?: string;
    gap?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const sidebarContentLayoutClassName = 'grid w-full items-start';

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
