import { useCallback, useEffect, useMemo, useState } from 'react';

import { getSupabaseImageUrl } from '@/lib/storage';

import { useFocusModeBackgroundStore } from './useFocusModeStore';
import type { IBackgroundTransitionState, TDirectionShortcut } from './types';

const backgroundFileNames = [
    'focusModeBG_01.png',
    'focusModeBG_02.png',
    'focusModeBG_03.png',
    'focusModeBG_04.png',
    'focusModeBG_05.png',
    'focusModeBG_06.png',
    'focusModeBG_07.png',
    'focusModeBG_08.png',
] as const;

export const focusModeBackgrounds = backgroundFileNames.map((fileName) =>
    getSupabaseImageUrl(`focus-mode/backgrounds/${fileName}`)
);

const getSlideClassName = (index: number, currentIndex: number, transition: IBackgroundTransitionState | null) => {
    if (!transition) {
        if (index === currentIndex) {
            return 'translate-x-0 opacity-100 z-10';
        }

        return index < currentIndex ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0';
    }

    const { previousIndex, currentIndex: nextIndex, direction, phase } = transition;

    if (index === previousIndex) {
        if (phase === 'prepare') {
            return 'translate-x-0 opacity-100 z-10';
        }

        return direction === 'right' ? '-translate-x-full opacity-100 z-10' : 'translate-x-full opacity-100 z-10';
    }

    if (index === nextIndex) {
        if (phase === 'prepare') {
            return direction === 'right' ? 'translate-x-full opacity-100 z-20' : '-translate-x-full opacity-100 z-20';
        }

        return 'translate-x-0 opacity-100 z-20';
    }

    return direction === 'right' ? 'translate-x-full opacity-0 z-0' : '-translate-x-full opacity-0 z-0';
};

interface UseFocusModeBackgroundOptions {
    backgroundIndex?: number;
}

export const useFocusModeBackground = ({ backgroundIndex }: UseFocusModeBackgroundOptions = {}) => {
    const persistedBackgroundIndex = useFocusModeBackgroundStore((state) => state.backgroundIndex);
    const setPersistedBackgroundIndex = useFocusModeBackgroundStore((state) => state.setBackgroundIndex);
    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(() => {
        if (focusModeBackgrounds.length === 0) {
            return 0;
        }

        return Math.min(backgroundIndex ?? persistedBackgroundIndex, focusModeBackgrounds.length - 1);
    });
    const [backgroundTransition, setBackgroundTransition] = useState<IBackgroundTransitionState | null>(null);

    useEffect(() => {
        if (focusModeBackgrounds.length === 0) {
            setCurrentBackgroundIndex(0);
            return;
        }

        setCurrentBackgroundIndex(
            Math.min(backgroundIndex ?? persistedBackgroundIndex, focusModeBackgrounds.length - 1)
        );
    }, [backgroundIndex, persistedBackgroundIndex]);

    useEffect(() => {
        focusModeBackgrounds.forEach((src) => {
            const image = new Image();
            image.src = src;
        });
    }, []);

    useEffect(() => {
        if (backgroundTransition?.phase !== 'prepare') {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            setBackgroundTransition((prev) => (prev ? { ...prev, phase: 'animate' } : prev));
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [backgroundTransition]);

    useEffect(() => {
        if (backgroundTransition?.phase !== 'animate') {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setBackgroundTransition(null);
        }, 550);

        return () => window.clearTimeout(timeoutId);
    }, [backgroundTransition]);

    const startBackgroundTransition = useCallback(
        (direction: TDirectionShortcut) => {
            if (focusModeBackgrounds.length <= 1 || backgroundTransition) {
                return;
            }

            const nextIndex =
                direction === 'right'
                    ? currentBackgroundIndex === focusModeBackgrounds.length - 1
                        ? 0
                        : currentBackgroundIndex + 1
                    : currentBackgroundIndex === 0
                      ? focusModeBackgrounds.length - 1
                      : currentBackgroundIndex - 1;

            setBackgroundTransition({
                previousIndex: currentBackgroundIndex,
                currentIndex: nextIndex,
                direction,
                phase: 'prepare',
            });
            setCurrentBackgroundIndex(nextIndex);
            setPersistedBackgroundIndex(nextIndex);
        },
        [backgroundTransition, currentBackgroundIndex, setPersistedBackgroundIndex]
    );

    const backgroundSlideClassNames = useMemo(() => {
        return focusModeBackgrounds.map((_, index) =>
            getSlideClassName(index, currentBackgroundIndex, backgroundTransition)
        );
    }, [backgroundTransition, currentBackgroundIndex]);

    return {
        focusModeBackgrounds,
        backgroundSlideClassNames,
        currentBackgroundIndex,
        handlePrevBackground: useCallback(() => startBackgroundTransition('left'), [startBackgroundTransition]),
        handleNextBackground: useCallback(() => startBackgroundTransition('right'), [startBackgroundTransition]),
        getBackgroundSlideClassName: (index: number) =>
            getSlideClassName(index, currentBackgroundIndex, backgroundTransition),
    };
};
