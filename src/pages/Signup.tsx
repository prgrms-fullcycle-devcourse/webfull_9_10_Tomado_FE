import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getSignupFieldState,
    mapRegisterResponseToAuthUser,
    type SignupFormValues,
    useAuthStore,
    useSignupForm,
} from '@@@/auth';
import { useRegister } from '@/api/generated/auth/auth';
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

    const setFieldValue = (field: keyof SignupFormValues, value: string) => {
        setSubmitError(null);
        setSignupFieldValue(field, value);
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            return;
        }

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

    return (
        <main>
            <Container>
                <div className={pageClassName}>
                    <section className={cardClassName}>
                        <div className={cardInnerClassName}>
                            <h1 className={titleClassName}>회원가입</h1>

                            <div className={fieldsClassName}>
                                <Input
                                    helperText={validations.userId.helperText}
                                    iconName={
                                        values.userId ? (validations.userId.isValid ? 'check' : 'error') : undefined
                                    }
                                    label={signupFieldMetaMap.userId.label}
                                    onChange={(event) => setFieldValue('userId', event.target.value)}
                                    placeholder={signupFieldMetaMap.userId.placeholder}
                                    state={getSignupFieldState(validations.userId.isValid, Boolean(values.userId))}
                                    type={signupFieldMetaMap.userId.type}
                                    value={values.userId}
                                />

                                <Input
                                    helperText={validations.nickname.helperText}
                                    iconName={
                                        values.nickname ? (validations.nickname.isValid ? 'check' : 'error') : undefined
                                    }
                                    label={signupFieldMetaMap.nickname.label}
                                    onChange={(event) => setFieldValue('nickname', event.target.value)}
                                    placeholder={signupFieldMetaMap.nickname.placeholder}
                                    state={getSignupFieldState(validations.nickname.isValid, Boolean(values.nickname))}
                                    type={signupFieldMetaMap.nickname.type}
                                    value={values.nickname}
                                />

                                <Input
                                    helperText={validations.password.helperText}
                                    iconName={
                                        values.password ? (validations.password.isValid ? 'check' : 'error') : undefined
                                    }
                                    label={signupFieldMetaMap.password.label}
                                    onChange={(event) => setFieldValue('password', event.target.value)}
                                    placeholder={signupFieldMetaMap.password.placeholder}
                                    state={getSignupFieldState(validations.password.isValid, Boolean(values.password))}
                                    type={signupFieldMetaMap.password.type}
                                    value={values.password}
                                />

                                <Input
                                    helperText={validations.passwordConfirm.helperText}
                                    iconName={
                                        values.passwordConfirm
                                            ? validations.passwordConfirm.isValid
                                                ? 'check'
                                                : 'error'
                                            : undefined
                                    }
                                    label={signupFieldMetaMap.passwordConfirm.label}
                                    onChange={(event) => setFieldValue('passwordConfirm', event.target.value)}
                                    placeholder={signupFieldMetaMap.passwordConfirm.placeholder}
                                    state={getSignupFieldState(
                                        validations.passwordConfirm.isValid,
                                        Boolean(values.passwordConfirm)
                                    )}
                                    type={signupFieldMetaMap.passwordConfirm.type}
                                    value={values.passwordConfirm}
                                />
                            </div>

                            {submitError ? <p className={errorMessageClassName}>{submitError}</p> : null}

                            <Button disabled={!isFormValid || isPending} fullWidth onClick={handleSubmit} size='lg'>
                                {isPending ? '가입 중...' : '회원가입'}
                            </Button>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    );
}
