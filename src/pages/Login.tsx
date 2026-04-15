import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoginForm } from '@@@/auth';
import { Input } from '@@/form';
import { Container } from '@@/layout';
import { Button } from '@@/ui';

const pageClassName = 'flex h-[calc(100vh-60px)] w-full items-center justify-center overflow-hidden';
const cardClassName = 'w-full max-w-[600px] rounded-[32px] bg-white px-20 py-24 shadow-1';
const cardInnerClassName = 'mx-auto flex w-full max-w-[380px] flex-col gap-10';
const titleClassName = 'text-center text-3xl font-bold text-black';
const fieldsClassName = 'flex flex-col gap-6';
const errorMessageClassName = 'text-center text-sm text-danger';

export default function Login() {
    const navigate = useNavigate();
    const { values, isFormValid, canLoginAsDemo, isPending, showAuthError, setFieldValue, submit, loginAsDemo } =
        useLoginForm();
    const userIdInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        userIdInputRef.current?.focus();
    }, []);

    const handleSubmit = async () => {
        if (await submit()) {
            navigate('/main', { replace: true });
        }
    };

    const handleDemoLogin = async () => {
        if (await loginAsDemo()) {
            navigate('/main', { replace: true });
        }
    };

    return (
        <main>
            <Container>
                <div className={pageClassName}>
                    <section className={cardClassName}>
                        <form
                            className={cardInnerClassName}
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleSubmit();
                            }}
                        >
                            <h1 className={titleClassName}>로그인</h1>

                            <div className={fieldsClassName}>
                                <Input
                                    ref={userIdInputRef}
                                    label='아이디'
                                    onChange={(event) => setFieldValue('userId', event.target.value)}
                                    placeholder='아이디를 입력해 주세요'
                                    state={showAuthError ? 'error' : 'default'}
                                    value={values.userId}
                                />

                                <Input
                                    label='비밀번호'
                                    onChange={(event) => setFieldValue('password', event.target.value)}
                                    placeholder='비밀번호를 입력해 주세요'
                                    state={showAuthError ? 'error' : 'default'}
                                    type='password'
                                    value={values.password}
                                />
                            </div>

                            <div className='flex flex-col gap-4'>
                                {showAuthError ? (
                                    <p className={errorMessageClassName}>아이디 또는 비밀번호를 확인해 주세요</p>
                                ) : null}

                                <Button disabled={!isFormValid || isPending} fullWidth size='lg' type='submit'>
                                    {isPending ? '로그인 중...' : '로그인'}
                                </Button>

                                <Button
                                    disabled={isPending || !canLoginAsDemo}
                                    fullWidth
                                    onClick={() => void handleDemoLogin()}
                                    size='lg'
                                    type='button'
                                    variant='outline'
                                >
                                    데모 계정으로 시작
                                </Button>
                            </div>
                        </form>
                    </section>
                </div>
            </Container>
        </main>
    );
}
