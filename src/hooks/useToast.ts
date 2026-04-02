import { useToastStore } from '@/stores/toast';
import { v4 } from 'uuid';
import type { ToastItemType } from '@/components/ui/Toast';

export const useToast = () => {
    const { addToastList } = useToastStore();

    const showToast = (toastItem: Omit<ToastItemType, 'id'>) => {
        const id = v4();
        addToastList({ id, ...toastItem });
    };

    return { showToast };
};
