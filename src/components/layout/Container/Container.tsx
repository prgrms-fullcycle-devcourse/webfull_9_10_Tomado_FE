import { createElement } from 'react';

import { containerClassName, cx } from './styles';
import type { ContainerProps } from './types';

export const Container = ({ as = 'div', className, ...props }: ContainerProps) => {
    return createElement(as, {
        ...props,
        className: cx(containerClassName, className),
    });
};
