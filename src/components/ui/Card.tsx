import { useState } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, MouseEventHandler } from 'react';

import { Icon, Tag } from '.';
import type { Retro } from '@/pages/Retro';
import { RETRO_CATEGORY_NAME } from '@/features/log/retroConstants';

export type DailyLogCardState = 'default' | 'selected' | 'hover';
export type RetroCardState = DailyLogCardState | 'empty';
export type RetroCategoryTone = 'danger' | 'warning' | 'info' | 'success';

export interface CardActionProps {
    deleteLabel?: string;
    deleteButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    onDeleteClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface DailyLogCardProps extends HTMLAttributes<HTMLDivElement>, CardActionProps {
    title: string;
    dateLabel: string;
    state?: DailyLogCardState;
}

export interface RetroCategoryItem {
    type: string;
    label: string;
    iconName: string;
    tone: RetroCategoryTone;
}

export interface RetroCardProps extends HTMLAttributes<HTMLDivElement>, CardActionProps {
    retro?: Retro;
    categories?: RetroCategoryItem[];
    state?: RetroCardState;
    emptyText?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const interactiveCardClassName = 'transition-all duration-500 ease-out';

const dailyLogCardStateClassNames: Record<DailyLogCardState, string> = {
    default: 'border border-neutral-subtle bg-transparent',
    selected: 'border border-primary bg-primary-subtle',
    hover: 'border border-neutral-lighter bg-gray-50',
};

const retroCardStateClassNames: Record<Exclude<RetroCardState, 'empty'>, string> = {
    default: 'border border-neutral-subtle bg-transparent',
    selected: 'border border-primary bg-primary-subtle',
    hover: 'border border-neutral-lighter bg-gray-50',
};

const categoryToneClassNames: Record<RetroCategoryTone, string> = {
    danger: '!border-danger !text-danger',
    warning: 'border-yellow-400 text-yellow-400',
    info: '!border-info !text-info',
    success: 'border-success-darker text-success-darker',
};

const cardDeleteButtonClassName =
    'inline-flex p-1 justify-center rounded-xl text-neutral transition-colors duration-200 ease-out hover:bg-neutral-subtle hover:text-neutral-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

const cardDeleteIconClassName = 'text-inherit hover:cursor-pointer';

const getDailyLogCardClassName = (state: DailyLogCardState = 'default', hovered = false) => {
    const resolvedState = state === 'default' && hovered ? 'hover' : state;

    return cx(
        'relative flex w-full flex-col justify-between rounded-xl p-4 text-left',
        interactiveCardClassName,
        state === 'default' && 'hover:cursor-pointer',
        dailyLogCardStateClassNames[resolvedState]
    );
};

const dailyLogHeaderClassName = 'flex items-start justify-between gap-4';
const dailyLogContentClassName = 'flex min-w-0 flex-1 flex-col justify-between gap-3';
const dailyLogTitleClassName =
    'block overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-lg leading-[1em] font-bold text-black';

const getDailyLogDateClassName = (state: DailyLogCardState = 'default') => {
    return cx('text-sm leading-tight font-normal', state === 'selected' ? 'text-primary' : 'text-neutral');
};

const getRetroCardClassName = (state: Exclude<RetroCardState, 'empty'> = 'default', hovered = false) => {
    const resolvedState = state === 'default' && hovered ? 'hover' : state;

    return cx(
        'relative flex w-full flex-col justify-between rounded-xl p-4 text-left',
        interactiveCardClassName,
        state === 'default' && 'hover:cursor-pointer',
        retroCardStateClassNames[resolvedState]
    );
};

const retroDateRowClassName = 'flex items-start justify-between gap-4';
const retroDateClassName = 'block min-w-0 max-w-full truncate pb-4 text-lg leading-none font-medium text-black';
const retroCategoryListClassName = 'flex flex-wrap items-center gap-1';

const getRetroCategoryItemClassName = (tone: RetroCategoryTone) => {
    return cx(categoryToneClassNames[tone]);
};

const retroEmptyClassName =
    'flex min-h-44 w-full items-center justify-center rounded-[1.75rem] text-center text-3xl leading-tight font-bold text-neutral';

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const defaultCategories = [
    { type: capitalize(RETRO_CATEGORY_NAME.TECH), label: '기술', iconName: 'tech', tone: 'danger' },
    { type: capitalize(RETRO_CATEGORY_NAME.DECISION), label: '결정', iconName: 'decision', tone: 'warning' },
    { type: capitalize(RETRO_CATEGORY_NAME.COMMUNICATION), label: '소통', iconName: 'communication', tone: 'info' },
    { type: capitalize(RETRO_CATEGORY_NAME.EMOTION), label: '감정', iconName: 'emotion', tone: 'success' },
] satisfies NonNullable<RetroCardProps['categories']>;

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
                        <Icon className={cardDeleteIconClassName} name='delete' size={20} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export const RetroCard = ({
    retro,
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

    const relativeDate = (targetDate: string | undefined) => {
        if (!targetDate) return;

        const now = new Date();
        const target = new Date(targetDate);

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());

        const diffTime = today.getTime() - targetDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays <= 3) return `${diffDays}일 전`;

        // 그 이상은 날짜 출력
        const m = String(target.getMonth() + 1);
        const d = String(target.getDate());

        return `${m}월 ${d}일`;
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
                <p className={retroDateClassName}>{relativeDate(retro?.retro_date)}</p>
                {shouldShowDeleteAction ? (
                    <button
                        {...deleteButtonProps}
                        aria-label={deleteButtonProps?.['aria-label'] ?? deleteLabel}
                        className={cx(cardDeleteButtonClassName, deleteButtonProps?.className)}
                        onClick={handleDeleteClick}
                        type={deleteButtonProps?.type ?? 'button'}
                    >
                        <Icon className={cardDeleteIconClassName} name='delete' size={20} />
                    </button>
                ) : null}
            </div>

            <div className={retroCategoryListClassName}>
                {categories.map((category) => {
                    if (!retro?.template_types.includes(category.type)) return;

                    return (
                        <Tag
                            key={`${category.iconName}-${category.label}`}
                            iconName={category.iconName}
                            label={category.label}
                            className={getRetroCategoryItemClassName(category.tone)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
