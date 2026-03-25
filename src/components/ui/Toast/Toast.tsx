import { Icon } from '@/components/ui/Icon';

import {
    cx,
    iconClassName,
    labelClassName,
    rootClassName,
    textButtonClassName,
    textButtonWrapperClassName,
} from './styles';
import type { ToastProps } from './types';

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
