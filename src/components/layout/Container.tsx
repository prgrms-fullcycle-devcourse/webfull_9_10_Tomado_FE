import { createElement } from 'react';
import type { HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    as?: 'div' | 'section' | 'main';
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const containerClassName = 'mx-auto w-full px-5';
const containerInnerClassName =
    'mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-[1200px] flex-col gap-2.5 pt-5 pb-15';

export const Container = ({ as = 'div', className, children, ...props }: ContainerProps) => {
    return createElement(as, {
        ...props,
        className: cx(containerClassName, className),
        children: <div className={containerInnerClassName}>{children}</div>,
    });
};
