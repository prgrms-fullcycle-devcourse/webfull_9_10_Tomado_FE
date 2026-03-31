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
    const { values, isFormValid, showAuthError, setFieldValue, submit } = useLoginForm();

    return (
        <main>
            <Container>
                <div className={pageClassName}>
                    <section className={cardClassName}>
                        <div className={cardInnerClassName}>
                            <h1 className={titleClassName}>로그인</h1>

                            <div className={fieldsClassName}>
                                <Input
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

                                <Button disabled={!isFormValid} fullWidth onClick={submit} size='lg'>
                                    로그인
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    );
}
