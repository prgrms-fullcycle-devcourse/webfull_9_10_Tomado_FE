import { Outlet } from 'react-router-dom';
import { DefaultHeader, GuestHeader } from '@/components/layout/Header';

type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const HeaderComponent = headerVariant === 'guest' ? GuestHeader : DefaultHeader;

    return (
        <>
            <HeaderComponent />
            <Outlet />
            {/* FocusModeOverlay는 나중에 여기서 전역으로 렌더링 */}
        </>
    );
}
