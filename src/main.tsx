import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from '@/router';
import { ToastProvider } from '@/hooks';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ToastProvider>
            <AppRouter />
        </ToastProvider>
    </StrictMode>
);
