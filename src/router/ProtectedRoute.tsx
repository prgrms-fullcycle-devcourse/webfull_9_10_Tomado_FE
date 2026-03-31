import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@@@/auth';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return <>{children}</>;
}
