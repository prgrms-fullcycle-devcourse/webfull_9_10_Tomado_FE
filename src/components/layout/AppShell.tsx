import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DefaultHeader, GuestHeader } from '.';
import { useSpaceKey, useToast } from '@/hooks';
import { PlayerModal, Toast } from '@@/ui';
import { useBgmPlayer } from '@@@/settings';
import { FocusMode } from '@@@/timer';

export type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const HeaderComponent = headerVariant === 'guest' ? GuestHeader : DefaultHeader;
    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const { toasts } = useToast();
    const {
        playerItems,
        playerVolume,
        playerPlaying,
        onPlayerVolumeChange,
        onPlayerToggle,
        onPlayerPrevious,
        onPlayerNext,
        onPlayerItemSelect,
    } = useBgmPlayer();

    useSpaceKey(
        () => {
            onPlayerToggle();
        },
        {
            enabled: headerVariant === 'default',
        }
    );

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
                playerItems={playerItems}
                playerPlaying={playerPlaying}
                playerVolume={playerVolume}
                onPlayerItemSelect={onPlayerItemSelect}
                onPlayerNext={onPlayerNext}
                onPlayerPrevious={onPlayerPrevious}
                onPlayerToggle={onPlayerToggle}
                onPlayerVolumeChange={onPlayerVolumeChange}
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
