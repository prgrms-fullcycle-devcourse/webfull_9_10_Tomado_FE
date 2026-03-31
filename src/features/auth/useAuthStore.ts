import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from './types';

interface AuthStoreState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (user) => {
                set({
                    isAuthenticated: true,
                    user,
                });
            },
            logout: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                });
            },
        }),
        {
            name: 'tomado-auth',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);
