import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export default function AppShell() {
    return (
        <>
            <Header />
            <Outlet />
            {/* FocusModeOverlay는 나중에 여기서 전역으로 렌더링 */}
        </>
    );
}
