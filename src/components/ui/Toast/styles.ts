export const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const rootClassName =
    'flex h-[48px] w-full max-w-[400px] items-center gap-2 rounded-xl bg-gray-900 px-4 text-base text-white';

export const iconClassName = 'shrink-0 text-white';

export const labelClassName = 'truncate text-base text-white';

export const textButtonWrapperClassName = 'shrink-0 border-b border-white';

export const textButtonClassName = 'text-sm leading-none text-white hover:cursor-pointer';
