const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const containerClassName = 'mx-auto w-full px-5';
export const containerInnerClassName =
    'mx-auto w-full max-w-[1200px] flex min-h-[calc(100vh-60px)] flex-col gap-2.5 pt-5 pb-15';

export { cx };
