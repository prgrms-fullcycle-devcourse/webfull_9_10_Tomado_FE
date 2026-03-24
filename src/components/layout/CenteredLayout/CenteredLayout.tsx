import { centeredLayoutClassName, cx } from './styles';
import type { CenteredLayoutProps } from './types';

export const CenteredLayout = ({
    className,
    maxWidth = '960px',
    gap = '32px',
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
