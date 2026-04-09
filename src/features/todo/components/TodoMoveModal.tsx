import { Button, ButtonGroup, Calendar, Icon } from '@@/ui';

interface TodoMoveModalProps {
    open: boolean;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const overlayClassName = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';
const overlayBackdropClassName = 'absolute inset-0';
const surfaceClassName =
    'relative w-full max-w-[420px] min-w-[280px] rounded-3xl border border-neutral-lighter bg-white p-4 shadow-1';
const closeButtonWrapperClassName = 'absolute top-4 right-4';
const contentClassName = 'flex flex-col items-center px-3 pt-12 pb-2 text-center';
const titleClassName = 'text-2xl font-bold text-gray-900';
const bodyClassName = 'mt-5 w-full';
const footerClassName = 'mt-[30px] w-full';

export const TodoMoveModal = ({ open, selectedDate, onSelectDate, onClose, onConfirm }: TodoMoveModalProps) => {
    if (!open) {
        return null;
    }

    return (
        <div className={overlayClassName}>
            <button
                aria-label='Close move date modal backdrop'
                className={overlayBackdropClassName}
                onClick={onClose}
                type='button'
            />

            <div aria-modal className={surfaceClassName} role='dialog'>
                <div className={closeButtonWrapperClassName}>
                    <Button
                        aria-label='Close move date modal'
                        icon={<Icon color='currentColor' name='close' />}
                        iconOnly
                        onClick={onClose}
                        size='lg'
                        variant='ghost'
                    >
                        닫기
                    </Button>
                </div>

                <div className={contentClassName}>
                    <div className={titleClassName}>날짜 이동하기</div>

                    <div className={bodyClassName}>
                        <Calendar onSelectDate={onSelectDate} selectedDate={selectedDate} />
                    </div>

                    <div className={footerClassName}>
                        <ButtonGroup>
                            <Button
                                className='!border-transparent !bg-neutral-subtle !text-black hover:!bg-neutral-subtle'
                                onClick={onClose}
                                variant='filled'
                            >
                                취소
                            </Button>
                            <Button onClick={onConfirm} variant='filled'>
                                이동하기
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </div>
    );
};
