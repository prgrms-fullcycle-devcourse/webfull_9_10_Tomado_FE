import type { HTMLAttributes } from 'react';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    stackOnMobile?: boolean;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const ButtonGroup = ({ className, stackOnMobile = true, ...props }: ButtonGroupProps) => {
    return (
        <div
            {...props}
            className={cx(
                'flex w-full items-stretch gap-4 [&>*]:shrink-0',
                stackOnMobile ? 'max-sm:flex-col sm:[&>*]:flex-1' : '[&>*]:flex-1',
                className
            )}
        />
    );
};
