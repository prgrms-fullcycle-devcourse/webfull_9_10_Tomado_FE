import type { RadioProps, RadioSize } from './types';

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const radioSizeClassNames: Record<RadioSize, { indicator: string; dot: string }> = {
    sm: {
        indicator: 'size-8 border-[3px]',
        dot: 'after:size-3',
    },
    md: {
        indicator: 'size-11 border-4',
        dot: 'after:size-5',
    },
};

export const getRadioWrapperClassName = ({ disabled = false }: Pick<RadioProps, 'disabled'>) => {
    return cx(
        'inline-flex shrink-0 items-center justify-center',
        !disabled && 'cursor-pointer',
        disabled && 'cursor-not-allowed opacity-60'
    );
};

export const getRadioIndicatorClassName = ({
    size = 'md',
    disabled = false,
}: Pick<RadioProps, 'size' | 'disabled'>) => {
    return cx(
        'inline-flex items-center justify-center rounded-full border-neutral-lighter bg-white transition-colors duration-200 ease-out after:content-[""] after:rounded-full after:scale-0 after:bg-transparent after:transition-transform after:duration-200 after:ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-checked:border-primary peer-checked:after:scale-100 peer-checked:after:bg-primary',
        radioSizeClassNames[size].indicator,
        radioSizeClassNames[size].dot,
        !disabled && 'peer-hover:border-neutral',
        disabled && 'peer-disabled:border-neutral-lighter'
    );
};

export { cx };
