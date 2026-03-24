import { Navigate } from 'react-router-dom';

import { isAuthenticated } from './auth';

type PublicOnlyRouteProps = {
    children: React.ReactNode;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
    if (isAuthenticated) {
        return <Navigate to='/main' replace />;
    }

    return <>{children}</>;
}
