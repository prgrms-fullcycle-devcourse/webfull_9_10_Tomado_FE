import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '.';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    iconName?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const getTagClassName = () => {
    return cx(
        'inline-flex items-center justify-center gap-0.5 border-1 border-neutral-darker bg-transparent font-medium text-neutral-darker',
        'rounded-lg px-2 py-1 text-xs leading-none'
    );
};

const tagIconClassName = 'text-inherit';

export const Tag = ({ label, iconName, className, ...props }: TagProps) => {
    return (
        <span {...props} className={cx(getTagClassName(), className)}>
            {iconName ? <Icon className={tagIconClassName} name={iconName} size={14} /> : null}
            <span>{label}</span>
        </span>
    );
};
