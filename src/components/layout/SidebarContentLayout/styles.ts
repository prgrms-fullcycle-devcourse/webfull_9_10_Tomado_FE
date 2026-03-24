const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const sidebarContentLayoutClassName = 'grid w-full items-start';

export { cx };
