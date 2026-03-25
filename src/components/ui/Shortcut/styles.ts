import type { ShortcutProps, ShortcutSize } from './types';

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const shortcutSizeClassNames: Record<ShortcutSize, { root: string; key: string }> = {
    sm: {
        root: 'gap-3',
        key: 'min-w-8 min-h-8 rounded-md px-2 text-lg',
    },
    md: {
        root: 'gap-8',
        key: 'min-w-9 min-h-9 rounded-md px-2.5 text-2xl',
    },
};

export const getShortcutClassName = ({ size = 'md' }: Pick<ShortcutProps, 'size'>) => {
    return cx('inline-flex flex-wrap items-center', shortcutSizeClassNames[size].root);
};

export const getShortcutKeyClassName = ({ size = 'md' }: Pick<ShortcutProps, 'size'>) => {
    return cx(
        'inline-flex items-center justify-center border-2 border-neutral-darker bg-white font-medium text-neutral-darker shadow-[0_2px_0_rgba(100,116,139,0.08)]',
        shortcutSizeClassNames[size].key
    );
};

export { cx };
