import { Suspense, lazy, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { DefaultHeader, GuestHeader } from '.';
import { useGlobalKeyboardShortcuts, useToast } from '@/hooks';
import { Modal, Toast } from '@@/ui';
import { useAuthStore } from '@@@/auth';
import { FocusMode, TimerProgressBar, useTimerMetadata, useTimerNotifications, useTimerSession } from '@@@/timer';

const LazyBgmPlayerLayer = lazy(() =>
    import('@@@/settings/components/BgmPlayerLayer').then((module) => ({
        default: module.BgmPlayerLayer,
    }))
);

export type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [shouldLoadBgmPlayer, setShouldLoadBgmPlayer] = useState(false);
    const [pendingBgmToggle, setPendingBgmToggle] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const { toasts } = useToast();
    const { isRunning, sessionType, timerParts, stopConfirmOpen, handleCloseStopConfirm, handleConfirmStopTimer } =
        useTimerSession();

    useTimerMetadata({
        isRunning,
        sessionType,
        minutes: timerParts.minutes,
        seconds: timerParts.seconds,
    });
    useTimerNotifications();

    useGlobalKeyboardShortcuts({
        enabled: headerVariant === 'default',
        onShiftSpace: () => {
            setIsFocusMode(true);
        },
        onSpace: () => {
            setShouldLoadBgmPlayer(true);
            setPendingBgmToggle(true);
        },
    });

    const handleMusicClick = () => {
        setShouldLoadBgmPlayer(true);
        setPlayerModalOpen(true);
    };

    const handleFocusModeOpen = () => {
        setIsFocusMode(true);
    };

    const handleLogoutModalOpen = () => {
        setLogoutConfirmOpen(true);
    };

    const handleLogoutModalClose = () => {
        setLogoutConfirmOpen(false);
    };

    const handleConfirmLogout = () => {
        logout();
        setLogoutConfirmOpen(false);
        navigate('/', { replace: true });
    };

    const shouldShowTimerProgressBar = headerVariant === 'default' && location.pathname !== '/main' && !isFocusMode;

    return (
        <>
            {headerVariant === 'guest' ? (
                <GuestHeader />
            ) : (
                <DefaultHeader
                    onFocusModeClick={handleFocusModeOpen}
                    onLogoutClick={handleLogoutModalOpen}
                    onMusicClick={handleMusicClick}
                />
            )}

            {shouldShowTimerProgressBar ? <TimerProgressBar /> : null}

            <Outlet />

            <FocusMode open={isFocusMode} onMusicClick={handleMusicClick} onClose={() => setIsFocusMode(false)} />

            <Modal
                open={logoutConfirmOpen}
                tone='danger'
                title='로그아웃 하시겠어요?'
                description={
                    <>
                        로그아웃하면 다시 로그인해야 해요.
                        <br />
                        그래도 로그아웃 하시겠어요?
                    </>
                }
                onClose={handleLogoutModalClose}
                confirmLabel='로그아웃'
                onCancel={handleLogoutModalClose}
                onConfirm={handleConfirmLogout}
            />

            <Modal
                open={stopConfirmOpen}
                tone='danger'
                title='집중 세션 중단'
                description={
                    <>
                        세션 중단 시 기록은 저장되지 않아요
                        <br />
                        그래도 중단 하시겠어요?
                    </>
                }
                onClose={handleCloseStopConfirm}
                confirmLabel='중단하기'
                onCancel={handleCloseStopConfirm}
                onConfirm={handleConfirmStopTimer}
            />

            {shouldLoadBgmPlayer ? (
                <Suspense fallback={null}>
                    <LazyBgmPlayerLayer
                        open={playerModalOpen}
                        tone={isFocusMode ? 'focusmode' : 'default'}
                        requestToggle={pendingBgmToggle}
                        onClose={() => setPlayerModalOpen(false)}
                        onToggleHandled={() => setPendingBgmToggle(false)}
                    />
                </Suspense>
            ) : null}

            {toasts.length ? (
                <div className='pointer-events-none fixed top-20 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2'>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            className='pointer-events-auto'
                            icon={toast.icon}
                            label={toast.label}
                            textButton={toast.textButton}
                            textButtonLabel={toast.textButtonLabel}
                            onTextButtonClick={toast.onTextButtonClick}
                        />
                    ))}
                </div>
            ) : null}
        </>
    );
}
