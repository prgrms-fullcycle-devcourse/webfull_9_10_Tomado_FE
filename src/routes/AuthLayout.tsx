import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useLogout } from '@/api/generated/auth/auth';
import { useGetMySettings } from '@/api/generated/users/users';
import { AuthHeader } from '@@/layout';
import { DEMO_AUTH_USER, useAuthStore } from '@@@/auth';
import { useGlobalKeyboardShortcuts, useModal } from '@/hooks';
import {
    FocusMode,
    TimerProgressBar,
    useTimerMetadata,
    useTimerNotifications,
    useTimerSessionController,
    useTimerSessionView,
    useTimerStore,
    type ITimerDurations,
} from '@@@/timer';

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
    const { showModal } = useModal();

    const authUser = useAuthStore((state) => state.user);
    const isAuth = useAuthStore((state) => state.isAuth);
    const logout = useAuthStore((state) => state.logout);
    const isDemoSession = authUser?.id === DEMO_AUTH_USER.id;

    const { mutateAsync: logoutFromServer } = useLogout();
    const settingsQuery = useGetMySettings({ query: { enabled: !isDemoSession && isAuth } });

    const setDurations = useTimerStore((state) => state.setDurations);
    const timerSession = useTimerSessionView();
    const { handleToggleTimer, handleRequestStopTimer } = useTimerSessionController();

    const shouldShowTimerProgressBar = location.pathname !== '/main' && !isFocusMode;

    useTimerMetadata({
        isRunning: timerSession.isRunning,
        sessionType: timerSession.sessionType,
        minutes: timerSession.timerParts.minutes,
        seconds: timerSession.timerParts.seconds,
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

    useEffect(() => {
        if (!settingsQuery.data) return;

        const data = settingsQuery.data;
        const next: Partial<ITimerDurations> = {
            focusSeconds: (data.focus_min ?? 25) * 60,
            shortBreakSeconds: (data.short_break_min ?? 5) * 60,
            longBreakSeconds: (data.long_break_min ?? 15) * 60,
            sessionsPerSet: data.sessions_per_set ?? 4,
        };

        setDurations(next, { resetCurrent: true });
    }, [settingsQuery.data, setDurations]);

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
            onConfirm: async () => {
                try {
                    await logoutFromServer();
                } catch {
                    // 서버 로그아웃 실패해도 클라이언트는 로그아웃 처리
                } finally {
                    logout();
                    navigate('/', { replace: true });
                }
            },
        });
    }, [logout, logoutFromServer, navigate, showModal]);

    if (!isAuth) return <Navigate to='/' replace />;

    return (
        <>
            <AuthHeader
                onFocusModeClick={() => setIsFocusMode(true)}
                onLogoutClick={handleLogoutClick}
                onMusicClick={handleMusicClick}
            />
            {shouldShowTimerProgressBar ? <TimerProgressBar timerSession={timerSession} /> : null}
            <Outlet context={{ timerSession, handleToggleTimer, handleRequestStopTimer }} />
            <FocusMode
                open={isFocusMode}
                onMusicClick={handleMusicClick}
                onClose={() => setIsFocusMode(false)}
                timerSession={timerSession}
                handleToggleTimer={handleToggleTimer}
                handleRequestStopTimer={handleRequestStopTimer}
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
        </>
    );
}
