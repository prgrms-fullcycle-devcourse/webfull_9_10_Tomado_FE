import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DefaultHeader, GuestHeader } from '.';
import { PlayerModal, Toast } from '@@/ui';
import { useToast } from '@/hooks';

export type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const HeaderComponent = headerVariant === 'guest' ? GuestHeader : DefaultHeader;
    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const { toasts } = useToast();

    const handleMusicClick = () => {
        setPlayerModalOpen(true);
    };

    return (
        <>
            <HeaderComponent onMusicClick={handleMusicClick} />
            <Outlet />
            {/* FocusModeOverlay는 나중에 여기서 전역으로 렌더링 */}
            <PlayerModal onClose={() => setPlayerModalOpen(false)} open={playerModalOpen} title='배경음악 플레이어' />
            {toasts.length ? (
                <div className='pointer-events-none fixed right-6 bottom-6 z-[70] flex flex-col items-end gap-2'>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            className='pointer-events-auto'
                            icon={toast.icon}
                            label={toast.label}
                            textButton={toast.textButton}
                            textButtonLabel={toast.textButtonLabel}
                            onTextButtonClick={toast.onTextButtonClick}
                        />
                    ))}
                </div>
            ) : null}
        </>
    );
}
