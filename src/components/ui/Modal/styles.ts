import type { ModalTone, ModalVariant } from './types';

export const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const getOverlayClassName = (
    variant: ModalVariant = 'standard',
    tone: ModalTone = 'default',
    inline = false
) => {
    if (inline) {
        return 'relative flex w-full justify-center';
    }

    if (variant === 'menu') {
        return 'fixed inset-0 z-50 flex items-start justify-center p-4';
    }

    if (variant === 'player' && tone === 'focusmode') {
        return 'fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]';
    }

    return 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';
};

export const overlayBackdropClassName = 'absolute inset-0';

export const getSurfaceClassName = (variant: ModalVariant = 'standard', tone: ModalTone = 'default') => {
    if (variant === 'menu') {
        return cx(
            'relative w-full max-w-[420px] overflow-hidden rounded-xl border border-neutral-lighter bg-white shadow-lg',
            tone === 'default' && 'text-black'
        );
    }

    if (variant === 'player') {
        return cx(
            'relative w-full max-w-[460px] overflow-hidden rounded-2xl border shadow-lg',
            tone === 'focusmode'
                ? 'border-white/15 bg-white/10 text-white backdrop-blur-2xl'
                : 'border-neutral-lighter bg-white text-black'
        );
    }

    return cx(
        'relative w-full max-w-[400px] min-w-[280px] rounded-3xl border bg-white p-4 shadow-lg',
        tone === 'danger' ? 'border-danger-lighter text-black' : 'border-neutral-lighter text-black'
    );
};

export const playerHeaderClassName =
    'flex items-center justify-between border-b border-neutral-lighter/80 bg-neutral-subtle/80 px-6 py-5 text-neutral-darker';

export const playerBodyClassName = 'px-6 py-5';

export const getPlayerHeaderClassName = (tone: ModalTone = 'default') => {
    if (tone === 'focusmode') {
        return 'flex items-center justify-between border-b border-white/10 bg-white/6 px-6 py-5 text-white';
    }

    return playerHeaderClassName;
};

export const getPlayerBodyClassName = (tone: ModalTone = 'default') => {
    return tone === 'focusmode' ? 'px-6 py-5 text-white' : playerBodyClassName;
};

export const standardCloseButtonWrapperClassName = 'absolute top-4 right-4';

export const inlineCloseButtonClassName =
    'inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-subtle hover:text-neutral-darker';

export const getPlayerCloseButtonClassName = (tone: ModalTone = 'default') => {
    return tone === 'focusmode'
        ? 'inline-flex size-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white'
        : inlineCloseButtonClassName;
};

export const standardContentClassName = 'flex-col items-center px-3 pt-12 pb-2 text-center';

export const getStandardTitleClassName = (tone: ModalTone = 'default') => {
    return cx('text-2xl font-bold', tone === 'danger' ? 'text-gray-900' : 'text-gray-900');
};

export const getStandardDescriptionClassName = (tone: ModalTone = 'default') => {
    return cx('text-lg min-h-[48px] mt-5 mb-8', tone === 'danger' ? 'text-neutral-darker' : 'text-neutral-darker');
};

export const standardBodyClassName = 'w-full';

export const standardFooterClassName = 'w-full';

export const menuListClassName = 'flex flex-col';

export const getMenuItemClassName = (tone: 'default' | 'danger' = 'default', active = false) => {
    return cx(
        'w-full px-6 py-5 text-left text-[2rem] leading-none font-medium transition-colors',
        tone === 'danger' ? 'text-danger hover:bg-danger-subtle' : 'text-black hover:bg-neutral-subtle',
        active && 'bg-neutral-subtle'
    );
};

export const menuDividerClassName = 'h-px bg-neutral-lighter';

export const emptyMenuStateClassName = 'px-6 py-5 text-sm text-neutral-darker';
