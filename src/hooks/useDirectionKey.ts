import { useEffect } from 'react';

interface UseDirectionKeyOptions {
    enabled?: boolean;
}

const isEditableElement = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
};

export const useDirectionKey = (
    onDirection: (direction: 'left' | 'right' | 'up' | 'down') => void,
    options: UseDirectionKeyOptions = {}
) => {
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

            switch (event.key) {
                case 'ArrowLeft':
                    onDirection('left');
                    break;
                case 'ArrowRight':
                    onDirection('right');
                    break;
                case 'ArrowUp':
                    onDirection('up');
                    break;
                case 'ArrowDown':
                    onDirection('down');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onDirection]);
};
