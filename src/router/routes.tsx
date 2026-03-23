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

export const routes = [
    {
        element: <AppShell />,
        children: [
            {
                path: '/',
                element: (
                    <ProtectedRoute>
                        <Landing />
                    </ProtectedRoute>
                ),
            },
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
        path: '/brandcenter',
        element: <BrandCenter />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '*',
        element: <Navigate to='/' replace />,
    },
];
