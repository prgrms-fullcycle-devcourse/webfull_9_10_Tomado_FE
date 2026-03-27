import type { RefObject } from 'react';
import { useEffect } from 'react';

const isEditableElement = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
};

export const useInputFocus = (inputRef: RefObject<HTMLInputElement | null>, focusKeys: readonly string[]) => {
    useEffect(() => {
        const normalizedFocusKeys = focusKeys.map((key) => key.toLowerCase());

        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }

            if (isEditableElement(event.target)) {
                return;
            }

            const pressedKey = event.key.toLowerCase();

            if (!normalizedFocusKeys.includes(pressedKey)) {
                return;
            }

            event.preventDefault();
            inputRef.current?.focus();
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [focusKeys, inputRef]);
};
