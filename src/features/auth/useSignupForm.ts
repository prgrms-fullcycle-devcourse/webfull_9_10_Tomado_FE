import { useMemo, useState } from 'react';

import type { SignupFieldValidation, SignupFormValues, SignupRequest } from './types';

const userIdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/;
const nicknameRegex = /^[A-Za-z0-9가-힣]{2,20}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const validateUserId = (value: string): SignupFieldValidation => {
    if (!value) return { isValid: false, helperText: '' };

    return {
        isValid: userIdRegex.test(value),
        helperText: userIdRegex.test(value) ? '' : '영문과 숫자 조합으로 4~20자여야 해요',
    };
};

const validateNickname = (value: string): SignupFieldValidation => {
    if (!value) return { isValid: false, helperText: '' };

    return {
        isValid: nicknameRegex.test(value),
        helperText: nicknameRegex.test(value) ? '' : '닉네임은 2~20자여야 해요',
    };
};

const validatePassword = (value: string): SignupFieldValidation => {
    if (!value) return { isValid: false, helperText: '' };

    return {
        isValid: passwordRegex.test(value),
        helperText: passwordRegex.test(value) ? '' : '영문과 숫자, 특수문자 조합으로 8자 이상이어야 해요',
    };
};

const validatePasswordConfirm = (password: string, value: string): SignupFieldValidation => {
    if (!value) return { isValid: false, helperText: '' };

    return {
        isValid: password === value,
        helperText: password === value ? '' : '비밀번호를 올바르게 입력해 주세요',
    };
};

export const getSignupFieldState = (isValid: boolean, hasValue: boolean) => {
    if (!hasValue) return 'default' as const;

    return isValid ? ('success' as const) : ('error' as const);
};

export const useSignupForm = () => {
    const [values, setValues] = useState<SignupFormValues>({
        userId: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
    });

    const userIdValidation = useMemo(() => validateUserId(values.userId), [values.userId]);
    const nicknameValidation = useMemo(() => validateNickname(values.nickname), [values.nickname]);
    const passwordValidation = useMemo(() => validatePassword(values.password), [values.password]);
    const passwordConfirmValidation = useMemo(
        () => validatePasswordConfirm(values.password, values.passwordConfirm),
        [values.password, values.passwordConfirm]
    );

    const isFormValid =
        userIdValidation.isValid &&
        nicknameValidation.isValid &&
        passwordValidation.isValid &&
        passwordConfirmValidation.isValid;

    const setFieldValue = (field: keyof SignupFormValues, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const getSubmitPayload = (): SignupRequest => ({
        login_id: values.userId,
        password: values.password,
        nickname: values.nickname,
    });

    return {
        values,
        validations: {
            userId: userIdValidation,
            nickname: nicknameValidation,
            password: passwordValidation,
            passwordConfirm: passwordConfirmValidation,
        },
        isFormValid,
        setFieldValue,
        getSubmitPayload,
    };
};
