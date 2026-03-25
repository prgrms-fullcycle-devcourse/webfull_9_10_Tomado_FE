import type { ModalTone, ModalVariant } from './types';

export const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

// INFO: overlay는 백드롭과 모달 배치 좌표를 담당하는 바깥 레이어입니다.
export const getOverlayClassName = (
    variant: ModalVariant = 'standard',
    _tone: ModalTone = 'default',
    inline = false
) => {
    if (inline) {
        return 'relative flex w-full justify-center';
    }

    if (variant === 'menu') {
        return 'fixed inset-0 z-50 flex items-start justify-center p-4';
    }

    if (variant === 'player') {
        return 'fixed inset-0 z-50';
    }

    return 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';
};

export const overlayBackdropClassName = 'absolute inset-0';

// INFO: surface는 실제 모달 박스의 크기, 배경, 라운드, 그림자를 담당합니다.
export const getSurfaceClassName = (variant: ModalVariant = 'standard', tone: ModalTone = 'default') => {
    if (variant === 'menu') {
        return cx(
            'relative w-[200px] overflow-hidden rounded-xl border border-neutral-lighter bg-white shadow-shadow-1',
            tone === 'default' && 'text-black'
        );
    }

    if (variant === 'player') {
        return cx(
            'absolute w-full top-[54px] right-[170px] max-w-[221px] overflow-hidden rounded-2xl border shadow-shadow-1',
            tone === 'focusmode'
                ? 'border-white/15 bg-white/10 text-white backdrop-blur-2xl'
                : 'border-neutral-lighter bg-white text-black'
        );
    }

    return cx(
        'relative w-full max-w-[400px] min-w-[280px] rounded-3xl border bg-white p-4 shadow-shadow-1',
        tone === 'danger' ? 'border-danger-lighter text-black' : 'border-neutral-lighter text-black'
    );
};

export const playerHeaderClassName = 'p-1 bg-neutral-subtle';
export const getPlayerHeaderClassName = (tone: ModalTone = 'default') => {
    if (tone === 'focusmode') {
        return 'p-1';
    }

    return playerHeaderClassName;
};
export const playerHeaderInnerClassName =
    'flex items-center justify-between bg-neutral-subtle px-2 h-8 text-neutral-darker';
export const playerTitleClassName = 'text-xs font-medium text-neutral-darker';
export const getPlayerCloseButtonClassName = (tone: ModalTone = 'default') => {
    return tone === 'focusmode'
        ? 'inline-flex size-6 items-center justify-center cursor-pointer text-white/80 transition-colors'
        : 'inline-flex size-6 items-center justify-center cursor-pointer text-neutral-darker transition-colors';
};

export const playerCardsClassName = 'flex flex-col py-[10px]';
export const playerCardItemClassName = 'relative';
export const getPlayerCardClassName = 'px-2 py-1';
export const getPlayerCardInnerClassName = (active = false) => {
    return cx(
        'relative flex w-full cursor-pointer items-center overflow-hidden rounded-xl border px-3 py-2.5 pr-[92px] transition-colors',
        active
            ? 'border-primary bg-primary-subtle'
            : 'border-neutral-subtle bg-transparent hover:border-neutral-lighter hover:bg-neutral-subtle'
    );
};
export const playerCardTextClassName = 'flex min-w-0 flex-1 flex-col items-start gap-1';
export const playerCardTitleClassName = 'truncate text-base font-semibold text-gray-800';
export const playerCardDescriptionClassName = 'truncate text-xs text-neutral';
export const playerCardImageClassName =
    'pointer-events-none absolute top-1/2 right-0 h-[66px] -translate-y-1/2 object-contain';

export const playerVolumeSectionClassName = 'flex items-center gap-3 px-4 py-2.5';
export const playerVolumeRangeClassName =
    'h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-lighter accent-primary';
export const playerTransportClassName = 'flex items-center justify-center gap-2.5 px-4 py-2.5';

export const standardCloseButtonWrapperClassName = 'absolute top-4 right-4';

export const inlineCloseButtonClassName =
    'inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-subtle hover:text-neutral-darker';

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

export const getMenuItemClassName = (tone: 'default' | 'danger' = 'default') => {
    return cx(
        'w-full px-2 h-8 text-left text-xs transition-colors rounded-lg hover:cursor-pointer',
        tone === 'danger' ? 'text-danger hover:bg-danger-subtle' : 'text-black hover:bg-neutral-subtle'
    );
};

export const menuDividerClassName = 'h-px border-neutral-subtle';

export const emptyMenuStateClassName = 'px-6 py-5 text-sm text-neutral-darker';
