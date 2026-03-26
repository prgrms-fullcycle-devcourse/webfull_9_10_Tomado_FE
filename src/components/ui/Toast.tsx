import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '.';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    label: ReactNode;
    icon?: boolean;
    textButton?: boolean;
    textButtonLabel?: ReactNode;
    onTextButtonClick?: () => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const rootClassName =
    'flex h-[48px] w-full max-w-[400px] items-center gap-2 rounded-xl bg-gray-900 px-4 text-base text-white';

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
    return (
        <div {...props} className={cx(rootClassName, className)}>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
                {icon ? <Icon className={iconClassName} color='white' name='noti_on' size={20} /> : null}
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
