import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { Fragment } from 'react';

export type MenuItemTone = 'default' | 'danger';

export interface MenuItem {
    label: ReactNode;
    tone?: MenuItemTone;
    onClick?: () => void;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    inline?: boolean;
    items?: MenuItem[];
    closeOnBackdropClick?: boolean;
    onClose?: () => void;
    onBackdropClick?: MouseEventHandler<HTMLButtonElement>;
    emptyState?: ReactNode;
    headerSlot?: ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const overlayBackdropClassName = 'absolute inset-0';
const menuListClassName = 'flex flex-col';
const menuDividerClassName = 'h-px border-neutral-subtle';
const emptyMenuStateClassName = 'px-6 py-5 text-sm text-neutral-darker';

const getOverlayClassName = (inline = false) => {
    if (inline) {
        return 'relative flex w-full justify-center';
    }

    return 'fixed inset-0 z-50 flex items-start justify-center p-4';
};

const getSurfaceClassName = () => {
    return 'relative w-[200px] overflow-hidden rounded-xl border border-neutral-lighter bg-white text-black shadow-shadow-1';
};

const getMenuItemClassName = (tone: MenuItemTone = 'default') => {
    return cx(
        'h-8 w-full rounded-lg px-2 text-left text-xs transition-colors hover:cursor-pointer',
        tone === 'danger' ? 'text-danger hover:bg-danger-subtle' : 'text-black hover:bg-neutral-subtle'
    );
};

export const Menu = ({
    open = true,
    inline = false,
    items,
    closeOnBackdropClick = true,
    onClose,
    onBackdropClick,
    emptyState,
    headerSlot,
    className,
    ...props
}: MenuProps) => {
    if (!open) {
        return null;
    }

    const handleBackdropClick: MouseEventHandler<HTMLButtonElement> | undefined = closeOnBackdropClick
        ? (onBackdropClick ?? onClose)
        : undefined;

    return (
        <div className={getOverlayClassName(inline)}>
            {!inline ? (
                <button
                    aria-label='Close menu backdrop'
                    className={overlayBackdropClassName}
                    onClick={handleBackdropClick}
                    type='button'
                />
            ) : null}
            <div
                {...props}
                aria-modal={inline ? undefined : true}
                className={cx(getSurfaceClassName(), className)}
                role='dialog'
            >
                {headerSlot ? <div className='px-6 pt-6'>{headerSlot}</div> : null}
                <div className={menuListClassName}>
                    {items && items.length > 0 ? (
                        items.map((item, index) => (
                            <Fragment key={`${String(item.label)}-${index}`}>
                                {index > 0 ? <hr aria-hidden='true' className={menuDividerClassName} /> : null}
                                <div className='p-1'>
                                    <button
                                        className={getMenuItemClassName(item.tone)}
                                        onClick={item.onClick}
                                        type='button'
                                    >
                                        {item.label}
                                    </button>
                                </div>
                            </Fragment>
                        ))
                    ) : (
                        <div className={emptyMenuStateClassName}>{emptyState}</div>
                    )}
                </div>
            </div>
        </div>
    );
};
