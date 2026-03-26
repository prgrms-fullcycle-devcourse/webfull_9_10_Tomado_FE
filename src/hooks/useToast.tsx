import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastProps } from '@@/ui/Toast';

type ToastItem = Pick<ToastProps, 'label' | 'icon' | 'textButton' | 'textButtonLabel' | 'onTextButtonClick'> & {
    id: number;
    durationMs?: number;
};

interface ToastContextValue {
    toasts: ToastItem[];
    showToast: (
        message: string,
        options?: Omit<ToastItem, 'id' | 'label'> & {
            durationMs?: number;
        }
    ) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const timerMapRef = useRef<Map<number, number>>(new Map());

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));

        const timerId = timerMapRef.current.get(id);

        if (timerId) {
            window.clearTimeout(timerId);
            timerMapRef.current.delete(id);
        }
    }, []);

    // TODO: toast 노출 에니메이션 추가
    const showToast: ToastContextValue['showToast'] = useCallback(
        (message, options) => {
            const id = Date.now() + Math.floor(Math.random() * 1000);
            const nextToast: ToastItem = {
                id,
                label: message,
                durationMs: options?.durationMs ?? 2000,
                icon: options?.icon ?? true,
                textButton: options?.textButton,
                textButtonLabel: options?.textButtonLabel,
                onTextButtonClick: options?.onTextButtonClick,
            };

            setToasts((prev) => [...prev, nextToast]);

            const timerId = window.setTimeout(() => {
                removeToast(id);
            }, nextToast.durationMs);

            timerMapRef.current.set(id, timerId);
        },
        [removeToast]
    );

    const value = useMemo(
        () => ({
            toasts,
            showToast,
            removeToast,
        }),
        [removeToast, showToast, toasts]
    );

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within ToastProvider.');
    }

    return context;
};
