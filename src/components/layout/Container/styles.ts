const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const containerClassName = 'mx-auto w-full max-w-[1200px] px-5';

export { cx };
