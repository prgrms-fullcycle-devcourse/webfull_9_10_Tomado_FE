import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    iconName?: string;
    size?: BadgeSize;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const badgeSizeClassNames: Record<BadgeSize, { root: string; icon: number }> = {
    sm: {
        root: 'min-h-8 rounded-full px-3 text-sm leading-none',
        icon: 14,
    },
    md: {
        root: 'min-h-11 rounded-full px-5 text-2xl leading-none',
        icon: 18,
    },
};

const getBadgeClassName = ({ size = 'md' }: Pick<BadgeProps, 'size'>) => {
    return cx(
        'inline-flex items-center justify-center gap-2 bg-neutral-darker font-medium text-white',
        badgeSizeClassNames[size].root
    );
};

const getBadgeIconSize = (size: BadgeSize = 'md') => badgeSizeClassNames[size].icon;

const badgeIconClassName = 'text-inherit';

export const Badge = ({ label, iconName, size = 'md', className, ...props }: BadgeProps) => {
    return (
        <span {...props} className={cx(getBadgeClassName({ size }), className)}>
            {iconName ? (
                <Icon className={badgeIconClassName} color='white' name={iconName} size={getBadgeIconSize(size)} />
            ) : null}
            <span>{label}</span>
        </span>
    );
};
