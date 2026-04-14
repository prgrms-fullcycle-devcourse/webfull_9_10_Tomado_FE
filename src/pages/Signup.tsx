import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getSignupFieldState,
    mapRegisterResponseToAuthUser,
    type SignupFormValues,
    useAuthStore,
    useSignupForm,
} from '@@@/auth';
import { useCheckLoginId, useRegister } from '@/api/generated/auth/auth';
import { Input } from '@@/form';
import { Container } from '@@/layout';
import { Button } from '@@/ui';

type SignupFieldKey = 'userId' | 'nickname' | 'password' | 'passwordConfirm';

interface SignupFieldMeta {
    label: string;
    placeholder: string;
    type?: 'text' | 'password';
}

const pageClassName = 'flex h-[calc(100vh-60px)] w-full items-center justify-center overflow-hidden';
const cardClassName = 'w-full max-w-[600px] rounded-[32px] bg-white px-20 py-24 shadow-1';
const cardInnerClassName = 'mx-auto flex w-full max-w-[380px] flex-col gap-10';
const titleClassName = 'text-center text-3xl font-bold text-black';
const fieldsClassName = 'flex flex-col gap-6';
const errorMessageClassName = 'text-center text-sm text-danger';
const signupFormId = 'signup-form';

const signupFieldMetaMap: Record<SignupFieldKey, SignupFieldMeta> = {
    userId: {
        label: '아이디',
        placeholder: '아이디를 입력해 주세요',
        type: 'text',
    },
    nickname: {
        label: '닉네임',
        placeholder: '어떤 별명으로 불리고 싶으신가요?',
        type: 'text',
    },
    password: {
        label: '비밀번호',
        placeholder: '비밀번호를 입력해 주세요',
        type: 'password',
    },
    passwordConfirm: {
        label: '비밀번호 확인',
        placeholder: '비밀번호를 다시 한 번 입력해 주세요',
        type: 'password',
    },
};

export default function Signup() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const registerMutation = useRegister();
    const { values, validations, isFormValid, setFieldValue: setSignupFieldValue, getSubmitPayload } = useSignupForm();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [debouncedUserId, setDebouncedUserId] = useState(values.userId);
    const userIdInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        userIdInputRef.current?.focus();
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedUserId(values.userId.trim());
        }, 400);

        return () => window.clearTimeout(timeoutId);
    }, [values.userId]);

    const shouldCheckLoginId = validations.userId.isValid && debouncedUserId.length > 0;
    const { data: loginIdCheckResult, isFetching: isCheckingLoginId } = useCheckLoginId(
        { login_id: debouncedUserId },
        { query: { enabled: shouldCheckLoginId, retry: false } }
    );

    const isUserIdCheckPending =
        validations.userId.isValid && values.userId.trim().length > 0 && values.userId.trim() !== debouncedUserId;
    const isUserIdAvailable = shouldCheckLoginId && loginIdCheckResult?.available === true;
    const isUserIdTaken = shouldCheckLoginId && loginIdCheckResult?.available === false;
    const isUserIdChecking = isUserIdCheckPending || isCheckingLoginId;

    const userIdGuide = useMemo(() => {
        if (!values.userId) {
            return validations.userId;
        }

        if (!validations.userId.isValid) {
            return validations.userId;
        }

        if (isUserIdChecking) {
            return {
                isValid: false,
                helperText: '아이디 사용 가능 여부를 확인하고 있어요',
            };
        }

        if (isUserIdTaken) {
            return {
                isValid: false,
                helperText: '이미 사용 중인 아이디예요',
            };
        }

        if (isUserIdAvailable) {
            return {
                isValid: true,
                helperText: '사용 가능한 아이디예요',
            };
        }

        return validations.userId;
    }, [isUserIdAvailable, isUserIdChecking, isUserIdCheckPending, isUserIdTaken, validations.userId, values.userId]);
    const userIdIconName = !values.userId || isUserIdChecking ? undefined : userIdGuide.isValid ? 'check' : 'error';
    const userIdInputState = isUserIdChecking
        ? 'default'
        : getSignupFieldState(userIdGuide.isValid, Boolean(values.userId));

    const setFieldValue = (field: keyof SignupFormValues, value: string) => {
        setSubmitError(null);
        setSignupFieldValue(field, value);
    };

    const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        try {
            const response = await registerMutation.mutateAsync({
                data: getSubmitPayload(),
            });

            login(mapRegisterResponseToAuthUser(response));
            navigate('/main', { replace: true });
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
        }
    };

    const isPending = registerMutation.isPending;
    const canSubmit = isFormValid && isUserIdAvailable && !isCheckingLoginId && !isUserIdCheckPending;

    return (
        <main>
            <Container>
                <div className={pageClassName}>
                    <section className={cardClassName}>
                        <div className={cardInnerClassName}>
                            <h1 className={titleClassName}>회원가입</h1>

                            <form className={fieldsClassName} id={signupFormId} onSubmit={handleSubmit}>
                                <Input
                                    autoComplete='username'
                                    helperText={userIdGuide.helperText}
                                    iconName={userIdIconName}
                                    label={signupFieldMetaMap.userId.label}
                                    name='userId'
                                    onChange={(event) => setFieldValue('userId', event.target.value)}
                                    placeholder={signupFieldMetaMap.userId.placeholder}
                                    ref={userIdInputRef}
                                    state={userIdInputState}
                                    type={signupFieldMetaMap.userId.type}
                                    value={values.userId}
                                />

                                <Input
                                    autoComplete='nickname'
                                    helperText={validations.nickname.helperText}
                                    iconName={
                                        values.nickname ? (validations.nickname.isValid ? 'check' : 'error') : undefined
                                    }
                                    label={signupFieldMetaMap.nickname.label}
                                    name='nickname'
                                    onChange={(event) => setFieldValue('nickname', event.target.value)}
                                    placeholder={signupFieldMetaMap.nickname.placeholder}
                                    state={getSignupFieldState(validations.nickname.isValid, Boolean(values.nickname))}
                                    type={signupFieldMetaMap.nickname.type}
                                    value={values.nickname}
                                />

                                <Input
                                    autoComplete='new-password'
                                    helperText={validations.password.helperText}
                                    iconName={
                                        values.password ? (validations.password.isValid ? 'check' : 'error') : undefined
                                    }
                                    label={signupFieldMetaMap.password.label}
                                    name='password'
                                    onChange={(event) => setFieldValue('password', event.target.value)}
                                    placeholder={signupFieldMetaMap.password.placeholder}
                                    state={getSignupFieldState(validations.password.isValid, Boolean(values.password))}
                                    type={signupFieldMetaMap.password.type}
                                    value={values.password}
                                />

                                <Input
                                    autoComplete='new-password'
                                    helperText={validations.passwordConfirm.helperText}
                                    iconName={
                                        values.passwordConfirm
                                            ? validations.passwordConfirm.isValid
                                                ? 'check'
                                                : 'error'
                                            : undefined
                                    }
                                    label={signupFieldMetaMap.passwordConfirm.label}
                                    name='passwordConfirm'
                                    onChange={(event) => setFieldValue('passwordConfirm', event.target.value)}
                                    placeholder={signupFieldMetaMap.passwordConfirm.placeholder}
                                    state={getSignupFieldState(
                                        validations.passwordConfirm.isValid,
                                        Boolean(values.passwordConfirm)
                                    )}
                                    type={signupFieldMetaMap.passwordConfirm.type}
                                    value={values.passwordConfirm}
                                />
                            </form>

                            {submitError ? <p className={errorMessageClassName}>{submitError}</p> : null}

                            <Button
                                disabled={!canSubmit || isPending}
                                form={signupFormId}
                                fullWidth
                                size='lg'
                                type='submit'
                            >
                                {isPending ? '가입 중...' : '회원가입'}
                            </Button>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    );
}
