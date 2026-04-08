import { create } from 'zustand';

import type { AuthUser } from './types';

interface AuthStoreState {
    /** 앱 로드 시 GET /users/me 로 세션 복구가 끝났는지 (라우트 가드 전에 사용) */
    sessionHydrated: boolean;
    isAuth: boolean;
    user: AuthUser | null;
    setSessionHydrated: (value: boolean) => void;
    /** 로그인·회원가입 성공 시 서버가 준 user만 저장합니다. 토큰은 httpOnly 쿠키로만 전달됩니다. */
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
    sessionHydrated: false,
    isAuth: false,
    user: null,
    setSessionHydrated: (value) => {
        set({ sessionHydrated: value });
    },
    login: (user) => {
        set({
            isAuth: true,
            user,
        });
    },
    logout: () => {
        set({
            isAuth: false,
            user: null,
        });
    },
}));
