import { Button } from '@/components/ui/Button';
import { Header } from './Header';
import { logoClassName, utilityActionsClassName } from './Hedaer.styles';
import type { GuestHeaderProps } from './types';

export const GuestHeader = ({
    signupHref = '/signup',
    loginHref = '/login',
    brandHref = '/brandcenter',
    ...props
}: GuestHeaderProps) => {
    return (
        <Header
            {...props}
            leftSlot={
                <a aria-label='메인으로 이동' href='/main'>
                    <img alt='Toma:do' className={logoClassName} src='/logo.svg' />
                </a>
            }
            centerSlot={
                <div>
                    <Button size='md' onClick={() => window.location.assign(brandHref)} variant='ghost'>
                        브랜드센터
                    </Button>
                </div>
            }
            rightSlot={
                <div className={utilityActionsClassName}>
                    <Button size='md' onClick={() => window.location.assign(signupHref)} variant='outline'>
                        회원가입
                    </Button>
                    <Button size='md' onClick={() => window.location.assign(loginHref)}>
                        로그인
                    </Button>
                </div>
            }
        />
    );
};
