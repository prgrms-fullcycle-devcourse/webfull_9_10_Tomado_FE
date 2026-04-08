import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthTokens, AuthUser } from './types';

interface AuthStoreState {
    isAuth: boolean;
    user: AuthUser | null;
    tokens: AuthTokens | null;
    login: (user: AuthUser, tokens?: AuthTokens | null) => void;
    updateUser: (updates: Partial<AuthUser>) => void;
    setTokens: (tokens: AuthTokens | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            isAuth: false,
            user: null,
            tokens: null,
            login: (user, tokens = null) => {
                // INFO: 로그인 성공 시 사용자 정보와 토큰을 함께 저장합니다.
                set({
                    isAuth: true,
                    user,
                    tokens,
                });
            },
            updateUser: (updates) => {
                set((state) => ({
                    ...state,
                    user: state.user ? { ...state.user, ...updates } : state.user,
                }));
            },
            setTokens: (tokens) => {
                // INFO: refresh 성공 후에는 사용자 정보는 유지하고 토큰만 교체합니다.
                set((state) => ({
                    ...state,
                    tokens,
                    isAuth: Boolean(tokens) && Boolean(state.user),
                }));
            },
            logout: () => {
                // INFO: 인증 상태를 완전히 비워 이후 요청이 Bearer 토큰 없이 나가도록 만듭니다.
                set({
                    isAuth: false,
                    user: null,
                    tokens: null,
                });
            },
        }),
        {
            name: 'tomado-auth',
            // INFO: 새로고침 후에도 로그인 세션을 복원할 수 있도록 인증 정보만 persist합니다.
            partialize: (state) => ({
                isAuth: state.isAuth,
                user: state.user,
                tokens: state.tokens,
            }),
        }
    )
);
