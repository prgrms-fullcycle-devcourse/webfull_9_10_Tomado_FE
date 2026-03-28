import { useEffect } from 'react';
import { PlayerModal } from '@@/ui/PlayerModal';
import { useBgmPlayer } from '../useBgmPlayer';

interface BgmPlayerLayerProps {
    open: boolean;
    tone: 'default' | 'focusmode';
    requestToggle?: boolean;
    onClose: () => void;
    onToggleHandled?: () => void;
}

export const BgmPlayerLayer = ({
    open,
    tone,
    requestToggle = false,
    onClose,
    onToggleHandled,
}: BgmPlayerLayerProps) => {
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

    useEffect(() => {
        if (!requestToggle) {
            return;
        }

        onPlayerToggle();
        onToggleHandled?.();
    }, [onPlayerToggle, onToggleHandled, requestToggle]);

    return (
        <PlayerModal
            onClose={onClose}
            tone={tone}
            open={open}
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
    );
};
