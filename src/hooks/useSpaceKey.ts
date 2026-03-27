import { useEffect } from 'react';

interface UseSpaceKeyOptions {
    enabled?: boolean;
}

const isEditableElement = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
};

export const useSpaceKey = (onSpace: () => void, options: UseSpaceKeyOptions = {}) => {
    const { enabled = true } = options;

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }

            if (isEditableElement(event.target)) {
                return;
            }

            if (event.code !== 'Space') {
                return;
            }

            event.preventDefault();
            onSpace();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onSpace]);
};
