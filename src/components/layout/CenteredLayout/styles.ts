const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const centeredLayoutClassName = 'mx-auto flex w-full flex-col';

export { cx };
