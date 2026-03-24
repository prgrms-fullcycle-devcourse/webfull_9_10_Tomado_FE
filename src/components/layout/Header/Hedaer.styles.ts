const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const headerClassName = 'sticky top-0 z-40 w-full bg-white/95 backdrop-blur';

export const headerInnerClassName = 'flex min-h-[60px] items-center justify-between gap-6 px-5 max-w-[1200px] mx-auto';

export const headerSlotClassName = 'flex min-w-0 items-center';

export const headerLeftClassName = 'flex-1 justify-start';

export const headerCenterClassName = 'justify-center max-[600px]:hidden';

export const headerRightClassName = 'justify-end gap-2.5';

export const headerTrailingGroupClassName = 'flex items-center gap-6';

export const logoClassName = 'h-8 w-auto shrink-0';

export const navClassName = 'flex items-center gap-1';

export const getNavItemClassName = (active = false) => {
    return cx(
        'text-base font-medium transition-colors',
        active ? '!text-primary' : '!text-neutral-darker hover:!text-primary hover:!bg-neutral-subtle'
    );
};

export const utilityActionsClassName = 'flex items-center gap-2.5';

export const profileBadgeClassName =
    'inline-flex size-8 items-center justify-center rounded-full text-white shadow-sm hover:cursor-pointer';

export const profileImageClassName = 'block size-8 object-contain bg-primary';

export const headerActionBaseClassName =
    'inline-flex h-10 items-center justify-center rounded-[0.625rem] border px-4 text-base leading-5 font-medium transition-colors';

export const headerOutlineActionClassName =
    '!border-neutral-lighter bg-white !text-neutral-darker hover:!border-primary hover:!text-primary';

export const headerFilledActionClassName = '!border-transparent bg-primary !text-white hover:bg-primary-darker';

export { cx };
