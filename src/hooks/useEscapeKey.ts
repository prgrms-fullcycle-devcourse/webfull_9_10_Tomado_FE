import { useEffect } from 'react';

interface UseEscapeKeyOptions {
    enabled?: boolean;
}

export const useEscapeKey = (onEscape: () => void, options: UseEscapeKeyOptions = {}) => {
    const { enabled = true } = options;

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onEscape]);
};
