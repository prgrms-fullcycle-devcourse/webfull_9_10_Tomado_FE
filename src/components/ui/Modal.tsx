import { useModalStore } from '@/stores/modal';

import { Button, ButtonGroup, Icon } from '.';

export type ModalType = {
    title: string;
    description: string;
    cancelLabel?: string;
    confirmLabel?: string;
    tone?: 'default' | 'danger';
    onCancel?: () => void;
    onConfirm?: () => void;
    onClose?: () => void;
};

interface ModalProps {
    modal: ModalType;
}

const surfaceClassName =
    'relative w-full max-w-[400px] min-w-[280px] rounded-3xl border border-neutral-lighter bg-white p-4 shadow-1';
const closeButtonWrapperClassName = 'absolute top-4 right-4';
const contentClassName = 'flex flex-col items-center px-3 pt-12 pb-2 text-center';
const titleClassName = 'text-2xl font-bold text-gray-900';
const descriptionClassName = 'mt-5 mb-8 min-h-[48px] text-lg text-neutral-darker';
const footerClassName = 'mt-[30px] w-full';

export const Modal = ({ modal }: ModalProps) => {
    const { close, cancel, confirm } = useModalStore();

    return (
        <div aria-modal className={surfaceClassName} role='dialog'>
            <div className={closeButtonWrapperClassName}>
                <Button
                    aria-label='Close modal'
                    icon={<Icon color='currentColor' name='close' />}
                    iconOnly
                    onClick={close}
                    size='lg'
                    variant='ghost'
                >
                    닫기
                </Button>
            </div>

            <div className={contentClassName}>
                <div className={titleClassName}>{modal.title}</div>
                <div className={descriptionClassName}>{modal.description}</div>

                <div className={footerClassName}>
                    <ButtonGroup>
                        <Button
                            className='!border-transparent !bg-neutral-subtle !text-black hover:!bg-neutral-subtle'
                            onClick={cancel}
                            variant='filled'
                        >
                            {modal.cancelLabel ?? '취소'}
                        </Button>
                        <Button
                            className={modal.tone === 'danger' ? '!bg-danger hover:!bg-danger-darker' : undefined}
                            onClick={confirm}
                            variant='filled'
                        >
                            {modal.confirmLabel ?? '확인'}
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};
