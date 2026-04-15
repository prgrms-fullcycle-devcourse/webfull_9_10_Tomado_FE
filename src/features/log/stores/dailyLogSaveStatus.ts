import { create } from 'zustand';

interface DailyLogSaveStatusState {
    backgroundSaveCount: number;
    isBackgroundSaving: boolean;
    beginBackgroundSave: () => void;
    endBackgroundSave: () => void;
}

export const useDailyLogSaveStatusStore = create<DailyLogSaveStatusState>((set) => ({
    backgroundSaveCount: 0,
    isBackgroundSaving: false,
    beginBackgroundSave: () =>
        set((state) => {
            const backgroundSaveCount = state.backgroundSaveCount + 1;

            return {
                backgroundSaveCount,
                isBackgroundSaving: backgroundSaveCount > 0,
            };
        }),
    endBackgroundSave: () =>
        set((state) => {
            const backgroundSaveCount = Math.max(0, state.backgroundSaveCount - 1);

            return {
                backgroundSaveCount,
                isBackgroundSaving: backgroundSaveCount > 0,
            };
        }),
}));
