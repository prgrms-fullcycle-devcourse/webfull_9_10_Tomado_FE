import { createElement } from 'react';

import { containerClassName, containerInnerClassName, cx } from './styles';
import type { ContainerProps } from './types';

export const Container = ({ as = 'div', className, children, ...props }: ContainerProps) => {
    return createElement(as, {
        ...props,
        className: cx(containerClassName, className),
        children: <div className={containerInnerClassName}>{children}</div>,
    });
};
