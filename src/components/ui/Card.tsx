import { useState } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, MouseEventHandler } from 'react';

import { Icon } from '.';

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
    label: string;
    iconName: string;
    tone: RetroCategoryTone;
}

export interface RetroCardProps extends HTMLAttributes<HTMLDivElement>, CardActionProps {
    date?: string;
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
    danger: 'border-danger text-danger',
    warning: 'border-yellow-400 text-yellow-400',
    info: 'border-info text-info',
    success: 'border-success-darker text-success-darker',
};

const cardDeleteButtonClassName =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl text-neutral transition-colors duration-200 ease-out hover:bg-neutral-subtle hover:text-neutral-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

const cardDeleteIconClassName = 'text-inherit';

const getDailyLogCardClassName = (state: DailyLogCardState = 'default', hovered = false) => {
    const resolvedState = state === 'default' && hovered ? 'hover' : state;

    return cx(
        'relative flex w-full flex-col justify-between gap-6 rounded-[1.75rem] px-6 py-7 text-left',
        interactiveCardClassName,
        state === 'default' && 'hover:cursor-pointer',
        dailyLogCardStateClassNames[resolvedState]
    );
};

const dailyLogHeaderClassName = 'flex items-start justify-between gap-4';
const dailyLogContentClassName = 'flex min-w-0 flex-1 flex-col justify-between gap-6';
const dailyLogTitleClassName =
    'block h-[1em] min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-3xl leading-[1em] font-bold text-black';

const getDailyLogDateClassName = (state: DailyLogCardState = 'default') => {
    return cx('text-2xl leading-tight font-semibold', state === 'selected' ? 'text-primary' : 'text-neutral');
};

const getRetroCardClassName = (state: Exclude<RetroCardState, 'empty'> = 'default', hovered = false) => {
    const resolvedState = state === 'default' && hovered ? 'hover' : state;

    return cx(
        'relative flex w-full flex-col gap-7 rounded-[1.75rem] px-6 py-7 text-left',
        interactiveCardClassName,
        state === 'default' && 'hover:cursor-pointer',
        retroCardStateClassNames[resolvedState]
    );
};

const retroDateRowClassName = 'flex items-start justify-between gap-4';
const retroDateClassName = 'block min-w-0 max-w-full truncate pr-4 pb-2 text-3xl leading-none font-medium text-black';
const retroCategoryListClassName = 'flex flex-wrap items-center gap-2.5';

const getRetroCategoryItemClassName = (tone: RetroCategoryTone) => {
    return cx(
        'inline-flex h-11 items-center gap-2 rounded-xl border bg-white/60 px-4 text-xl leading-none font-medium',
        categoryToneClassNames[tone]
    );
};

const retroCategoryIconClassName = 'text-inherit';
const retroEmptyClassName =
    'flex min-h-44 w-full items-center justify-center rounded-[1.75rem] text-center text-3xl leading-tight font-bold text-neutral';

const defaultCategories = [
    { label: '기술', iconName: 'tech', tone: 'danger' },
    { label: '결정', iconName: 'decision', tone: 'warning' },
    { label: '소통', iconName: 'communication', tone: 'info' },
    { label: '감정', iconName: 'emotion', tone: 'success' },
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
                        <Icon className={cardDeleteIconClassName} name='delete' size={22} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

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

            <div className={retroCategoryListClassName}>
                {categories.map((category) => {
                    return (
                        <span
                            key={`${category.iconName}-${category.label}`}
                            className={getRetroCategoryItemClassName(category.tone)}
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
