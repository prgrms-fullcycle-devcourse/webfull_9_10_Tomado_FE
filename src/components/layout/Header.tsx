import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Icon, Menu } from '@@/ui';

export interface HeaderNavItem {
    label: string;
    href?: string;
    active?: boolean;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
    leftSlot?: ReactNode;
    centerSlot?: ReactNode;
    rightSlot?: ReactNode;
}

export interface GuestHeaderProps extends HTMLAttributes<HTMLElement> {
    signupHref?: string;
    loginHref?: string;
    brandHref?: string;
}

export interface DefaultHeaderProps extends HTMLAttributes<HTMLElement> {
    navItems?: HeaderNavItem[];
    utilitySlot?: ReactNode;
    profileSlot?: ReactNode;
    avatarSrc?: string;
    onMusicClick?: () => void;
    onFocusModeClick?: () => void;
    onLogoutClick?: () => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const headerClassName = 'sticky top-0 z-40 w-full bg-white/95 backdrop-blur';
const headerInnerClassName = 'mx-auto flex min-h-[60px] max-w-[1200px] items-center justify-between gap-6';
const headerSlotClassName = 'flex min-w-0 items-center';
const headerLeftClassName = 'flex-1 justify-start';
const headerCenterClassName = 'max-[600px]:hidden justify-center';
const headerRightClassName = 'justify-end gap-2.5';
const headerTrailingGroupClassName = 'flex items-center gap-6';

const logoClassName = 'h-8 w-auto shrink-0';
const navClassName = 'flex items-center gap-1';
const utilityActionsClassName = 'flex items-center gap-2.5';
const profileBadgeClassName =
    'inline-flex size-8 items-center justify-center rounded-full text-white shadow-sm hover:cursor-pointer';
const profileImageClassName = 'block size-8 bg-primary object-contain';
const profileMenuWrapperClassName = 'relative flex items-center';
const profileMenuLayerClassName = 'absolute top-[calc(100%+8px)] right-0 z-50 w-[200px]';

const getNavItemClassName = (active = false) => cx(active && 'text-primary font-semibold');

const defaultNavItems = [
    { label: '데일리로그', href: '/dailylog' },
    { label: '회고', href: '/retro' },
    { label: '대시보드', href: '/dashboard' },
] satisfies HeaderNavItem[];

export const Header = ({ leftSlot, centerSlot, rightSlot, className, ...props }: HeaderProps) => {
    return (
        <header {...props} className={cx(headerClassName, className)}>
            <div className='px-5'>
                <div className={headerInnerClassName}>
                    <div className={cx(headerSlotClassName, headerLeftClassName)}>{leftSlot}</div>
                    <div className={headerTrailingGroupClassName}>
                        <div className={cx(headerSlotClassName, headerCenterClassName)}>{centerSlot}</div>
                        <div className={cx(headerSlotClassName, headerRightClassName)}>{rightSlot}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export const DefaultHeader = ({
    navItems = defaultNavItems,
    utilitySlot,
    profileSlot,
    avatarSrc,
    onMusicClick,
    onFocusModeClick,
    onLogoutClick,
    ...props
}: DefaultHeaderProps) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isProfileMenuOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!profileMenuRef.current?.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isProfileMenuOpen]);

    return (
        <Header
            {...props}
            centerSlot={
                <nav aria-label='Primary navigation' className={navClassName}>
                    {navItems.map((item) => (
                        <Button
                            key={`${item.href ?? item.label}-${item.label}`}
                            className={getNavItemClassName(item.active)}
                            onClick={() => item.href && navigate(item.href)}
                            size='md'
                            variant='ghost'
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>
            }
            leftSlot={
                <Link aria-label='메인으로 이동' to='/main'>
                    <img alt='Toma:do' className={logoClassName} src='/logo.svg' />
                </Link>
            }
            rightSlot={
                <>
                    <div className={utilityActionsClassName}>
                        {utilitySlot ?? (
                            <>
                                <Button
                                    icon={<Icon color='color-primary' name='music_on' />}
                                    onClick={onMusicClick}
                                    size='md'
                                    variant='outline'
                                >
                                    배경음악
                                </Button>
                                <Button
                                    icon={<Icon color='color-primary' name='fullscreen_open' />}
                                    onClick={onFocusModeClick}
                                    size='md'
                                    variant='outline'
                                >
                                    집중모드
                                </Button>
                            </>
                        )}
                    </div>
                    {profileSlot ?? (
                        <div className={profileMenuWrapperClassName} ref={profileMenuRef}>
                            <button
                                aria-expanded={isProfileMenuOpen}
                                aria-haspopup='menu'
                                className={profileBadgeClassName}
                                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                type='button'
                            >
                                {avatarSrc ? (
                                    <img alt='사용자 아바타' className={profileImageClassName} src={avatarSrc} />
                                ) : (
                                    <Icon name='avatar' size={32} />
                                )}
                            </button>
                            <div className={profileMenuLayerClassName}>
                                <Menu
                                    inline
                                    items={[
                                        {
                                            label: '마이페이지',
                                            onClick: () => {
                                                setIsProfileMenuOpen(false);
                                                navigate('/my');
                                            },
                                        },
                                        {
                                            label: '로그아웃',
                                            onClick: () => {
                                                setIsProfileMenuOpen(false);
                                                onLogoutClick?.();
                                            },
                                            tone: 'danger',
                                        },
                                    ]}
                                    onClose={() => setIsProfileMenuOpen(false)}
                                    open={isProfileMenuOpen}
                                />
                            </div>
                        </div>
                    )}
                </>
            }
        />
    );
};

export const GuestHeader = ({
    signupHref = '/signup',
    loginHref = '/login',
    brandHref = '/brandcenter',
    ...props
}: GuestHeaderProps) => {
    const navigate = useNavigate();

    return (
        <Header
            {...props}
            leftSlot={
                <Link aria-label='메인으로 이동' to='/main'>
                    <img alt='Toma:do' className={logoClassName} src='/logo.svg' />
                </Link>
            }
            centerSlot={
                <div>
                    <Button onClick={() => navigate(brandHref)} size='md' variant='ghost'>
                        브랜드센터
                    </Button>
                </div>
            }
            rightSlot={
                <div className={utilityActionsClassName}>
                    <Button onClick={() => navigate(signupHref)} size='md' variant='outline'>
                        회원가입
                    </Button>
                    <Button onClick={() => navigate(loginHref)} size='md'>
                        로그인
                    </Button>
                </div>
            }
        />
    );
};
