import { Fragment } from 'react';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

import {
    cx,
    emptyMenuStateClassName,
    getMenuItemClassName,
    getOverlayClassName,
    getPlayerBodyClassName,
    getPlayerCloseButtonClassName,
    getPlayerHeaderClassName,
    getStandardDescriptionClassName,
    getStandardTitleClassName,
    getSurfaceClassName,
    inlineCloseButtonClassName,
    menuDividerClassName,
    menuListClassName,
    overlayBackdropClassName,
    standardBodyClassName,
    standardCloseButtonWrapperClassName,
    standardContentClassName,
    standardFooterClassName,
} from './styles';
import type { ModalProps } from './types';

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
            <Icon color='currentColor' name='close' size={20} />
        </button>
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
    closeButton = true,
    onClose,
    onBackdropClick,
    menuItems,
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
                                {index > 0 ? <div className={menuDividerClassName} /> : null}
                                <button
                                    className={getMenuItemClassName(item.tone, item.active)}
                                    onClick={item.onClick}
                                    type='button'
                                >
                                    {item.label}
                                </button>
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
                    <div className='min-w-0 flex-1 text-[2rem] leading-none font-medium'>{title}</div>
                    {closeNode}
                </div>
                <div className={getPlayerBodyClassName(tone)}>
                    {headerSlot}
                    {children}
                    {footer ? <div className='mt-6'>{footer}</div> : null}
                </div>
            </>
        ) : (
            <>
                {closeNode}
                <div className={standardContentClassName}>
                    {title ? <div className={getStandardTitleClassName(tone)}>{title}</div> : null}
                    {description ? <div className={getStandardDescriptionClassName(tone)}>{description}</div> : null}
                    <div className={standardBodyClassName}>{children}</div>
                    {footer ? <div className={standardFooterClassName}>{footer}</div> : null}
                </div>
            </>
        );

    return (
        <div className={getOverlayClassName(variant, tone, inline)}>
            {!inline ? (
                <button
                    aria-label='Close modal backdrop'
                    className={overlayBackdropClassName}
                    onClick={onBackdropClick}
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
