import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return <>{children}</>;
}
