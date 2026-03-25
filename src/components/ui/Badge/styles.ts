import type { BadgeProps, BadgeSize } from './types';

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

export const getBadgeClassName = ({ size = 'md' }: Pick<BadgeProps, 'size'>) => {
    return cx(
        'inline-flex items-center justify-center gap-2 bg-neutral-darker font-medium text-white',
        badgeSizeClassNames[size].root
    );
};

export const getBadgeIconSize = (size: BadgeSize) => badgeSizeClassNames[size].icon;

export const badgeIconClassName = 'text-inherit';

export { cx };
