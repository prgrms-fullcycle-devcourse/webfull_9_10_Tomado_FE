import { useEffect, type ReactNode } from 'react';

import { getMyProfile } from '@/api/generated/users/users';
import { stopBgmPlayback } from '@/features/settings';

import { mapUserDtoToAuthUser } from './api';
import { useAuthStore } from './useAuthStore';

/**
 * 새로고침 후에도 쿠키 세션을 기준으로 인증 상태를 맞춥니다.
 * httpOnly 토큰은 JS에서 읽을 수 없으므로 로컬 저장 대신 GET /users/me 로 복구합니다.
 */
export function AuthSessionBridge({ children }: { children: ReactNode }) {
    const sessionHydrated = useAuthStore((s) => s.sessionHydrated);
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);
    const setSessionHydrated = useAuthStore((s) => s.setSessionHydrated);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const user = await getMyProfile();
                if (cancelled) return;
                login(mapUserDtoToAuthUser(user));
            } catch {
                if (cancelled) return;
                stopBgmPlayback();
                logout();
            } finally {
                if (!cancelled) {
                    setSessionHydrated(true);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [login, logout, setSessionHydrated]);

    if (!sessionHydrated) {
        return null;
    }

    return <>{children}</>;
}
