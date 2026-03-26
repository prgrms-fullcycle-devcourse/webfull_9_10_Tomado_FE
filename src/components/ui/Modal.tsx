import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

import { Icon, Button, ButtonGroup } from '.';

export type ModalTone = 'default' | 'danger';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    open?: boolean;
    inline?: boolean;
    tone?: ModalTone;
    title?: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    cancelLabel?: ReactNode;
    confirmLabel?: ReactNode;
    closeButton?: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onConfirm?: () => void;
    onBackdropClick?: MouseEventHandler<HTMLButtonElement>;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const overlayBackdropClassName = 'absolute inset-0';
const standardCloseButtonWrapperClassName = 'absolute top-4 right-4';
const standardContentClassName = 'flex flex-col items-center px-3 pt-12 pb-2 text-center';
const standardBodyClassName = 'w-full';
const standardFooterClassName = 'mt-[30px] w-full';

const getOverlayClassName = (inline = false) => {
    if (inline) {
        return 'relative flex w-full justify-center';
    }

    return 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';
};

const getSurfaceClassName = (tone: ModalTone = 'default') => {
    return cx(
        'relative w-full max-w-[400px] min-w-[280px] rounded-3xl border bg-white p-4 shadow-shadow-1',
        tone === 'danger' ? 'border-danger-lighter text-black' : 'border-neutral-lighter text-black'
    );
};

const getTitleClassName = () => {
    return 'text-2xl font-bold text-gray-900';
};

const getDescriptionClassName = () => {
    return 'mt-5 mb-8 min-h-[48px] text-lg text-neutral-darker';
};

const getDefaultConfirmLabel = (tone: ModalTone = 'default') => {
    return tone === 'danger' ? '삭제' : '확인';
};

const renderDefaultFooter = ({
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

const renderCloseButton = (onClose?: () => void) => {
    if (!onClose) {
        return null;
    }

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
};

export const Modal = ({
    open = true,
    inline = false,
    tone = 'default',
    title,
    description,
    footer,
    cancelLabel,
    confirmLabel,
    closeButton = true,
    onClose,
    onCancel,
    onConfirm,
    onBackdropClick,
    children,
    className,
    ...props
}: ModalProps) => {
    if (!open) {
        return null;
    }

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
                {closeButton ? renderCloseButton(onClose) : null}
                <div className={standardContentClassName}>
                    {title ? <div className={getTitleClassName()}>{title}</div> : null}
                    {description ? <div className={getDescriptionClassName()}>{description}</div> : null}
                    <div className={standardBodyClassName}>{children}</div>
                    {footer ??
                        renderDefaultFooter({
                            tone,
                            cancelLabel,
                            confirmLabel,
                            onCancel: onCancel ?? onClose,
                            onConfirm,
                        })}
                </div>
            </div>
        </div>
    );
};
