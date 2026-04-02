import { useMemo, useState } from 'react';

import { usePostApiV1AuthLogin } from '@/api/generated/auth/auth';
import { useAuthStore } from './useAuthStore';
import { mapLoginResponseToAuthTokens, mapLoginResponseToAuthUser } from './api';
import { DEMO_AUTH_USER, DEMO_LOGIN_CREDENTIALS } from './types';
import type { LoginFormValues, LoginRequest } from './types';

const validateLoginField = (value: string) => value.trim().length > 0;

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
    const loginMutation = usePostApiV1AuthLogin();

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

        if (values.userId === DEMO_LOGIN_CREDENTIALS.userId && values.password === DEMO_LOGIN_CREDENTIALS.password) {
            login(DEMO_AUTH_USER);
            setShowAuthError(false);
            return true;
        }

        try {
            const response = await loginMutation.mutateAsync({
                data: getSubmitPayload(),
            });

            login(mapLoginResponseToAuthUser(response), mapLoginResponseToAuthTokens(response));
            setShowAuthError(false);

            return true;
        } catch {
            setShowAuthError(true);
            return false;
        }
    };

    const loginAsDemo = () => {
        setValues({
            userId: DEMO_LOGIN_CREDENTIALS.userId,
            password: DEMO_LOGIN_CREDENTIALS.password,
        });
        setShowAuthError(false);
        login(DEMO_AUTH_USER);
        return true;
    };

    return {
        values,
        isFormValid,
        isPending: loginMutation.isPending,
        showAuthError,
        setFieldValue,
        getSubmitPayload,
        submit,
        loginAsDemo,
    };
};
