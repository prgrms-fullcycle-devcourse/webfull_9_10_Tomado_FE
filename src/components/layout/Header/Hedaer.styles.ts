const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const headerClassName = 'sticky top-0 z-40 w-full border-b border-neutral-lighter bg-white/95 backdrop-blur';

export const headerInnerClassName = 'flex min-h-[60px] items-center justify-between gap-6 px-5';

export const headerSlotClassName = 'flex min-w-0 flex-1 items-center';

export const headerLeftClassName = 'justify-start';

export const headerCenterClassName = 'justify-center max-lg:hidden';

export const headerRightClassName = 'justify-end gap-3';

export const logoClassName = 'h-8 w-auto shrink-0';

export const navClassName = 'flex items-center gap-10';

export const getNavItemClassName = (active = false) => {
    return cx(
        'text-base font-medium transition-colors',
        active ? 'text-primary' : 'text-neutral-darker hover:text-primary'
    );
};

export const utilityActionsClassName = 'flex items-center gap-3';

export const profileBadgeClassName =
    'inline-flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-sm';

export const profileImageClassName = 'size-8 rounded-full object-cover';

export const headerActionBaseClassName =
    'inline-flex h-10 items-center justify-center rounded-[0.625rem] border px-4 text-base leading-5 font-medium transition-colors';

export const headerOutlineActionClassName =
    'border-neutral-lighter bg-white text-neutral-darker hover:border-primary hover:text-primary';

export const headerFilledActionClassName = 'border-transparent bg-primary text-white hover:bg-primary-darker';

export { cx };
