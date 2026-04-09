import type { ModalType } from '@/components/ui/Modal';
import { useModalStore } from '@/stores/modal';

export const useModal = () => {
    const { open, close, cancel, confirm } = useModalStore();

    const showModal = (modal: ModalType) => {
        open(modal);
    };

    return {
        showModal,
        closeModal: close,
        cancelModal: cancel,
        confirmModal: confirm,
    };
};
