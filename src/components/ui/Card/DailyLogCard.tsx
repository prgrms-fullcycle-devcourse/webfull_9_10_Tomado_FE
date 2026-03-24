import { useState } from 'react';
import type { MouseEvent } from 'react';

import { Icon } from '@/components/ui/Icon';

import {
    cardDeleteButtonClassName,
    cardDeleteIconClassName,
    cx,
    dailyLogContentClassName,
    dailyLogHeaderClassName,
    dailyLogTitleClassName,
    getDailyLogCardClassName,
    getDailyLogDateClassName,
} from './styles';
import type { DailyLogCardProps } from './types';

export const DailyLogCard = ({
    title,
    dateLabel,
    state = 'default',
    deleteLabel = '삭제',
    deleteButtonProps,
    onDeleteClick,
    className,
    onMouseEnter,
    onMouseLeave,
    ...props
}: DailyLogCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const shouldShowDeleteAction = state === 'hover' || (state === 'default' && isHovered);

    const handleMouseEnter: DailyLogCardProps['onMouseEnter'] = (event) => {
        setIsHovered(true);
        onMouseEnter?.(event);
    };

    const handleMouseLeave: DailyLogCardProps['onMouseLeave'] = (event) => {
        setIsHovered(false);
        onMouseLeave?.(event);
    };

    const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
        deleteButtonProps?.onClick?.(event);
        onDeleteClick?.(event);
    };

    return (
        <div
            {...props}
            aria-selected={state === 'selected' || undefined}
            className={cx(getDailyLogCardClassName(state, isHovered), className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={dailyLogHeaderClassName}>
                <div className={dailyLogContentClassName}>
                    <p className={dailyLogTitleClassName}>{title}</p>
                    <p className={getDailyLogDateClassName(state)}>{dateLabel}</p>
                </div>
                {shouldShowDeleteAction ? (
                    <button
                        {...deleteButtonProps}
                        aria-label={deleteButtonProps?.['aria-label'] ?? deleteLabel}
                        className={cx(cardDeleteButtonClassName, deleteButtonProps?.className)}
                        onClick={handleDeleteClick}
                        type={deleteButtonProps?.type ?? 'button'}
                    >
                        <Icon className={cardDeleteIconClassName} name='delete' size={22} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};
