import type { ToastItemType } from '@/components/ui/Toast';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ToastState {
    toastList: ToastItemType[];
    addToastList: (toast: ToastItemType) => void;
    removeToastList: (id: string) => void;
}

export const useToastStore = create<ToastState>()(
    devtools((set) => ({
        toastList: [],
        addToastList: (toast: ToastItemType) => set((state) => ({ toastList: [...state.toastList, toast] })),
        removeToastList: (id: string) =>
            set((state) => ({ toastList: state.toastList.filter((toast) => toast.id !== id) })),
    }))
);
