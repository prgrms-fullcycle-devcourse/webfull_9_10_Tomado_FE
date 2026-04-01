import AppProviders from '@/providers/AppProviders';
import AppRouter from '@/router';
import { TimerTicker } from '@@@/timer';

export default function App() {
    return (
        <>
            <AppProviders>
                <TimerTicker />
                <AppRouter />
            </AppProviders>
        </>
    );
}
