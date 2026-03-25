const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const doubleColumnLayoutClassName = 'grid w-full gap-5 md:grid-cols-2';

export { cx };
