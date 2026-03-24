import type { DailyLogCardState, RetroCardState, RetroCategoryTone } from './types';

export const cx = (...classes: Array<string | false | null | undefined>) => {
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

export const cardDeleteButtonClassName =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl text-neutral transition-colors duration-200 ease-out hover:bg-neutral-subtle hover:text-neutral-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

export const cardDeleteIconClassName = 'text-inherit';

export const getDailyLogCardClassName = (state: DailyLogCardState = 'default', hovered = false) => {
    const resolvedState = state === 'default' && hovered ? 'hover' : state;

    return cx(
        'relative flex w-full flex-col justify-between gap-6 rounded-[1.75rem] px-6 py-7 text-left',
        interactiveCardClassName,
        state === 'default' && 'hover:cursor-pointer',
        dailyLogCardStateClassNames[resolvedState]
    );
};

export const dailyLogHeaderClassName = 'flex items-start justify-between gap-4';

export const dailyLogContentClassName = 'flex min-w-0 flex-1 flex-col justify-between gap-6';

export const dailyLogTitleClassName =
    'block h-[1em] min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-bottom text-3xl leading-[1em] font-bold text-black';

export const getDailyLogDateClassName = (state: DailyLogCardState = 'default') => {
    return cx('text-2xl leading-tight font-semibold', state === 'selected' ? 'text-primary' : 'text-neutral');
};

export const getRetroCardClassName = (state: Exclude<RetroCardState, 'empty'> = 'default', hovered = false) => {
    const resolvedState = state === 'default' && hovered ? 'hover' : state;

    return cx(
        'relative flex w-full flex-col gap-7 rounded-[1.75rem] px-6 py-7 text-left',
        interactiveCardClassName,
        state === 'default' && 'hover:cursor-pointer',
        retroCardStateClassNames[resolvedState]
    );
};

export const retroDateRowClassName = 'flex items-start justify-between gap-4';

export const retroDateClassName =
    'block min-w-0 max-w-full truncate pr-4 pb-2 text-3xl leading-none font-medium text-black';

export const retroCategoryListClassName = 'flex flex-wrap items-center gap-2.5';

export const getRetroCategoryItemClassName = (tone: RetroCategoryTone) => {
    return cx(
        'inline-flex h-11 items-center gap-2 rounded-xl border bg-white/60 px-4 text-xl leading-none font-medium',
        categoryToneClassNames[tone]
    );
};

export const retroCategoryIconClassName = 'text-inherit';

export const retroEmptyClassName =
    'flex min-h-44 w-full items-center justify-center rounded-[1.75rem] text-center text-3xl leading-tight font-bold text-neutral';
