import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { IFocusModeBackgroundStoreState } from './types';

export const useFocusModeBackgroundStore = create<IFocusModeBackgroundStoreState>()(
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
