import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

// TODO: 나중에 store/auth 상태로 교체
const isAuthenticated = true;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>;
}
