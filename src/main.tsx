import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from '@/router';
import { ToastProvider } from '@/hooks';
import { TimerTicker } from '@@@/timer';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ToastProvider>
            <TimerTicker />
            <AppRouter />
        </ToastProvider>
    </StrictMode>
);
