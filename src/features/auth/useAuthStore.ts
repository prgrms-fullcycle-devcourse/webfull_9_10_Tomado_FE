import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from './types';

interface AuthStoreState {
    isAuth: boolean;
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            isAuth: false,
            user: null,
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
        }),
        {
            name: 'tomado-auth',
            partialize: (state) => ({
                isAuth: state.isAuth,
                user: state.user,
            }),
        }
    )
);
