import { useEffect, useRef, useState } from 'react';
import type {
    ChangeEventHandler,
    CompositionEventHandler,
    FocusEventHandler,
    HTMLAttributes,
    KeyboardEventHandler,
    MouseEvent,
    MouseEventHandler,
    Ref,
} from 'react';

import { CheckBox } from '@@/form';
import { Icon, Menu } from '@@/ui';
import { useInputLimit } from '@/hooks';

export interface TodoItemProps extends HTMLAttributes<HTMLDivElement> {
    checked?: boolean;
    defaultChecked?: boolean;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    moreButton?: boolean;
    maxChars?: number;
    checkboxLabel?: string;
    dragHandleLabel?: string;
    onCheckedChange?: (checked: boolean) => void;
    onLabelChange?: (label: string) => void;
    onMoveDate?: () => void;
    onDelete?: () => void;
    onDragHandleClick?: MouseEventHandler<HTMLButtonElement>;
    dragHandleAttributes?: HTMLAttributes<HTMLButtonElement>;
    dragHandleListeners?: HTMLAttributes<HTMLButtonElement>;
    dragHandleRef?: Ref<HTMLButtonElement>;
    isDragging?: boolean;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const getTodoItemClassName = ({ focused = false, error = false }: { focused?: boolean; error?: boolean }) => {
    return cx(
        'relative flex h-10 w-full pl-1 pr-3 items-center gap-1 rounded-xl border-1 border-neutral-subtle bg-white transition-shadow duration-200 ease-out hover:shadow-2',
        focused && 'border-1 border-primary',
        error && 'border-1 border-danger'
    );
};

const buttonClassName =
    'inline-flex h-10 shrink-0 items-center justify-center text-neutral hover:text-neutral-darker hover:cursor-pointer';

const middleGroupClassName = 'flex min-w-0 flex-1 items-center gap-2.5';
const textInputClassName =
    'w-full min-w-0 border-none bg-transparent text-base font-medium text-ellipsis placeholder:text-neutral focus:outline-none';

const getTodoLabelClassName = ({ checked = false, filled = false }: { checked?: boolean; filled?: boolean }) => {
    if (checked) {
        return 'text-neutral line-through decoration-neutral';
    }

    return filled ? 'text-gray-900' : 'text-neutral';
};

export const TodoItem = ({
    checked,
    defaultChecked = false,
    label = '할일 작성',
    placeholder = '할일 작성',
    disabled = false,
    moreButton = false,
    maxChars = 30,
    checkboxLabel,
    dragHandleLabel = '순서 변경',
    onLabelChange,
    onMoveDate,
    onDelete,
    onDragHandleClick,
    dragHandleAttributes,
    dragHandleListeners,
    dragHandleRef,
    isDragging = false,
    onCheckedChange,
    onFocus,
    onBlur,
    className,
    ...props
}: TodoItemProps) => {
    const [localChecked, setLocalChecked] = useState(checked ?? defaultChecked);
    const [isFocused, setIsFocused] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const isComposingRef = useRef(false);
    const pendingCommitLabelRef = useRef<string | null>(null);
    const {
        value: draftLabel,
        hasError: hasLengthError,
        setLimitedValue,
    } = useInputLimit({
        maxChars,
        toastMessage: '입력 가능한 글자 수를 초과하였습니다.',
    });

    useEffect(() => {
        if (checked !== undefined) {
            setLocalChecked(checked);
        }
    }, [checked]);

    useEffect(() => {
        setLimitedValue(label);
    }, [label, setLimitedValue]);

    const isChecked = localChecked;
    const trimmedLabel = draftLabel.trim();
    const isFilled = trimmedLabel.length > 0;
    const resolvedCheckboxLabel = checkboxLabel ?? (isChecked ? '완료한 할 일' : '미완료 할 일');

    const handleCheckedChange = (nextChecked: boolean) => {
        setLocalChecked(nextChecked);
        onCheckedChange?.(nextChecked);
    };

    const handleDragHandleClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
            return;
        }

        onDragHandleClick?.(event);
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setLimitedValue(event.target.value);
    };

    const commitLabelChange = (nextRawLabel: string) => {
        const nextLabel = nextRawLabel.trim();
        const currentLabel = label.trim();

        if (!nextLabel) {
            setLimitedValue(label);
            return;
        }

        if (nextLabel === currentLabel) {
            return;
        }

        onLabelChange?.(nextLabel);
    };

    const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
        setIsFocused(true);
        onFocus?.(event);
    };

    const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
        setIsFocused(false);
        onBlur?.(event);

        if (isComposingRef.current) {
            pendingCommitLabelRef.current = event.target.value;
            return;
        }

        if (!event.target.value.trim()) {
            setLimitedValue(label);
            return;
        }

        commitLabelChange(event.target.value);
    };

    const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (isComposingRef.current) {
            return;
        }

        if (event.key !== 'Enter') {
            return;
        }

        event.currentTarget.blur();
    };

    const handleInputCompositionStart: CompositionEventHandler<HTMLInputElement> = () => {
        isComposingRef.current = true;
    };

    const handleInputCompositionEnd: CompositionEventHandler<HTMLInputElement> = (event) => {
        isComposingRef.current = false;
        setLimitedValue(event.currentTarget.value);

        if (!pendingCommitLabelRef.current) {
            return;
        }

        const nextLabel = pendingCommitLabelRef.current;
        pendingCommitLabelRef.current = null;
        commitLabelChange(nextLabel);
    };

    return (
        <div
            {...props}
            className={cx(
                getTodoItemClassName({ focused: isFocused, error: hasLengthError }),
                isDragging && 'shadow-2',
                className
            )}
        >
            <button
                aria-label={dragHandleLabel}
                className={buttonClassName}
                disabled={disabled}
                onClick={handleDragHandleClick}
                ref={dragHandleRef}
                type='button'
                {...dragHandleAttributes}
                {...dragHandleListeners}
            >
                <Icon name='drag_indicator' color='neutral' size={24} />
            </button>

            <div className={middleGroupClassName}>
                <CheckBox
                    ariaLabel={resolvedCheckboxLabel}
                    checked={isChecked}
                    disabled={disabled}
                    onCheckedChange={handleCheckedChange}
                    size={24}
                />
                <input
                    className={cx(textInputClassName, getTodoLabelClassName({ checked: isChecked, filled: isFilled }))}
                    disabled={disabled}
                    onBlur={handleInputBlur}
                    onChange={handleInputChange}
                    onCompositionEnd={handleInputCompositionEnd}
                    onCompositionStart={handleInputCompositionStart}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholder}
                    type='text'
                    value={draftLabel}
                />
            </div>

            {moreButton ? (
                <div
                    className='relative -m-2 flex h-full items-center p-2'
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                >
                    <button
                        aria-label='더보기'
                        className={buttonClassName}
                        disabled={disabled}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        type='button'
                    >
                        <Icon name='more' size={24} />
                    </button>
                    {menuOpen ? (
                        <div className='absolute top-5 right-0 z-20 p-2'>
                            <Menu
                                inline
                                items={[
                                    {
                                        label: '날짜 이동하기',
                                        onClick: () => {
                                            onMoveDate?.();
                                            setMenuOpen(false);
                                        },
                                    },
                                    {
                                        label: '삭제하기',
                                        tone: 'danger',
                                        onClick: () => {
                                            onDelete?.();
                                            setMenuOpen(false);
                                        },
                                    },
                                ]}
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
