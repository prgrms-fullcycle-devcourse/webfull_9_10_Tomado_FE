'use client';

import { useToastStore } from '@/store/toast';
import { Toast } from './Toast';
import ReactDom from 'react-dom';

export const ToastList = () => {
    const { toastList } = useToastStore();

    if (typeof document === 'undefined' || toastList.length === 0) return null;
    const element = document.getElementById('toast-root');
    if (!element) return null;

    return ReactDom.createPortal(
        <div className='pointer-events-none fixed top-20 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2'>
            {toastList.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>,
        element
    );
};
