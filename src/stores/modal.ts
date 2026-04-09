import type { ModalType } from '@/components/ui/Modal';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalState {
    modal: ModalType | null;
    open: (modal: ModalType) => void;
    close: () => void;
    cancel: () => void;
    confirm: () => void;
}

export const useModalStore = create<ModalState>()(
    devtools((set, get) => ({
        modal: null,
        open: (modal) => set({ modal }),
        close: () => {
            const modal = get().modal;

            modal?.onClose?.();
            set({ modal: null });
        },
        cancel: () => {
            const modal = get().modal;

            modal?.onCancel?.();
            set({ modal: null });
        },
        confirm: () => {
            const modal = get().modal;

            modal?.onConfirm?.();
            set({ modal: null });
        },
    }))
);
