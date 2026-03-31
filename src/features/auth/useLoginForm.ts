import { useMemo, useState } from 'react';

import type { LoginFormValues, LoginRequest } from './types';

const validateLoginField = (value: string) => value.trim().length > 0;

export const useLoginForm = () => {
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

        setShowAuthError(true);
        return true;
    };

    return {
        values,
        isFormValid,
        showAuthError,
        setFieldValue,
        getSubmitPayload,
        submit,
    };
};
