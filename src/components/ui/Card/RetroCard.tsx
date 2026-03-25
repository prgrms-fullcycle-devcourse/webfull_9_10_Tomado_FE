import { useState } from 'react';
import type { MouseEvent } from 'react';

import { Icon } from '@/components/ui/Icon';

import {
    cardDeleteButtonClassName,
    cardDeleteIconClassName,
    cx,
    getRetroCardClassName,
    getRetroCategoryItemClassName,
    retroCategoryIconClassName,
    retroCategoryListClassName,
    retroDateClassName,
    retroDateRowClassName,
    retroEmptyClassName,
} from './styles';
import type { RetroCardProps } from './types';

const defaultCategories = [
    { label: '기술', iconName: 'tech', tone: 'danger' },
    { label: '결정', iconName: 'decision', tone: 'warning' },
    { label: '소통', iconName: 'communication', tone: 'info' },
    { label: '감정', iconName: 'emotion', tone: 'success' },
] satisfies NonNullable<RetroCardProps['categories']>;

export const RetroCard = ({
    date = '',
    categories = defaultCategories,
    state = 'default',
    emptyText = '아직 작성된 회고가 없습니다.',
    deleteLabel = '삭제',
    deleteButtonProps,
    onDeleteClick,
    className,
    onMouseEnter,
    onMouseLeave,
    ...props
}: RetroCardProps) => {
    if (state === 'empty') {
        return (
            <div {...props} className={cx(retroEmptyClassName, className)}>
                <p>{emptyText}</p>
            </div>
        );
    }

    const [isHovered, setIsHovered] = useState(false);
    const shouldShowDeleteAction = state === 'hover' || (state === 'default' && isHovered);

    const handleMouseEnter: RetroCardProps['onMouseEnter'] = (event) => {
        setIsHovered(true);
        onMouseEnter?.(event);
    };

    const handleMouseLeave: RetroCardProps['onMouseLeave'] = (event) => {
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
            className={cx(getRetroCardClassName(state, isHovered), className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={retroDateRowClassName}>
                <p className={retroDateClassName}>{date}</p>
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

            {/* TODO: 작성한 회고 카테고리를 어떤값 기준으로 표시해줄것인지? */}
            <div className={retroCategoryListClassName}>
                {categories.map((category) => {
                    return (
                        <span
                            className={getRetroCategoryItemClassName(category.tone)}
                            key={`${category.iconName}-${category.label}`}
                        >
                            <Icon className={retroCategoryIconClassName} name={category.iconName} size={18} />
                            <span>{category.label}</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
};
