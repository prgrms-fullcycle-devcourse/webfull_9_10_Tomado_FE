import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DefaultHeader, GuestHeader } from '.';
import { PlayerModal, Toast } from '@@/ui';
import { useToast } from '@/hooks';
import { FocusMode } from '@/features/timer';

export type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const HeaderComponent = headerVariant === 'guest' ? GuestHeader : DefaultHeader;
    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const { toasts } = useToast();

    const handleMusicClick = () => {
        setPlayerModalOpen(true);
    };

    return (
        <>
            <HeaderComponent onMusicClick={handleMusicClick} onFocusModeClick={() => setIsFocusMode(true)} />

            <Outlet />

            <FocusMode open={isFocusMode} onMusicClick={handleMusicClick} onClose={() => setIsFocusMode(false)} />

            <PlayerModal
                onClose={() => setPlayerModalOpen(false)}
                tone={isFocusMode ? 'focusmode' : 'default'}
                open={playerModalOpen}
                title='배경음악 플레이어'
            />

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
