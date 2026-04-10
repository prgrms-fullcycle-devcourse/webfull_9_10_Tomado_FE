import { useMemo, useState } from 'react';

import { useLogin } from '@/api/generated/auth/auth';
import { useAuthStore } from './useAuthStore';
import { mapLoginResponseToAuthUser } from './api';
import type { LoginFormValues, LoginRequest } from './types';

const validateLoginField = (value: string) => value.trim().length > 0;
const demoLoginId = import.meta.env.VITE_DEMO_I?.trim() ?? '';
const demoLoginPassword = import.meta.env.VITE_DEMO_P?.trim() ?? '';

export const useLoginForm = () => {
    const login = useAuthStore((state) => state.login);
    const [values, setValues] = useState<LoginFormValues>({
        userId: '',
        password: '',
    });
    const [showAuthError, setShowAuthError] = useState(false);

    const isUserIdFilled = useMemo(() => validateLoginField(values.userId), [values.userId]);
    const isPasswordFilled = useMemo(() => validateLoginField(values.password), [values.password]);
    const isFormValid = isUserIdFilled && isPasswordFilled;
    const canLoginAsDemo = demoLoginId.length > 0 && demoLoginPassword.length > 0;
    const loginMutation = useLogin();

    const setFieldValue = (field: keyof LoginFormValues, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));

        if (showAuthError) {
            setShowAuthError(false);
        }
    };

    const getSubmitPayload = (): LoginRequest => ({
        login_id: values.userId,
        password: values.password,
    });

    const submit = async () => {
        if (!isFormValid) {
            return false;
        }

        try {
            const response = await loginMutation.mutateAsync({
                data: getSubmitPayload(),
            });

            login(mapLoginResponseToAuthUser(response));
            setShowAuthError(false);

            return true;
        } catch {
            setShowAuthError(true);
            return false;
        }
    };

    const loginAsDemo = async () => {
        if (!canLoginAsDemo) {
            setShowAuthError(true);
            return false;
        }

        setValues({
            userId: demoLoginId,
            password: demoLoginPassword,
        });

        try {
            const response = await loginMutation.mutateAsync({
                data: {
                    login_id: demoLoginId,
                    password: demoLoginPassword,
                },
            });

            login(mapLoginResponseToAuthUser(response));
            setShowAuthError(false);

            return true;
        } catch {
            setShowAuthError(true);
            return false;
        }
    };

    return {
        values,
        isFormValid,
        canLoginAsDemo,
        isPending: loginMutation.isPending,
        showAuthError,
        setFieldValue,
        getSubmitPayload,
        submit,
        loginAsDemo,
    };
};
