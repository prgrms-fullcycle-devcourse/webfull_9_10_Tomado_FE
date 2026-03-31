import { useMemo, useState } from 'react';

import { useAuthStore } from './useAuthStore';
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

    const submit = () => {
        if (!isFormValid) {
            return false;
        }

        if (values.userId === DEMO_LOGIN_CREDENTIALS.userId && values.password === DEMO_LOGIN_CREDENTIALS.password) {
            login(DEMO_AUTH_USER);
            setShowAuthError(false);
            return true;
        }

        setShowAuthError(true);
        return false;
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
        showAuthError,
        setFieldValue,
        getSubmitPayload,
        submit,
        loginAsDemo,
    };
};
