import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@@@/auth';

type PublicOnlyRouteProps = {
    children: React.ReactNode;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to='/main' replace />;
    }

    return <>{children}</>;
}
