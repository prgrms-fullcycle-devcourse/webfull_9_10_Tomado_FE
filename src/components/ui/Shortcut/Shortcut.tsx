import { cx, getShortcutClassName, getShortcutKeyClassName } from './styles';
import type { ShortcutProps } from './types';

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
