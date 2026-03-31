import type { HTMLAttributes } from 'react';

export interface CenteredLayoutProps extends HTMLAttributes<HTMLDivElement> {
    maxWidth?: string;
    gap?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const centeredLayoutClassName = 'mx-auto flex w-full flex-col';

export const CenteredLayout = ({
    className,
    maxWidth = '960px',
    gap = '10px',
    style,
    ...props
}: CenteredLayoutProps) => {
    return (
        <div
            {...props}
            className={cx(centeredLayoutClassName, className)}
            style={{
                maxWidth,
                gap,
                ...style,
            }}
        />
    );
};
