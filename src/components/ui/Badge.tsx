import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '.';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    iconName?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const badgeClassName =
    'inline-flex h-5 w-fit items-center justify-center gap-1 rounded-full bg-neutral-darker px-2 text-xs leading-none font-medium text-white';

const badgeIconClassName = 'text-inherit';

export const Badge = ({ label, iconName, className, ...props }: BadgeProps) => {
    return (
        <span {...props} className={cx(badgeClassName, className)}>
            {iconName ? <Icon className={badgeIconClassName} color='white' name={iconName} size={12} /> : null}
            <span>{label}</span>
        </span>
    );
};
