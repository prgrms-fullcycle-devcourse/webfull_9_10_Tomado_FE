import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { useToastStore } from '@/store/toast';

export type ToastItemType = {
    id: string;
    message: string;
    iconName?: string;
    textButton?: boolean;
    textButtonLabel?: string;
    onTextButtonClick?: () => void;
    duration: number;
};

interface ToastItemProps {
    toast: ToastItemType;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const rootClassName =
    'flex h-[48px] min-w-[300px] items-center gap-4 rounded-xl bg-gray-900/90 px-4 text-base text-white';

const labelClassName = 'truncate text-base text-white w-full';
const textButtonWrapperClassName = 'shrink-0 border-b border-white';
const textButtonClassName = 'pointer-events-auto shrink-0 text-sm leading-none text-white hover:cursor-pointer';

export const Toast = ({ toast }: ToastItemProps) => {
    const [visible, setVisible] = useState(true);
    const { removeToastList } = useToastStore();
    const { id, message, iconName, textButton, textButtonLabel, onTextButtonClick, duration = 2000 } = toast;

    const toastRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!toastRef.current) {
            return;
        }

        toastRef.current.animate(
            [
                { opacity: 1, transform: 'translateY(-18px) scale(0.98)' },
                { opacity: 1, transform: 'translateY(8px) scale(1)', offset: 0.72 },
                { opacity: 1, transform: 'translateY(0) scale(1)' },
            ],
            {
                duration: 460,
                easing: 'ease-in-out',
                fill: 'both',
            }
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        const removeTimer = setTimeout(() => {
            removeToastList(id);
        }, duration + 300);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, [duration, id, removeToastList]);

    const renderIcon = () => {
        if (!iconName) {
            return null;
        }

        return <Icon name={iconName} className='shrink-0 flex items-center' color='white' />;
    };

    return (
        <div ref={toastRef} className={cx(rootClassName, visible ? 'opacity-100' : 'opacity-0')}>
            {renderIcon()}
            <span className={labelClassName}>{message}</span>
            {textButton ? (
                <div className={textButtonWrapperClassName}>
                    <button className={textButtonClassName} onClick={onTextButtonClick} type='button'>
                        {textButtonLabel}
                    </button>
                </div>
            ) : null}
        </div>
    );
};
