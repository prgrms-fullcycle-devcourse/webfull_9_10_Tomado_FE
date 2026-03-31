import type { ChangeEventHandler, HTMLAttributes, MouseEventHandler } from 'react';

import { Icon, PlayerButton } from '.';
import { useGlobalKeyboardShortcuts } from '@/hooks';
import type { BgmPlayerItem } from '@@@/settings';

export type PlayerModalTone = 'default' | 'focusmode';

export interface PlayerModalProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    inline?: boolean;
    tone?: PlayerModalTone;
    title?: string;
    closeButton?: boolean;
    onClose?: () => void;
    onBackdropClick?: MouseEventHandler<HTMLButtonElement>;
    playerVolume?: number;
    onPlayerVolumeChange?: ChangeEventHandler<HTMLInputElement>;
    playerPlaying?: boolean;
    playerItems?: Array<BgmPlayerItem & { active?: boolean }>;
    onPlayerItemSelect?: (itemId: string) => void;
    onPlayerPrevious?: () => void;
    onPlayerToggle?: () => void;
    onPlayerNext?: () => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const overlayBackdropClassName = 'absolute inset-0';
const playerCardsClassName = 'flex flex-col py-[10px]';
const playerCardItemClassName = 'relative';
const playerCardClassName = 'px-2 py-1';
const playerCardTextClassName = 'flex min-w-0 flex-1 flex-col items-start gap-1';
const playerCardTitleClassName = 'truncate text-base font-semibold text-gray-800';
const playerCardDescriptionClassName = 'truncate text-xs text-neutral';
const playerCardImageClassName =
    'pointer-events-none absolute top-1/2 right-0 h-[66px] -translate-y-1/2 object-contain';
const playerVolumeSectionClassName = 'flex items-center gap-3 px-4 py-2.5';
const playerVolumeRangeClassName = (tone: PlayerModalTone = 'default') => {
    return cx(
        'h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-lighter',
        tone === 'focusmode' ? 'accent-white' : 'accent-primary'
    );
};
const playerTransportClassName = 'flex items-center justify-center gap-2.5 px-4 py-2.5';
const playerHeaderClassName = 'p-1 bg-neutral-subtle';
const playerHeaderInnerClassName = 'flex h-8 items-center justify-between bg-neutral-subtle px-2 text-neutral-darker';
const playerTitleClassName = 'text-xs font-medium text-neutral-darker';

const getOverlayClassName = (inline = false) => {
    if (inline) {
        return 'relative flex w-full justify-center';
    }

    return 'fixed inset-0 z-50';
};

const getSurfaceClassName = (tone: PlayerModalTone = 'default') => {
    return cx(
        'absolute top-[54px] right-[170px] w-full max-w-[221px] overflow-hidden rounded-2xl border shadow-shadow-1',
        tone === 'focusmode' ? '!glass-effect-base' : 'border-neutral-lighter bg-white text-black'
    );
};

const getHeaderClassName = (tone: PlayerModalTone = 'default') => {
    if (tone === 'focusmode') {
        return 'p-1';
    }

    return playerHeaderClassName;
};

const getCloseButtonClassName = (tone: PlayerModalTone = 'default') => {
    return tone === 'focusmode'
        ? 'inline-flex size-6 cursor-pointer items-center justify-center !text-white/80 transition-colors'
        : 'inline-flex size-6 cursor-pointer items-center justify-center text-neutral-darker transition-colors';
};

const getPlayerCardInnerClassName = (active = false, tone: PlayerModalTone = 'default') => {
    return cx(
        'relative flex w-full cursor-pointer items-center overflow-hidden !rounded-xl border px-3 py-2.5 pr-[92px] transition-colors',
        active
            ? tone === 'focusmode'
                ? '!glass-effect-strong'
                : 'border-primary bg-primary-subtle'
            : tone === 'focusmode'
              ? 'bg-transparent border-white/5 hover:!border-white'
              : 'border-neutral-subtle bg-transparent hover:border-neutral-lighter hover:bg-neutral-subtle'
    );
};

const renderCloseButton = (tone: PlayerModalTone = 'default', onClose?: () => void) => {
    if (!onClose) {
        return null;
    }

    return (
        <button aria-label='Close modal' className={getCloseButtonClassName(tone)} onClick={onClose} type='button'>
            <Icon color='currentColor' name='close' size={16} />
        </button>
    );
};

const renderCard = ({
    title,
    description,
    imageSrc,
    active = false,
    tone = 'default',
    onClick,
}: {
    title: string;
    description: string;
    imageSrc: string;
    active?: boolean;
    tone?: PlayerModalTone;
    onClick?: () => void;
}) => {
    return (
        <div className={playerCardItemClassName}>
            <div className={playerCardClassName}>
                <button className={getPlayerCardInnerClassName(active, tone)} onClick={onClick} type='button'>
                    <div className={playerCardTextClassName}>
                        <p className={cx(playerCardTitleClassName, tone === 'focusmode' && 'text-white')}>{title}</p>
                        <p className={cx(playerCardDescriptionClassName, tone === 'focusmode' && 'text-white/70')}>
                            {description}
                        </p>
                    </div>
                    <img alt='' aria-hidden='true' className={playerCardImageClassName} src={imageSrc} />
                </button>
            </div>
        </div>
    );
};

export const PlayerModal = ({
    open = true,
    inline = false,
    tone = 'default',
    title,
    closeButton = true,
    onClose,
    onBackdropClick,
    playerVolume = 40,
    onPlayerVolumeChange,
    playerPlaying = true,
    playerItems,
    onPlayerItemSelect,
    onPlayerPrevious,
    onPlayerToggle,
    onPlayerNext,
    className,
    ...props
}: PlayerModalProps) => {
    useGlobalKeyboardShortcuts({
        enabled: open,
        onEscape: onClose,
    });

    if (!open) {
        return null;
    }

    const modalPlayerItems = playerItems?.length ? playerItems : [];

    return (
        <div className={getOverlayClassName(inline)}>
            {!inline ? (
                <button
                    aria-label='Close modal backdrop'
                    className={overlayBackdropClassName}
                    onClick={onBackdropClick ?? onClose}
                    type='button'
                />
            ) : null}
            <div
                {...props}
                aria-modal={inline ? undefined : true}
                className={cx(getSurfaceClassName(tone), className)}
                role='dialog'
            >
                <div className={getHeaderClassName(tone)}>
                    <div
                        className={cx(playerHeaderInnerClassName, tone === 'focusmode' && 'bg-transparent text-white')}
                    >
                        <div className={cx(playerTitleClassName, tone === 'focusmode' && 'text-white')}>
                            {title ?? '배경음악 플레이어'}
                        </div>
                        {closeButton ? renderCloseButton(tone, onClose) : null}
                    </div>
                </div>

                <div>
                    <div className={playerCardsClassName}>
                        {modalPlayerItems.map((item) =>
                            renderCard({
                                title: item.title,
                                description: item.description,
                                imageSrc: item.imageSrc,
                                active: item.active,
                                tone,
                                onClick: () => onPlayerItemSelect?.(item.id),
                            })
                        )}
                    </div>

                    <div className={playerVolumeSectionClassName}>
                        <Icon
                            color={tone === 'focusmode' ? 'color-white' : 'color-neutral-darker'}
                            name='volume_off'
                            size={16}
                        />
                        <input
                            aria-label='볼륨'
                            className={playerVolumeRangeClassName(tone)}
                            max={100}
                            min={0}
                            onChange={onPlayerVolumeChange}
                            type='range'
                            value={playerVolume}
                        />
                        <Icon
                            color={tone === 'focusmode' ? 'color-white' : 'color-neutral-darker'}
                            name='volume_on'
                            size={16}
                        />
                    </div>

                    <div className={playerTransportClassName}>
                        <PlayerButton
                            className={tone === 'focusmode' ? '!text-white hover:!bg-white/8' : '!text-neutral-darker'}
                            icon={<Icon color='currentColor' name='prev' />}
                            onClick={onPlayerPrevious}
                            size='sm'
                            variant='ghost'
                        >
                            이전
                        </PlayerButton>
                        <PlayerButton
                            className={
                                tone === 'focusmode'
                                    ? '!border-white/20 !bg-white/10 !text-white hover:!bg-white/16'
                                    : '!border-transparent !bg-neutral-darker !text-white hover:!bg-gray-600'
                            }
                            icon={<Icon color='currentColor' name={playerPlaying ? 'pause' : 'play'} />}
                            onClick={onPlayerToggle}
                            size='sm'
                            variant='filled'
                        >
                            재생 제어
                        </PlayerButton>
                        <PlayerButton
                            className={tone === 'focusmode' ? '!text-white hover:!bg-white/8' : '!text-neutral-darker'}
                            icon={<Icon color='currentColor' name='next' />}
                            onClick={onPlayerNext}
                            size='sm'
                            variant='ghost'
                        >
                            다음
                        </PlayerButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
