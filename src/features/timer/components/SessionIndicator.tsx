import type { HTMLAttributes } from 'react';

export interface SessionIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    total?: number;
    filledCount?: number;
    tone?: 'default' | 'focusmode';
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const rootClassName = 'flex items-center gap-2.5';

const getItemClassName = (filled = false, tone: SessionIndicatorProps['tone'] = 'default') => {
    return cx(
        'size-6 rounded-md border-2',
        tone === 'focusmode'
            ? filled
                ? 'bg-neutral-subtle border-neutral-subtle'
                : 'border-neutral-subtle bg-transparent'
            : filled
              ? 'border-primary bg-primary'
              : 'border-neutral bg-transparent'
    );
};

export const SessionIndicator = ({
    total = 4,
    filledCount = 1,
    tone = 'default',
    className,
    ...props
}: SessionIndicatorProps) => {
    const items = Array.from({ length: total }, (_, index) => index < filledCount);

    return (
        <div {...props} className={[rootClassName, className].filter(Boolean).join(' ')}>
            {items.map((filled, index) => (
                <span key={index} aria-hidden='true' className={getItemClassName(filled, tone)} />
            ))}
        </div>
    );
};
