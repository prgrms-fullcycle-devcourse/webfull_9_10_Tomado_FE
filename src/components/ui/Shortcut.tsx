import type { HTMLAttributes, ReactNode } from 'react';

export interface ShortcutProps extends HTMLAttributes<HTMLDivElement> {
    keys: ReactNode[];
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const shortcutClassName = 'inline-flex flex-wrap items-center gap-1';
const shortcutKeyClassName =
    'flex h-4 w-fit min-w-4 items-center justify-center rounded-xs border border-neutral-darker bg-transparent px-1 text-xs text-neutral-darker';

export const Shortcut = ({ keys, className, ...props }: ShortcutProps) => {
    return (
        <div {...props} className={cx(shortcutClassName, className)}>
            {keys.map((keyLabel, index) => (
                <kbd key={`${String(keyLabel)}-${index}`} className={shortcutKeyClassName}>
                    {keyLabel}
                </kbd>
            ))}
        </div>
    );
};
