import type { HTMLAttributes, ReactNode } from 'react';

export type ShortcutSize = 'sm' | 'md';

export interface ShortcutProps extends HTMLAttributes<HTMLDivElement> {
    keys: ReactNode[];
    size?: ShortcutSize;
}

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

const getShortcutClassName = ({ size = 'md' }: Pick<ShortcutProps, 'size'>) => {
    return cx('inline-flex flex-wrap items-center', shortcutSizeClassNames[size].root);
};

const getShortcutKeyClassName = ({ size = 'md' }: Pick<ShortcutProps, 'size'>) => {
    return cx(
        'inline-flex items-center justify-center border-2 border-neutral-darker bg-white font-medium text-neutral-darker shadow-[0_2px_0_rgba(100,116,139,0.08)]',
        shortcutSizeClassNames[size].key
    );
};

export const Shortcut = ({ keys, size = 'md', className, ...props }: ShortcutProps) => {
    return (
        <div {...props} className={cx(getShortcutClassName({ size }), className)}>
            {keys.map((keyLabel, index) => (
                <kbd key={`${String(keyLabel)}-${index}`} className={getShortcutKeyClassName({ size })}>
                    {keyLabel}
                </kbd>
            ))}
        </div>
    );
};
