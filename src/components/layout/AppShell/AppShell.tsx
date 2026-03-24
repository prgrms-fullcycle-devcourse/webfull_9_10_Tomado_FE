import { Outlet } from 'react-router-dom';
import { DefaultHeader } from '@/components/layout/Header';

export default function AppShell() {
    return (
        <>
            <DefaultHeader />
            <Outlet />
            {/* FocusModeOverlay는 나중에 여기서 전역으로 렌더링 */}
        </>
    );
}
