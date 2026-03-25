import type { ButtonProps, ButtonSize, ButtonVariant } from './types';

// INFO: 참인 조건의 클래스만 남기고 최종 문자열을 만들어 반환합니다.
const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

// INFO: hover, focus-visible, disabled 같은 실제 DOM 상태에 반응하는 공통 인터랙션 클래스입니다.
const interactiveClassName =
    'transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed hover:cursor-pointer';

// INFO: variant별 기본 색상과 hover/disabled selector 규칙을 함께 정의합니다.
const variantClassNames: Record<ButtonVariant, string> = {
    filled: 'border-transparent bg-primary text-white hover:bg-primary-darker disabled:border-transparent disabled:bg-neutral-lighter disabled:text-neutral',
    outline:
        'border-2 border-neutral-subtle bg-transparent text-neutral-darker hover:border-primary hover:text-primary-darker disabled:border-neutral disabled:bg-transparent disabled:text-neutral',
    ghost: 'border-transparent bg-transparent text-neutral-darker hover:bg-neutral-subtle disabled:border-transparent disabled:bg-transparent disabled:text-neutral',
};

// INFO: standard 버튼의 size별 높이, radius, padding, 아이콘 크기를 관리합니다.
const standardSizeClassNames: Record<ButtonSize, { withLabel: string; iconOnly: string; icon: number }> = {
    lg: {
        withLabel: 'h-10 rounded-[0.625rem] px-4 text-base leading-5 font-medium',
        iconOnly: 'size-10 rounded-[0.625rem]',
        icon: 16,
    },
    md: {
        withLabel: 'h-8 rounded-lg px-3 text-sm leading-4 font-medium',
        iconOnly: 'size-8 rounded-lg',
        icon: 14,
    },
    sm: {
        withLabel: 'h-6 rounded-md px-2 text-xs leading-3 font-medium',
        iconOnly: 'size-6 rounded-md',
        icon: 10,
    },
};

// INFO: player 버튼의 size별 버튼 외곽 크기와 아이콘 크기를 관리합니다.
const playerSizeClassNames: Record<ButtonSize, { button: string; icon: number }> = {
    lg: {
        button: 'w-20 h-20 rounded-full',
        icon: 60,
    },
    md: {
        button: 'w-15 h-15 rounded-full',
        icon: 40,
    },
    sm: {
        button: 'w-10 h-10 rounded-full',
        icon: 30,
    },
};

// INFO: variant, size, kind 조합에 맞는 최종 버튼 wrapper 클래스를 반환합니다.
export const getButtonClassName = ({
    kind = 'standard',
    variant = 'filled',
    size = 'lg',
    fullWidth = false,
    iconOnly = false,
}: Pick<ButtonProps, 'kind' | 'variant' | 'size' | 'fullWidth' | 'iconOnly'>) => {
    const palette = variantClassNames[variant];

    // INFO: player는 원형 버튼 규칙을 사용하므로 standard와 size 맵을 분리합니다.
    if (kind === 'player') {
        const sizeClassNames = playerSizeClassNames[size];

        return cx(
            'inline-flex shrink-0 items-center justify-center border text-current',
            interactiveClassName,
            sizeClassNames.button,
            fullWidth && 'w-full',
            palette
        );
    }

    const sizeClassNames = standardSizeClassNames[size];

    // INFO: iconOnly일 때는 텍스트 버튼 규격 대신 정사각형 버튼 규격을 사용합니다.
    return cx(
        'inline-flex shrink-0 items-center justify-center gap-2 border text-current',
        interactiveClassName,
        fullWidth && 'w-full',
        iconOnly ? sizeClassNames.iconOnly : sizeClassNames.withLabel,
        palette
    );
};

// INFO: 버튼 내부 content 영역의 정렬 방식을 kind 기준으로 분기합니다.
export const getButtonContentClassName = ({ kind = 'standard' }: Pick<ButtonProps, 'kind' | 'size' | 'iconOnly'>) => {
    if (kind === 'player') {
        return 'inline-flex items-center justify-center';
    }

    return 'inline-flex items-center justify-center gap-2 whitespace-nowrap';
};

// INFO: Icon 컴포넌트에 넘길 실제 픽셀 단위 아이콘 크기를 반환합니다.
export const getButtonIconSize = ({ kind = 'standard', size = 'lg' }: Pick<ButtonProps, 'kind' | 'size'>) => {
    return kind === 'player' ? playerSizeClassNames[size].icon : standardSizeClassNames[size].icon;
};

// INFO: ButtonGroup에서 자식 버튼이 불필요하게 줄어들지 않도록 고정합니다.
export const buttonGroupClassName = '[&>*]:shrink-0';

export { cx };
