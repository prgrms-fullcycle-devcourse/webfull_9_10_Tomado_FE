import { useEffect, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '.';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    label: ReactNode;
    icon?: boolean | ReactNode;
    textButton?: boolean;
    textButtonLabel?: ReactNode;
    onTextButtonClick?: () => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const rootClassName =
    'flex h-[48px] min-w-[300px] items-center gap-4 rounded-xl bg-gray-900/90 px-4 text-base text-white';

const iconClassName = 'shrink-0 text-white';
const labelClassName = 'truncate text-base text-white';
const textButtonWrapperClassName = 'shrink-0 border-b border-white';
const textButtonClassName = 'text-sm leading-none text-white hover:cursor-pointer';

export const Toast = ({
    label,
    icon = false,
    textButton = false,
    textButtonLabel = '취소',
    onTextButtonClick,
    className,
    ...props
}: ToastProps) => {
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

    const renderIcon = () => {
        if (!icon) {
            return null;
        }

        if (icon === true) {
            return <Icon className={iconClassName} color='white' name='noti_on' size={20} />;
        }

        return <span className='shrink-0 flex items-center'>{icon}</span>;
    };

    return (
        <div {...props} className={cx(rootClassName, className)} ref={toastRef}>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
                {renderIcon()}
                <p className={labelClassName}>{label}</p>
            </div>

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
