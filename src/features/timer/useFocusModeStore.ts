import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FocusModeBackgroundStoreState {
    backgroundIndex: number;
    setBackgroundIndex: (index: number) => void;
}

export const useFocusModeBackgroundStore = create<FocusModeBackgroundStoreState>()(
    persist(
        (set) => ({
            backgroundIndex: 0,
            setBackgroundIndex: (index) => set({ backgroundIndex: index }),
        }),
        {
            name: 'focus-mode-background',
            partialize: (state) => ({
                backgroundIndex: state.backgroundIndex,
            }),
        }
    )
);
