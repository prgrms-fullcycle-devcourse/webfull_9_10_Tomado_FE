import { useCallback, useEffect, useMemo, useState } from 'react';

import { getSupabaseImageUrl, listSupabaseImageFiles } from '@/lib/storage';

import { useFocusModeBackgroundStore } from './useFocusModeStore';

type SlideDirection = 'next' | 'prev';

interface BackgroundTransitionState {
    previousIndex: number;
    currentIndex: number;
    direction: SlideDirection;
    phase: 'prepare' | 'animate';
}

let focusModeBackgroundsPromise: Promise<string[]> | null = null;

const loadFocusModeBackgrounds = async () => {
    if (!focusModeBackgroundsPromise) {
        focusModeBackgroundsPromise = listSupabaseImageFiles('focus-mode/backgrounds').then((files) =>
            files.map(({ name }) => getSupabaseImageUrl(`focus-mode/backgrounds/${name}`))
        );
    }

    return focusModeBackgroundsPromise;
};

const getSlideClassName = (index: number, currentIndex: number, transition: BackgroundTransitionState | null) => {
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

        return direction === 'next' ? '-translate-x-full opacity-100 z-10' : 'translate-x-full opacity-100 z-10';
    }

    if (index === nextIndex) {
        if (phase === 'prepare') {
            return direction === 'next' ? 'translate-x-full opacity-100 z-20' : '-translate-x-full opacity-100 z-20';
        }

        return 'translate-x-0 opacity-100 z-20';
    }

    return direction === 'next' ? 'translate-x-full opacity-0 z-0' : '-translate-x-full opacity-0 z-0';
};

interface UseFocusModeBackgroundOptions {
    backgroundIndex?: number;
}

export const useFocusModeBackground = ({ backgroundIndex }: UseFocusModeBackgroundOptions = {}) => {
    const [focusModeBackgrounds, setFocusModeBackgrounds] = useState<string[]>([]);
    const persistedBackgroundIndex = useFocusModeBackgroundStore((state) => state.backgroundIndex);
    const setPersistedBackgroundIndex = useFocusModeBackgroundStore((state) => state.setBackgroundIndex);
    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(() => {
        if (focusModeBackgrounds.length === 0) {
            return 0;
        }

        return Math.min(backgroundIndex ?? persistedBackgroundIndex, focusModeBackgrounds.length - 1);
    });
    const [backgroundTransition, setBackgroundTransition] = useState<BackgroundTransitionState | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadBackgrounds = async () => {
            try {
                const backgrounds = await loadFocusModeBackgrounds();

                if (!cancelled) {
                    setFocusModeBackgrounds(backgrounds);
                }
            } catch (error) {
                console.error('집중모드 배경 목록을 불러오지 못했습니다.', error);
            }
        };

        void loadBackgrounds();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (focusModeBackgrounds.length === 0) {
            setCurrentBackgroundIndex(0);
            return;
        }

        setCurrentBackgroundIndex(
            Math.min(backgroundIndex ?? persistedBackgroundIndex, focusModeBackgrounds.length - 1)
        );
    }, [backgroundIndex, focusModeBackgrounds.length, persistedBackgroundIndex]);

    useEffect(() => {
        focusModeBackgrounds.forEach((src) => {
            const image = new Image();
            image.src = src;
        });
    }, [focusModeBackgrounds]);

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
        (direction: SlideDirection) => {
            if (focusModeBackgrounds.length <= 1 || backgroundTransition) {
                return;
            }

            const nextIndex =
                direction === 'next'
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
        [backgroundTransition, currentBackgroundIndex, focusModeBackgrounds.length, setPersistedBackgroundIndex]
    );

    const backgroundSlideClassNames = useMemo(() => {
        return focusModeBackgrounds.map((_, index) =>
            getSlideClassName(index, currentBackgroundIndex, backgroundTransition)
        );
    }, [backgroundTransition, currentBackgroundIndex, focusModeBackgrounds]);

    return {
        focusModeBackgrounds,
        backgroundSlideClassNames,
        currentBackgroundIndex,
        handlePrevBackground: useCallback(() => startBackgroundTransition('prev'), [startBackgroundTransition]),
        handleNextBackground: useCallback(() => startBackgroundTransition('next'), [startBackgroundTransition]),
        getBackgroundSlideClassName: (index: number) =>
            getSlideClassName(index, currentBackgroundIndex, backgroundTransition),
    };
};
