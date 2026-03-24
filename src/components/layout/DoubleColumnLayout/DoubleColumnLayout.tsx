import { twoColumnLayoutClassName, cx } from './styles';
import type { TwoColumnLayoutProps } from './types';

export const DoubleColumnLayout = ({
    className,
    minColumnWidth = '420px',
    gap = '24px',
    style,
    ...props
}: TwoColumnLayoutProps) => {
    return (
        <div
            {...props}
            className={cx(twoColumnLayoutClassName, className)}
            style={{
                gap,
                gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnWidth}, 100%), 1fr))`,
                ...style,
            }}
        />
    );
};
