import { useState, useRef, useEffect, useCallback } from 'react';
import { useDirectionKey, useGlobalKeyboardShortcuts, useToast } from '@/hooks';
import { useFocusModeBackground } from './useFocusModeBackground';
import type { TDirectionShortcut, IFocusModeProps } from './types';

export const useFocusModeController = ({
    open = true,
    backgroundIndex,
    onClose,
}: Pick<IFocusModeProps, 'open' | 'backgroundIndex' | 'onClose'>) => {
    const [isTodoExpanded, setIsTodoExpanded] = useState(false);
    const { showToast } = useToast();

    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (!open) {
            wasOpenRef.current = false;
            return;
        }

        if (!wasOpenRef.current) {
            showToast({
                message: '집중모드를 종료하려면 Esc 키를 누르세요',
                iconName: 'noti_focus',
                duration: 5000,
            });
        }

        wasOpenRef.current = open;
    }, [open, showToast]);

    // INFO: 배경 슬라이드 컨트롤
    const { backgroundSlideClassNames, handlePrevBackground, handleNextBackground } = useFocusModeBackground({
        backgroundIndex,
    });

    // INFO: 투두 패널 토글
    const handleTodoExpand = useCallback(() => setIsTodoExpanded(true), []);
    const handleTodoCollapse = useCallback(() => setIsTodoExpanded(false), []);
    const handleToggleTodo = useCallback(() => setIsTodoExpanded((prev) => !prev), []);

    const handleDirection = useCallback(
        (direction: TDirectionShortcut) => {
            if (direction === 'left') {
                handlePrevBackground();
                return;
            }

            if (direction === 'right') {
                handleNextBackground();
                return;
            }

            if (direction === 'up') {
                handleTodoCollapse();
                return;
            }

            if (direction === 'down') {
                handleTodoExpand();
            }
        },
        [handlePrevBackground, handleNextBackground, handleTodoCollapse, handleTodoExpand]
    );

    // INFO: 키보드 단축키
    useGlobalKeyboardShortcuts({ enabled: open, onEscape: onClose });
    useDirectionKey(handleDirection, { enabled: open });

    return {
        isTodoExpanded,
        handleToggleTodo,
        backgroundSlideClassNames,
        handlePrevBackground,
        handleNextBackground,
    };
};
