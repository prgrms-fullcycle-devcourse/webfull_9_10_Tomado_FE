import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DefaultHeader, GuestHeader } from '.';
import { PlayerModal } from '@@/ui';

export type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const HeaderComponent = headerVariant === 'guest' ? GuestHeader : DefaultHeader;
    const [playerModalOpen, setPlayerModalOpen] = useState(false);

    const handleMusicClick = () => {
        setPlayerModalOpen(true);
    };

    return (
        <>
            <HeaderComponent onMusicClick={handleMusicClick} />
            <Outlet />
            {/* FocusModeOverlay는 나중에 여기서 전역으로 렌더링 */}
            <PlayerModal onClose={() => setPlayerModalOpen(false)} open={playerModalOpen} title='배경음악 플레이어' />
        </>
    );
}
