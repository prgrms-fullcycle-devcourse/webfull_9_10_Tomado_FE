import { RouterProvider } from 'react-router-dom';

import { routes } from '@/routes/routes';
import { TimerTicker } from '@@@/timer';
import { ModalRenderer, ToastList } from '@@/ui';

export default function App() {
    return (
        <>
            <RouterProvider router={routes} />
            <TimerTicker />
            <ToastList />
            <ModalRenderer />
        </>
    );
}
