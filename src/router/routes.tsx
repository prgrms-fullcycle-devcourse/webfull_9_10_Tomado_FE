import { Navigate } from 'react-router-dom';

import AppShell from '@@/layout/AppShell';

import Main from '@/pages/Main';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import DailyLog from '@/pages/DailyLog';
import Retro from '@/pages/Retro';
import My from '@/pages/My';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import BrandCenter from '@/pages/BrandCenter';

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
