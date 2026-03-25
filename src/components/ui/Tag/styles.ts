import type { TagProps, TagSize } from './types';

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

export const getTagClassName = ({ size = 'md' }: Pick<TagProps, 'size'>) => {
    return cx(
        'inline-flex items-center justify-center gap-2 border-2 border-neutral-darker bg-transparent font-medium text-neutral-darker',
        tagSizeClassNames[size].root
    );
};

export const getTagIconSize = (size: TagSize) => tagSizeClassNames[size].icon;

export const tagIconClassName = 'text-inherit';

export { cx };
