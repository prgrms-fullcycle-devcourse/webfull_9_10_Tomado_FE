import { RouterProvider } from 'react-router-dom';

import { AuthSessionBridge } from '@@@/auth';
import { routes } from '@/routes/routes';
import { TimerTicker } from '@@@/timer';
import { ModalRenderer, ToastList } from '@@/ui';

export default function App() {
    return (
        <>
            <AuthSessionBridge>
                <RouterProvider router={routes} />
            </AuthSessionBridge>
            <TimerTicker />
            <ToastList />
            <ModalRenderer />
        </>
    );
}
