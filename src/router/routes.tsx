import { Navigate } from 'react-router-dom';
import { AppShell } from '@@/layout';
import { Main, Landing, Dashboard, DailyLog, Retro, My, Login, Signup, BrandCenter } from '@/pages';

import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import { isAuthenticated } from './auth';

export const routes = [
    {
        element: <AppShell headerVariant='guest' />,
        children: [
            {
                path: '/',
                element: isAuthenticated ? <Navigate to='/main' replace /> : <Landing />,
            },
            {
                path: '/login',
                element: (
                    <PublicOnlyRoute>
                        <Login />
                    </PublicOnlyRoute>
                ),
            },
            {
                path: '/signup',
                element: (
                    <PublicOnlyRoute>
                        <Signup />
                    </PublicOnlyRoute>
                ),
            },
            {
                path: '/brandcenter',
                element: <BrandCenter />,
            },
        ],
    },
    {
        element: <AppShell headerVariant='default' />,
        children: [
            {
                path: '/main',
                element: (
                    <ProtectedRoute>
                        <Main />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dashboard',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dailylog',
                element: (
                    <ProtectedRoute>
                        <DailyLog />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/retro',
                element: (
                    <ProtectedRoute>
                        <Retro />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/my',
                element: (
                    <ProtectedRoute>
                        <My />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to='/' replace />,
    },
];
