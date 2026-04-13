import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

import { queryClient } from '@/api/queryClient';
import { getGetMySettingsQueryKey, useGetMySettings, useUpdateMySettings } from '@/api/generated/users/users';
import type { UserSettings } from '@/api/generated/model';
import { useToast } from '@/hooks';

const MIN_TIMER_SETTING = 1;

const initialTimerSettings = {
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 30,
};

const getNextStepDecreaseValue = (value: number) => {
    if (value <= MIN_TIMER_SETTING) {
        return MIN_TIMER_SETTING;
    }

    if (value <= 5) {
        return MIN_TIMER_SETTING;
    }

    const remainder = value % 5;

    if (remainder === 0) {
        return value - 5;
    }

    return value - remainder;
};

const getNextStepIncreaseValue = (value: number) => {
    if (value < 5) {
        return 5;
    }

    const remainder = value % 5;

    if (remainder === 0) {
        return value + 5;
    }

    return value + (5 - remainder);
};

const getNextNumericSettingValue = (value: string) => {
    if (value === '') {
        return null;
    }

    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
        return null;
    }

    return Math.max(MIN_TIMER_SETTING, Math.floor(parsedValue));
};

export const useMySettings = () => {
    const [focusTime, setFocusTime] = useState(0);
    const [shortBreakTime, setShortBreakTime] = useState(0);
    const [longBreakTime, setLongBreakTime] = useState(0);
    const [todoToggle, setTodoToggle] = useState(true);

    const { showToast } = useToast();
    const { data: settings } = useGetMySettings();
    const { mutateAsync: updateSettings, isPending: isSettingsSaving } = useUpdateMySettings();

    useEffect(() => {
        if (!settings) {
            return;
        }

        setFocusTime(settings.focus_min || initialTimerSettings.focusTime);
        setShortBreakTime(settings.short_break_min || initialTimerSettings.shortBreakTime);
        setLongBreakTime(settings.long_break_min || initialTimerSettings.longBreakTime);
        setTodoToggle(settings.auto_carry_todo ?? true);
    }, [settings]);

    const syncSettingsCache = useCallback((nextSettings: UserSettings) => {
        queryClient.setQueryData(getGetMySettingsQueryKey(), nextSettings);
    }, []);

    const hasSettingsChanged = useMemo(() => {
        if (!settings) return false;

        return !(
            focusTime === settings.focus_min &&
            shortBreakTime === settings.short_break_min &&
            longBreakTime === settings.long_break_min
        );
    }, [focusTime, longBreakTime, settings, shortBreakTime]);

    const isSettingsSaveDisabled = !hasSettingsChanged || isSettingsSaving;

    const handleSaveSettings = useCallback(
        async (optimisticSettings?: UserSettings) => {
            if (!settings || isSettingsSaving) {
                return;
            }

            const previousSettings = queryClient.getQueryData<UserSettings>(getGetMySettingsQueryKey()) ?? settings;
            const nextSettings =
                optimisticSettings ??
                ({
                    ...previousSettings,
                    focus_min: focusTime,
                    short_break_min: shortBreakTime,
                    long_break_min: longBreakTime,
                } satisfies UserSettings);

            syncSettingsCache(nextSettings);

            try {
                const savedSettings = await updateSettings({
                    data: {
                        focus_min: nextSettings.focus_min,
                        short_break_min: nextSettings.short_break_min,
                        long_break_min: nextSettings.long_break_min,
                    },
                });

                syncSettingsCache(savedSettings);
                showToast({ message: '설정이 저장되었어요', iconName: 'check', duration: 3000 });
            } catch {
                syncSettingsCache(previousSettings);
                setFocusTime(previousSettings.focus_min || initialTimerSettings.focusTime);
                setShortBreakTime(previousSettings.short_break_min || initialTimerSettings.shortBreakTime);
                setLongBreakTime(previousSettings.long_break_min || initialTimerSettings.longBreakTime);
                showToast({ message: '설정 저장에 실패했습니다', iconName: 'error', duration: 3000 });
            }
        },
        [
            focusTime,
            isSettingsSaving,
            longBreakTime,
            settings,
            shortBreakTime,
            showToast,
            syncSettingsCache,
            updateSettings,
        ]
    );

    const handleResetSettings = useCallback(() => {
        if (isSettingsSaving || !settings) {
            return;
        }

        const nextSettings: UserSettings = {
            ...settings,
            focus_min: initialTimerSettings.focusTime,
            short_break_min: initialTimerSettings.shortBreakTime,
            long_break_min: initialTimerSettings.longBreakTime,
        };

        setFocusTime(initialTimerSettings.focusTime);
        setShortBreakTime(initialTimerSettings.shortBreakTime);
        setLongBreakTime(initialTimerSettings.longBreakTime);

        void handleSaveSettings(nextSettings);
    }, [handleSaveSettings, isSettingsSaving, settings]);

    const handleAutoCarryTodo = useCallback(async () => {
        const newValue = !todoToggle;
        setTodoToggle(newValue);

        try {
            const savedSettings = await updateSettings({
                data: {
                    auto_carry_todo: newValue,
                },
            });

            syncSettingsCache(savedSettings);
        } catch {
            setTodoToggle(!newValue);
            showToast({ message: '투두 설정 변경에 실패했습니다', iconName: 'error', duration: 3000 });
        }
    }, [showToast, syncSettingsCache, todoToggle, updateSettings]);

    const createSettingInputChangeHandler = useCallback(
        (setter: (value: number) => void) => (event: ChangeEvent<HTMLInputElement>) => {
            const nextValue = getNextNumericSettingValue(event.target.value);

            if (nextValue === null) {
                return;
            }

            setter(nextValue);
        },
        []
    );

    const timer = {
        focus: {
            value: focusTime,
            canDecrease: focusTime > MIN_TIMER_SETTING,
            onChange: createSettingInputChangeHandler(setFocusTime),
            decrease: () => setFocusTime(getNextStepDecreaseValue(focusTime)),
            increase: () => setFocusTime(getNextStepIncreaseValue(focusTime)),
        },
        shortBreak: {
            value: shortBreakTime,
            canDecrease: shortBreakTime > MIN_TIMER_SETTING,
            onChange: createSettingInputChangeHandler(setShortBreakTime),
            decrease: () => setShortBreakTime(getNextStepDecreaseValue(shortBreakTime)),
            increase: () => setShortBreakTime(getNextStepIncreaseValue(shortBreakTime)),
        },
        longBreak: {
            value: longBreakTime,
            canDecrease: longBreakTime > MIN_TIMER_SETTING,
            onChange: createSettingInputChangeHandler(setLongBreakTime),
            decrease: () => setLongBreakTime(getNextStepDecreaseValue(longBreakTime)),
            increase: () => setLongBreakTime(getNextStepIncreaseValue(longBreakTime)),
        },
    };

    return {
        timer,
        todo: {
            autoCarry: todoToggle,
            onToggle: handleAutoCarryTodo,
        },
        meta: {
            isSaving: isSettingsSaving,
            isSaveDisabled: isSettingsSaveDisabled,
        },
        actions: {
            reset: handleResetSettings,
            save: handleSaveSettings,
        },
    };
};
