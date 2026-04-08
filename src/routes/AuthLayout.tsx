import { Suspense, lazy, useCallback, useEffect, useState } from 'react';

import { AuthHeader } from '@/components/layout/Header';
import { DEMO_AUTH_USER, useAuthStore } from '@/features/auth';
import { useGlobalKeyboardShortcuts, useModal } from '@/hooks';
import {
    FocusMode,
    TimerProgressBar,
    useTimerMetadata,
    useTimerNotifications,
    useTimerSessionController,
    useTimerStore,
} from '@/features/timer';
import { useLogout } from '@/api/generated/auth/auth';
import { useGetMySettings } from '@/api/generated/users/users';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { formatTimeParts } from '@/utils/timeUtils';

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
    const isDemoSession = authUser?.id === DEMO_AUTH_USER.id;
    const settingsQuery = useGetMySettings({ query: { enabled: !isDemoSession } });
    const { mutateAsync: logoutFromServer } = useLogout();
    const isAuth = useAuthStore((state) => state.isAuth);
    const logout = useAuthStore((state) => state.logout);
    const shouldShowTimerProgressBar = location.pathname !== '/main' && !isFocusMode;
    const { handleToggleTimer, handleRequestStopTimer } = useTimerSessionController();

    const isRunning = useTimerStore((state) => state.isRunning);
    const sessionType = useTimerStore((state) => state.sessionType);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const setDurations = useTimerStore((state) => state.setDurations);

    const timerParts = formatTimeParts(remainingSeconds);

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

    useEffect(() => {
        if (!settingsQuery.data) return;
        setDurations(
            {
                focusSeconds: (settingsQuery.data.focus_min ?? 25) * 60,
                shortBreakSeconds: (settingsQuery.data.short_break_min ?? 5) * 60,
                longBreakSeconds: (settingsQuery.data.long_break_min ?? 15) * 60,
                sessionsPerSet: settingsQuery.data.sessions_per_set ?? 4,
            },
            { resetCurrent: true }
        );
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
                    // 서버 로그아웃이 실패해도 클라이언트 인증 상태는 제거합니다.
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
            {shouldShowTimerProgressBar ? <TimerProgressBar /> : null}
            <Outlet context={{ handleToggleTimer, handleRequestStopTimer }} />
            <FocusMode
                open={isFocusMode}
                onMusicClick={handleMusicClick}
                onClose={() => setIsFocusMode(false)}
                handleToggleTimer={handleToggleTimer}
                handleRequestStopTimer={handleRequestStopTimer}
            />
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
