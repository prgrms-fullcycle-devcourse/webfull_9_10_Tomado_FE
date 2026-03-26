import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';

export type TagSize = 'sm' | 'md';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    iconName?: string;
    size?: TagSize;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const tagSizeClassNames: Record<TagSize, { root: string; icon: number }> = {
    sm: {
        root: 'min-h-8 rounded-xl px-3 text-sm leading-none',
        icon: 14,
    },
    md: {
        root: 'min-h-11 rounded-xl px-5 text-2xl leading-none',
        icon: 18,
    },
};

const getTagClassName = ({ size = 'md' }: Pick<TagProps, 'size'>) => {
    return cx(
        'inline-flex items-center justify-center gap-2 border-2 border-neutral-darker bg-transparent font-medium text-neutral-darker',
        tagSizeClassNames[size].root
    );
};

const getTagIconSize = (size: TagSize = 'md') => tagSizeClassNames[size].icon;

const tagIconClassName = 'text-inherit';

export const Tag = ({ label, iconName, size = 'md', className, ...props }: TagProps) => {
    return (
        <span {...props} className={cx(getTagClassName({ size }), className)}>
            {iconName ? <Icon className={tagIconClassName} name={iconName} size={getTagIconSize(size)} /> : null}
            <span>{label}</span>
        </span>
    );
};
