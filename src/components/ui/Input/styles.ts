import type { InputState } from './types';

type ResolveInputStateOptions = {
    state?: InputState;
    disabled?: boolean;
};

// INFO: falsy 값을 제거해서 Tailwind 클래스를 안전하게 합칩니다.
const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const fieldStateClassNames: Record<InputState, string> = {
    default: 'border-transparent bg-neutral-subtle',
    filled: 'border-transparent bg-neutral-subtle',
    focus: 'border-primary bg-neutral-subtle ring-2 ring-primary/10',
    disabled: 'border-transparent bg-neutral-lighter',
    error: 'border-danger bg-neutral-subtle ring-2 ring-danger/10',
};

export const resolveInputState = ({ state = 'default', disabled = false }: ResolveInputStateOptions): InputState => {
    return disabled ? 'disabled' : state;
};

export const getFieldContainerClassName = () => {
    return 'flex w-full flex-col gap-2';
};

export const getFieldLabelClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx('text-sm pl-[10px] leading-5 font-semibold text-black', state === 'disabled' && 'text-neutral-darker');
};

export const getFieldHelperTextClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx(
        'text-xs pl-[10px] leading-4 text-neutral-darker',
        state === 'disabled' && 'text-neutral',
        state === 'error' && 'text-danger'
    );
};

export const getInputWrapperClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx(
        'flex h-11 w-full items-center gap-2 rounded-2xl border px-4 transition-colors duration-200 ease-out',
        state !== 'disabled' &&
            state !== 'error' &&
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
        state === 'error' && 'focus-within:border-danger focus-within:ring-danger/10',
        fieldStateClassNames[state]
    );
};

export const getTextAreaWrapperClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx(
        'flex min-h-48 w-full rounded-2xl border px-4 py-3.5 transition-colors duration-200 ease-out',
        state !== 'disabled' &&
            state !== 'error' &&
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
        state === 'error' && 'focus-within:border-danger focus-within:ring-danger/10',
        fieldStateClassNames[state]
    );
};

export const getInputClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx(
        'min-w-0 flex-1 border-none bg-transparent text-sm leading-5 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none',
        state === 'disabled' && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

export const getTextAreaClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx(
        'min-h-40 w-full resize-none border-none bg-transparent text-sm leading-6 font-medium text-black placeholder:font-normal placeholder:text-neutral focus:outline-none',
        state === 'disabled' && 'cursor-not-allowed text-neutral-darker placeholder:text-neutral'
    );
};

export const getLeadingIconClassName = ({ state = 'default' }: { state?: InputState }) => {
    return cx('shrink-0 text-neutral-darker', state === 'disabled' && 'text-neutral');
};

export const shortcutBadgeClassName =
    'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-neutral bg-white px-1.5 text-[10px] leading-none font-medium text-neutral-darker';

export const todoActionButtonClassName =
    'inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-primary px-4 text-sm leading-5 font-semibold text-white transition-colors duration-200 ease-out hover:bg-primary-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-neutral-lighter disabled:text-neutral';

export { cx };
