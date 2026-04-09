import { GuestHeader } from '@/components/layout/Header';
import { useAuthStore } from '@/features/auth';
import { Navigate, Outlet } from 'react-router-dom';

export function GuestLayout() {
    const isAuth = useAuthStore((state) => state.isAuth);

    if (isAuth) {
        return <Navigate to='/main' replace />;
    }

    return (
        <>
            <GuestHeader />
            <Outlet />
        </>
    );
}
