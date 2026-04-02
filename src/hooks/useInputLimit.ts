import { useCallback, useRef, useState } from 'react';
import { useToast } from './useToast';

interface UseInputLimitOptions {
    maxChars?: number;
    toastMessage?: string;
}

const truncateByLimit = ({ value, maxChars }: { value: string; maxChars?: number }) => {
    let result = '';

    for (const char of value) {
        if (typeof maxChars === 'number' && result.length >= maxChars) {
            break;
        }

        result = `${result}${char}`;
    }

    return result;
};

export const useInputLimit = ({ maxChars, toastMessage }: UseInputLimitOptions) => {
    const { showToast } = useToast();
    const [value, setValue] = useState('');
    const [hasError, setHasError] = useState(false);
    const hasExceededRef = useRef(false);

    const setLimitedValue = useCallback(
        (nextValue: string) => {
            const truncatedValue = truncateByLimit({ value: nextValue, maxChars });
            const exceeded = truncatedValue !== nextValue;

            setHasError(exceeded);
            setValue(truncatedValue);

            if (exceeded && toastMessage && !hasExceededRef.current) {
                showToast({ iconName: 'warning', message: toastMessage, duration: 1000 });
            }

            if (!exceeded) {
                hasExceededRef.current = false;
                return truncatedValue;
            }

            hasExceededRef.current = true;

            return truncatedValue;
        },
        [maxChars, showToast, toastMessage]
    );

    return {
        value,
        hasError,
        setLimitedValue,
    };
};
