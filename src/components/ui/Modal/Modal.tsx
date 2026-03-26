import { Fragment } from 'react';

import { Button, ButtonGroup, PlayerButton } from '@@/ui/index';
import { Icon } from '@@/ui/Icon';

import {
    cx,
    emptyMenuStateClassName,
    getMenuItemClassName,
    getOverlayClassName,
    getPlayerCardClassName,
    getPlayerCardInnerClassName,
    getPlayerCloseButtonClassName,
    getPlayerHeaderClassName,
    getStandardDescriptionClassName,
    getStandardTitleClassName,
    getSurfaceClassName,
    inlineCloseButtonClassName,
    menuDividerClassName,
    menuListClassName,
    overlayBackdropClassName,
    playerCardDescriptionClassName,
    playerCardImageClassName,
    playerCardTextClassName,
    playerCardTitleClassName,
    playerCardsClassName,
    playerCardItemClassName,
    playerHeaderInnerClassName,
    playerTitleClassName,
    playerTransportClassName,
    playerVolumeRangeClassName,
    playerVolumeSectionClassName,
    standardBodyClassName,
    standardCloseButtonWrapperClassName,
    standardContentClassName,
    standardFooterClassName,
} from './styles';
import type { ModalProps } from './types';

const getDefaultConfirmLabel = (tone: ModalProps['tone']) => {
    return tone === 'danger' ? '삭제' : '확인';
};

const renderStandardFooter = ({
    tone = 'default',
    cancelLabel,
    confirmLabel,
    onCancel,
    onConfirm,
}: Pick<ModalProps, 'tone' | 'cancelLabel' | 'confirmLabel' | 'onCancel' | 'onConfirm'>) => {
    return (
        <div className={standardFooterClassName}>
            <ButtonGroup>
                <Button
                    className='!border-transparent !bg-neutral-subtle !text-black hover:!bg-neutral-subtle'
                    onClick={onCancel}
                    variant='filled'
                >
                    {cancelLabel ?? '취소'}
                </Button>
                <Button
                    className={tone === 'danger' ? '!bg-danger hover:!bg-danger-darker' : undefined}
                    onClick={onConfirm}
                    variant='filled'
                >
                    {confirmLabel ?? getDefaultConfirmLabel(tone)}
                </Button>
            </ButtonGroup>
        </div>
    );
};

const renderCloseButton = (variant: ModalProps['variant'], tone: ModalProps['tone'], onClose?: () => void) => {
    if (!onClose) {
        return null;
    }

    if (variant === 'standard') {
        return (
            <div className={standardCloseButtonWrapperClassName}>
                <Button
                    aria-label='Close modal'
                    icon={<Icon color='currentColor' name='close' />}
                    iconOnly
                    onClick={onClose}
                    size='lg'
                    variant='ghost'
                >
                    닫기
                </Button>
            </div>
        );
    }

    return (
        <button
            aria-label='Close modal'
            className={variant === 'player' ? getPlayerCloseButtonClassName(tone) : inlineCloseButtonClassName}
            onClick={onClose}
            type='button'
        >
            <Icon color='currentColor' name='close' size={16} />
        </button>
    );
};

const renderPlayerDefaultBody = ({
    tone = 'default',
    playerVolume = 40,
    onPlayerVolumeChange,
    playerPlaying = true,
    onPlayerPrevious,
    onPlayerToggle,
    onPlayerNext,
}: Pick<
    ModalProps,
    | 'tone'
    | 'playerVolume'
    | 'onPlayerVolumeChange'
    | 'playerPlaying'
    | 'onPlayerPrevious'
    | 'onPlayerToggle'
    | 'onPlayerNext'
>) => {
    return (
        <>
            <div className={playerCardsClassName}>
                <div className={playerCardItemClassName}>
                    <div className={getPlayerCardClassName}>
                        <button className={getPlayerCardInnerClassName(false)} type='button'>
                            <div className={playerCardTextClassName}>
                                <p className={cx(playerCardTitleClassName, tone === 'focusmode' && 'text-white')}>
                                    Lo-fi
                                </p>
                                <p
                                    className={cx(
                                        playerCardDescriptionClassName,
                                        tone === 'focusmode' && 'text-white/70'
                                    )}
                                >
                                    아날로그 감성
                                </p>
                            </div>
                            <img
                                alt=''
                                aria-hidden='true'
                                className={playerCardImageClassName}
                                src='/img_player_01.png'
                            />
                        </button>
                    </div>
                </div>
                <div className={playerCardItemClassName}>
                    <div className={getPlayerCardClassName}>
                        <button className={getPlayerCardInnerClassName(true)} type='button'>
                            <div className={playerCardTextClassName}>
                                <p className={cx(playerCardTitleClassName, tone === 'focusmode' && 'text-white')}>
                                    빗소리
                                </p>
                                <p
                                    className={cx(
                                        playerCardDescriptionClassName,
                                        tone === 'focusmode' && 'text-white/70'
                                    )}
                                >
                                    집중을 돕는 빗소리
                                </p>
                            </div>
                            <img
                                alt=''
                                aria-hidden='true'
                                className={playerCardImageClassName}
                                src='/img_player_02.png'
                            />
                        </button>
                    </div>
                </div>
                <div className={playerCardItemClassName}>
                    <div className={getPlayerCardClassName}>
                        <button className={getPlayerCardInnerClassName(false)} type='button'>
                            <div className={playerCardTextClassName}>
                                <p className={cx(playerCardTitleClassName, tone === 'focusmode' && 'text-white')}>
                                    카페
                                </p>
                                <p
                                    className={cx(
                                        playerCardDescriptionClassName,
                                        tone === 'focusmode' && 'text-white/70'
                                    )}
                                >
                                    편안한 백색소음
                                </p>
                            </div>
                            <img
                                alt=''
                                aria-hidden='true'
                                className={playerCardImageClassName}
                                src='/img_player_03.png'
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className={playerVolumeSectionClassName}>
                <Icon color={tone === 'focusmode' ? 'white' : 'color-neutral-darker'} name='volume_off' size={16} />
                <input
                    aria-label='볼륨'
                    className={playerVolumeRangeClassName}
                    max={100}
                    min={0}
                    onChange={onPlayerVolumeChange}
                    type='range'
                    value={playerVolume}
                />
                <Icon color={tone === 'focusmode' ? 'white' : 'color-neutral-darker'} name='volume_on' size={16} />
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
        </>
    );
};

export const Modal = ({
    open = true,
    inline = false,
    variant = 'standard',
    tone = 'default',
    title,
    description,
    headerSlot,
    footer,
    cancelLabel,
    confirmLabel,
    closeButton = true,
    onClose,
    onCancel,
    onConfirm,
    onBackdropClick,
    menuItems,
    playerVolume = 40,
    onPlayerVolumeChange,
    playerPlaying = true,
    onPlayerPrevious,
    onPlayerToggle,
    onPlayerNext,
    children,
    className,
    ...props
}: ModalProps) => {
    if (!open) {
        return null;
    }

    const closeNode = closeButton ? renderCloseButton(variant, tone, onClose) : null;

    const surfaceNode =
        variant === 'menu' ? (
            <>
                {headerSlot ? <div className='px-6 pt-6'>{headerSlot}</div> : null}
                <div className={menuListClassName}>
                    {menuItems && menuItems.length > 0 ? (
                        menuItems.map((item, index) => (
                            <Fragment key={`${item.label}-${index}`}>
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
                        <div className={emptyMenuStateClassName}>{children}</div>
                    )}
                </div>
            </>
        ) : variant === 'player' ? (
            <>
                <div className={getPlayerHeaderClassName(tone)}>
                    <div className={cx(playerHeaderInnerClassName, tone === 'focusmode' && 'bg-white/6 text-white')}>
                        <div className={cx(playerTitleClassName, tone === 'focusmode' && 'text-white')}>
                            {title ?? '배경음악 플레이어'}
                        </div>
                        {closeNode}
                    </div>
                </div>
                <div>
                    {children ? (
                        <>
                            {headerSlot}
                            {children}
                            {footer ? <div className='mt-6'>{footer}</div> : null}
                        </>
                    ) : (
                        renderPlayerDefaultBody({
                            tone,
                            playerVolume,
                            onPlayerVolumeChange,
                            playerPlaying,
                            onPlayerPrevious,
                            onPlayerToggle,
                            onPlayerNext,
                        })
                    )}
                </div>
            </>
        ) : (
            <>
                {closeNode}
                <div className={standardContentClassName}>
                    {title ? <div className={getStandardTitleClassName(tone)}>{title}</div> : null}
                    {description ? <div className={getStandardDescriptionClassName(tone)}>{description}</div> : null}
                    <div className={standardBodyClassName}>{children}</div>
                    {renderStandardFooter({
                        tone,
                        cancelLabel,
                        confirmLabel,
                        onCancel: onCancel ?? onClose,
                        onConfirm,
                    })}
                </div>
            </>
        );

    return (
        <div className={getOverlayClassName(variant, tone, inline)}>
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
                className={cx(getSurfaceClassName(variant, tone), className)}
                role='dialog'
                aria-modal={inline ? undefined : true}
            >
                {surfaceNode}
            </div>
        </div>
    );
};
