import avatarFallbackSrc from '@/assets/avatar.svg';
import { Button } from '@/components/ui/Button';
import { Header } from './Header';
import {
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

const MusicNoteIcon = () => {
    return (
        <svg aria-hidden='true' className='size-full' fill='none' viewBox='0 0 16 16'>
            <path
                d='M10.666 2.667V9.5a1.833 1.833 0 1 1-1-1.63V4.333l4-1.166v5.166a1.833 1.833 0 1 1-1-1.63V2.667l-2 .583Z'
                fill='currentColor'
            />
        </svg>
    );
};

const FocusIcon = () => {
    return (
        <svg aria-hidden='true' className='size-full' fill='none' viewBox='0 0 16 16'>
            <path
                d='M3.333 10.667V12.667H5.333M10.667 3.333H12.667V5.333M10.667 12.667H12.667V10.667M3.333 5.333V3.333H5.333M4 12L12 4'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
            />
        </svg>
    );
};

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
                            className={item.active ? 'text-primary' : undefined}
                            onClick={() => item.href && window.location.assign(item.href)}
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
                                <Button icon={<MusicNoteIcon />} variant='outline'>
                                    배경음악
                                </Button>
                                <Button icon={<FocusIcon />} variant='outline'>
                                    집중모드
                                </Button>
                            </>
                        )}
                    </div>
                    {profileSlot ?? (
                        <span className={profileBadgeClassName}>
                            <img
                                alt='사용자 아바타'
                                className={profileImageClassName}
                                src={avatarSrc || avatarFallbackSrc}
                            />
                        </span>
                    )}
                </>
            }
        />
    );
};
