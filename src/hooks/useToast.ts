import { useCallback } from 'react';

import { useToastStore } from '@/stores/toast';
import { v4 } from 'uuid';
import type { ToastItemType } from '@/components/ui/Toast';

export const useToast = () => {
    const { addToastList } = useToastStore();

    const showToast = useCallback(
        (toastItem: Omit<ToastItemType, 'id'>) => {
            const id = v4();
            addToastList({ id, ...toastItem });
        },
        [addToastList]
    );

    return { showToast };
};
