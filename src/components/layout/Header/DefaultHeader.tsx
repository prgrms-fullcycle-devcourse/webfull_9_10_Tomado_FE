import { Button } from '@@/ui/Button';
import { Icon } from '@@/ui/Icon';
import { Header } from './Header';
import {
    getNavItemClassName,
    logoClassName,
    navClassName,
    profileBadgeClassName,
    profileImageClassName,
    utilityActionsClassName,
} from './Hedaer.styles';
import type { DefaultHeaderProps } from './types';

const defaultNavItems = [
    { label: '데일리로그', href: '/dailylog' },
    { label: '회고', href: '/retro' },
    { label: '대시보드', href: '/dashboard' },
];

export const DefaultHeader = ({
    navItems = defaultNavItems,
    utilitySlot,
    profileSlot,
    avatarSrc,
    ...props
}: DefaultHeaderProps) => {
    return (
        <Header
            {...props}
            centerSlot={
                <nav aria-label='Primary navigation' className={navClassName}>
                    {navItems.map((item) => (
                        <Button
                            key={`${item.href ?? item.label}-${item.label}`}
                            className={getNavItemClassName(item.active)}
                            onClick={() => item.href && window.location.assign(item.href)}
                            size='md'
                            variant='ghost'
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>
            }
            leftSlot={
                <a aria-label='메인으로 이동' href='/main'>
                    <img alt='Toma:do' className={logoClassName} src='/logo.svg' />
                </a>
            }
            rightSlot={
                <>
                    <div className={utilityActionsClassName}>
                        {utilitySlot ?? (
                            <>
                                <Button
                                    icon={<Icon color='color-primary' name='music_on' />}
                                    size='md'
                                    variant='outline'
                                >
                                    배경음악
                                </Button>
                                <Button
                                    icon={<Icon color='color-primary' name='fullscreen_open' />}
                                    size='md'
                                    variant='outline'
                                >
                                    집중모드
                                </Button>
                            </>
                        )}
                    </div>
                    {profileSlot ?? (
                        <span className={`${profileBadgeClassName}`}>
                            {avatarSrc ? (
                                <img alt='사용자 아바타' className={profileImageClassName} src={avatarSrc} />
                            ) : (
                                <Icon name='avatar' size={32} />
                            )}
                        </span>
                    )}
                </>
            }
        />
    );
};
