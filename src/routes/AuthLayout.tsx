import { Suspense, lazy, useCallback, useState } from 'react';

import { AuthHeader } from '@/components/layout/Header';
import { useAuthStore } from '@/features/auth';
import { useGlobalKeyboardShortcuts, useModal } from '@/hooks';
import {
    FocusMode,
    TimerProgressBar,
    useTimerMetadata,
    useTimerNotifications,
    useTimerSession,
} from '@/features/timer';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

const LazyBgmPlayerLayer = lazy(() =>
    import('@/features/settings/components/BgmPlayerLayer').then((module) => ({
        default: module.BgmPlayerLayer,
    }))
);

export function AuthLayout() {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [shouldLoadBgmPlayer, setShouldLoadBgmPlayer] = useState(false);
    const [pendingBgmToggle, setPendingBgmToggle] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isAuth = useAuthStore((state) => state.isAuth);
    const logout = useAuthStore((state) => state.logout);
    const { showModal } = useModal();
    const shouldShowTimerProgressBar = location.pathname !== '/main' && !isFocusMode;

    const { isRunning, sessionType, timerParts } = useTimerSession();

    useTimerMetadata({
        isRunning,
        sessionType,
        minutes: timerParts.minutes,
        seconds: timerParts.seconds,
    });

    useTimerNotifications();

    useGlobalKeyboardShortcuts({
        onShiftSpace: () => {
            setIsFocusMode(true);
        },

        onSpace: () => {
            setShouldLoadBgmPlayer(true);
            setPendingBgmToggle(true);
        },
    });

    const handleMusicClick = useCallback(() => {
        setShouldLoadBgmPlayer(true);
        setPlayerModalOpen(true);
    }, []);

    const handleLogoutClick = useCallback(() => {
        showModal({
            title: '로그아웃 하시겠어요?',
            description: '로그아웃하면 다시 로그인해야 해요. 그래도 로그아웃 하시겠어요?',
            tone: 'danger',
            confirmLabel: '로그아웃',
            onConfirm: () => {
                logout();
                navigate('/', { replace: true });
            },
        });
    }, [logout, navigate, showModal]);

    if (!isAuth) {
        return <Navigate to='/' replace />;
    }

    return (
        <>
            <AuthHeader
                onFocusModeClick={() => setIsFocusMode(true)}
                onLogoutClick={handleLogoutClick}
                onMusicClick={handleMusicClick}
            />
            {shouldShowTimerProgressBar ? <TimerProgressBar /> : null}
            <Outlet />
            <FocusMode open={isFocusMode} onMusicClick={handleMusicClick} onClose={() => setIsFocusMode(false)} />
            {shouldLoadBgmPlayer ? (
                <Suspense fallback={null}>
                    <LazyBgmPlayerLayer
                        open={playerModalOpen}
                        tone={isFocusMode ? 'focusmode' : 'default'}
                        requestToggle={pendingBgmToggle}
                        onClose={() => {
                            setPlayerModalOpen(false);
                        }}
                        onToggleHandled={() => setPendingBgmToggle(false)}
                    />
                </Suspense>
            ) : null}
        </>
    );
}
