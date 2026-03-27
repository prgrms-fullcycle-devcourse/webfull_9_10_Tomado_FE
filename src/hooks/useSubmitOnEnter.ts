import { useCallback } from 'react';
import type { KeyboardEventHandler } from 'react';

interface UseSubmitOnEnterOptions {
    onSubmit: () => void;
    disabled?: boolean;
    ignoreComposing?: boolean;
}

export const useSubmitOnEnter = <T extends HTMLElement>({
    onSubmit,
    disabled = false,
    ignoreComposing = true,
}: UseSubmitOnEnterOptions) => {
    const onKeyDown = useCallback<KeyboardEventHandler<T>>(
        (event) => {
            if (disabled) {
                return;
            }

            // INFO: IME(한/중/일 입력기) 조합 중 Enter는 "제출"이 아니라 "문자 확정" 의도인 경우가 많다.
            // INFO: isComposing은 표준 플래그이고, nativeEvent.key === 'Process' 는 일부 브라우저/환경에서 조합 입력을 나타내는 호환 신호다.
            // REF: https://onlydev.tistory.com/199
            const isComposing = event.nativeEvent.isComposing || event.nativeEvent.key === 'Process';

            if (ignoreComposing && isComposing) {
                return;
            }

            if (event.key !== 'Enter') {
                return;
            }

            // INFO: Enter의 기본 동작(예: form submit)을 막고, 전달받은 submit 액션만 명시적으로 실행한다.
            event.preventDefault();
            onSubmit();
        },
        [disabled, ignoreComposing, onSubmit]
    );

    return onKeyDown;
};
