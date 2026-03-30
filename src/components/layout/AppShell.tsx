import { Suspense, lazy, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { DefaultHeader, GuestHeader } from '.';
import { useSpaceKey, useToast } from '@/hooks';
import { Modal, Toast } from '@@/ui';
import { FocusMode, TimerProgressBar, useTimerSession } from '@@@/timer';

const LazyBgmPlayerLayer = lazy(() =>
    import('@@@/settings/components/BgmPlayerLayer').then((module) => ({
        default: module.BgmPlayerLayer,
    }))
);

export type AppShellProps = {
    headerVariant?: 'default' | 'guest';
};

export default function AppShell({ headerVariant = 'default' }: AppShellProps) {
    const HeaderComponent = headerVariant === 'guest' ? GuestHeader : DefaultHeader;
    const location = useLocation();
    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [shouldLoadBgmPlayer, setShouldLoadBgmPlayer] = useState(false);
    const [pendingBgmToggle, setPendingBgmToggle] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const { toasts } = useToast();
    const { stopConfirmOpen, handleCloseStopConfirm, handleConfirmStopTimer } = useTimerSession();

    useSpaceKey(
        () => {
            setShouldLoadBgmPlayer(true);
            setPendingBgmToggle(true);
        },
        {
            enabled: headerVariant === 'default',
        }
    );

    const handleMusicClick = () => {
        setShouldLoadBgmPlayer(true);
        setPlayerModalOpen(true);
    };

    const handleFocusModeOpen = () => {
        setIsFocusMode(true);
    };

    const shouldShowTimerProgressBar = headerVariant === 'default' && location.pathname !== '/main' && !isFocusMode;

    return (
        <>
            <HeaderComponent onMusicClick={handleMusicClick} onFocusModeClick={handleFocusModeOpen} />

            {shouldShowTimerProgressBar ? <TimerProgressBar /> : null}

            <Outlet />

            <FocusMode open={isFocusMode} onMusicClick={handleMusicClick} onClose={() => setIsFocusMode(false)} />

            <Modal
                open={stopConfirmOpen}
                tone='danger'
                title='집중 세션 중단'
                description={
                    <>
                        세션 중단 시 기록은 저장되지 않아요
                        <br />
                        그래도 중단 하시겠어요?
                    </>
                }
                onClose={handleCloseStopConfirm}
                confirmLabel='중단하기'
                onCancel={handleCloseStopConfirm}
                onConfirm={handleConfirmStopTimer}
            />

            {shouldLoadBgmPlayer ? (
                <Suspense fallback={null}>
                    <LazyBgmPlayerLayer
                        open={playerModalOpen}
                        tone={isFocusMode ? 'focusmode' : 'default'}
                        requestToggle={pendingBgmToggle}
                        onClose={() => setPlayerModalOpen(false)}
                        onToggleHandled={() => setPendingBgmToggle(false)}
                    />
                </Suspense>
            ) : null}

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
