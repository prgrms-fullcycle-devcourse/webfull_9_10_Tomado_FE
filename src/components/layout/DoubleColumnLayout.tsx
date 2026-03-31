import type { HTMLAttributes } from 'react';

export interface DoubleColumnLayoutProps extends HTMLAttributes<HTMLDivElement> {}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const doubleColumnLayoutClassName = 'grid w-full gap-2.5 md:grid-cols-2';

export const DoubleColumnLayout = ({ className, ...props }: DoubleColumnLayoutProps) => {
    return <div {...props} className={cx(doubleColumnLayoutClassName, className)} />;
};
