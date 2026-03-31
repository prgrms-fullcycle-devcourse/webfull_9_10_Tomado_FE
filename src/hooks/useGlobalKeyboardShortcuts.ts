import { useEffect } from 'react';

interface UseGlobalKeyboardShortcutsOptions {
    enabled?: boolean;
    onSpace?: () => void;
    onShiftSpace?: () => void;
    onEscape?: () => void;
}

const isEditableElement = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
};

export const useGlobalKeyboardShortcuts = ({
    enabled = true,
    onSpace,
    onShiftSpace,
    onEscape,
}: UseGlobalKeyboardShortcutsOptions) => {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }

            if (isEditableElement(event.target)) {
                return;
            }

            if (event.key === 'Escape') {
                onEscape?.();
                return;
            }

            if (event.code !== 'Space') {
                return;
            }

            event.preventDefault();

            if (event.shiftKey) {
                onShiftSpace?.();
                return;
            }

            onSpace?.();
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [enabled, onEscape, onShiftSpace, onSpace]);
};
