'use client';

import { useEffect } from 'react';
import ReactDom from 'react-dom';

import { useModalStore } from '@/stores/modal';

import { Modal } from './Modal';

const overlayClassName = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';
const overlayBackdropClassName = 'absolute inset-0';

export const ModalRenderer = () => {
    const { modal, close } = useModalStore();

    useEffect(() => {
        if (!modal) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [close, modal]);

    const element = document.getElementById('modal-root');
    if (!element) return null;

    if (!modal) return null;

    return ReactDom.createPortal(
        <div className={overlayClassName}>
            <button
                aria-label='Close modal backdrop'
                className={overlayBackdropClassName}
                onClick={close}
                type='button'
            />
            <Modal modal={modal} />
        </div>,
        element
    );
};
