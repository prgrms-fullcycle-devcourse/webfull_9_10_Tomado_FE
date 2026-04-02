import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { GuestLayout } from './GuestLayout';
import { AuthLayout } from './AuthLayout';

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

export const routes = createBrowserRouter([
    {
        element: <GuestLayout />,
        children: [
            { path: '/', element: withSuspense(<Landing />) },
            { path: '/login', element: withSuspense(<Login />) },
            { path: '/signup', element: withSuspense(<Signup />) },
            { path: '/brandcenter', element: withSuspense(<BrandCenter />) },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: '/main', element: withSuspense(<Main />) },
            { path: '/dashboard', element: withSuspense(<Dashboard />) },
            { path: '/dailylog', element: withSuspense(<DailyLog />) },
            { path: '/retro', element: withSuspense(<Retro />) },
            { path: '/my', element: withSuspense(<My />) },
        ],
    },
    {
        path: '*',
        element: <Navigate to='/' replace />,
    },
]);
