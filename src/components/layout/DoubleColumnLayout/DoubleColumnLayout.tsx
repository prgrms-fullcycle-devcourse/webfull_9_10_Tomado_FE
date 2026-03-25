import { doubleColumnLayoutClassName, cx } from './styles';
import type { DoubleColumnLayoutProps } from './types';

export const DoubleColumnLayout = ({ className, ...props }: DoubleColumnLayoutProps) => {
    return <div {...props} className={cx(doubleColumnLayoutClassName, className)} />;
};
