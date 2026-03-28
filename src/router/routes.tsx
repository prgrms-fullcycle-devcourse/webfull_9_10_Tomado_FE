import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '@@/layout';

import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import { isAuthenticated } from './auth';

const Main = lazy(() => import('@/pages/Main'));
const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DailyLog = lazy(() => import('@/pages/DailyLog'));
const Retro = lazy(() => import('@/pages/Retro'));
const My = lazy(() => import('@/pages/My'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const BrandCenter = lazy(() => import('@/pages/BrandCenter'));

const withSuspense = (element: React.ReactNode) => <Suspense fallback={null}>{element}</Suspense>;

export const routes = [
    {
        element: <AppShell headerVariant='guest' />,
        children: [
            {
                path: '/',
                element: isAuthenticated ? <Navigate to='/main' replace /> : withSuspense(<Landing />),
            },
            {
                path: '/login',
                element: <PublicOnlyRoute>{withSuspense(<Login />)}</PublicOnlyRoute>,
            },
            {
                path: '/signup',
                element: <PublicOnlyRoute>{withSuspense(<Signup />)}</PublicOnlyRoute>,
            },
            {
                path: '/brandcenter',
                element: withSuspense(<BrandCenter />),
            },
        ],
    },
    {
        element: <AppShell headerVariant='default' />,
        children: [
            {
                path: '/main',
                element: <ProtectedRoute>{withSuspense(<Main />)}</ProtectedRoute>,
            },
            {
                path: '/dashboard',
                element: <ProtectedRoute>{withSuspense(<Dashboard />)}</ProtectedRoute>,
            },
            {
                path: '/dailylog',
                element: <ProtectedRoute>{withSuspense(<DailyLog />)}</ProtectedRoute>,
            },
            {
                path: '/retro',
                element: <ProtectedRoute>{withSuspense(<Retro />)}</ProtectedRoute>,
            },
            {
                path: '/my',
                element: <ProtectedRoute>{withSuspense(<My />)}</ProtectedRoute>,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to='/' replace />,
    },
];
