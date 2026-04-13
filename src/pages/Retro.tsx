import type { CreateRetroLogRequestTemplateType, RetroLog, RetroLogListItem } from '@/api/generated/model';
import {
    getListRetroLogsQueryKey,
    useCreateRetroLog,
    useUpdateRetroLog,
    useDeleteRetroLog,
    useListRetroLogs,
} from '@/api/generated/retro-logs/retro-logs';
import { queryClient } from '@/api/queryClient';
import RetroItem from '@/features/log/components/RetroItem';
import { RETRO_CATEGORY_NAME, RETRO_FORM } from '@/features/log/retroConstants';
import { useToast } from '@/hooks';
import { DATE_FORMAT, formatDate } from '@/utils';
import { isSameDate } from '@/utils/dateUtils';
import { SearchInput, SegmentedControl } from '@@/form';
import { Container, SectionHeader, SidebarContentLayout } from '@@/layout';
import { Badge, Button, Calendar, Icon, RetroCard } from '@@/ui';
import { useEffect, useRef, useState } from 'react';

export default function Retro() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    type RetroTemplateType = NonNullable<RetroLogListItem['template_types']>[number];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [content, setContent] = useState<Record<string, Record<string, string>>>({});
    const [selectedCategory, setSelectedCategory] = useState(RETRO_CATEGORY_NAME.TECH);
    const [selectedRetro, setSelectedRetro] = useState<RetroLogListItem>();
    const [autoSaveText, setAutoSaveText] = useState('');
    const [autoSaveState, setAutoSaveState] = useState<'' | 'writing' | 'saving' | 'saved' | 'error'>('');
    const [isSaveProgresing, setIsSaveProgresing] = useState(false);
    const [deleteTargetRetro, setDeleteTargetRetro] = useState<RetroLogListItem>();
    const [deleteTargetTemplateTypes, setDeleteTargetTemplateTypes] = useState<string[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pendingDeleteRetroIds, setPendingDeleteRetroIds] = useState<string[]>([]);

    const retroLogsQueryKey = getListRetroLogsQueryKey();
    const { data: retroLogs = [], isLoading: isRetroLogsLoading } = useListRetroLogs();
    const { mutateAsync: createRetroLog } = useCreateRetroLog();
    const { mutateAsync: updateRetroLog } = useUpdateRetroLog();
    const { mutateAsync: deleteRetroLog } = useDeleteRetroLog();

    const { showToast } = useToast();

    const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
    const contentChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const contentRef = useRef(content);
    const deleteTimerMapRef = useRef<Record<string, number>>({});

    useEffect(() => {
        initContent();
    }, []);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    const RETRO_DELETE_UNDO_DURATION = 3000;
    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

    const visibleRetroArr: RetroLogListItem[] = retroLogs
        .map((retro): RetroLogListItem | null => {
            const visibleRetros =
                retro.retros?.filter((item) => !item.id || !pendingDeleteRetroIds.includes(item.id)) ?? [];

            if (visibleRetros.length === 0) return null;

            const templateTypes = visibleRetros.reduce<RetroTemplateType[]>((types, item) => {
                if (item.template_type) {
                    types.push(item.template_type as RetroTemplateType);
                }

                return types;
            }, []);

            return {
                ...retro,
                retros: visibleRetros,
                count: visibleRetros.length,
                template_types: templateTypes,
            };
        })
        .filter((retro): retro is RetroLogListItem => retro !== null);

    const initContent = () => {
        console.log('INIT CONTENT');

        setContent({
            [RETRO_CATEGORY_NAME.TECH]: {
                learned_today: '',
                applied_technology: '',
                technical_difficulty: '',
                next_to_try: '',
            },
            [RETRO_CATEGORY_NAME.DECISION]: {
                decision_made: '',
                decision_reason: '',
                outcome_impact: '',
                alternatives_considered: '',
            },
            [RETRO_CATEGORY_NAME.COMMUNICATION]: {
                communication_highlights: '',
                communication_friction: '',
                feedback_received: '',
                improvements: '',
            },
            [RETRO_CATEGORY_NAME.EMOTION]: {
                mood_today: '',
                what_energized: '',
                what_drained: '',
                grateful_for: '',
            },
        });
    };

    const mergeRetroLogIntoSelectedRetro = (retroLog: RetroLog, baseRetro?: RetroLogListItem): RetroLogListItem => {
        const nextRetros = baseRetro?.retros?.some((item) => retroLog.id && item.id === retroLog.id)
            ? baseRetro.retros.map((item) => (item.id === retroLog.id ? retroLog : item))
            : [...(baseRetro?.retros?.filter((item) => item.template_type !== retroLog.template_type) ?? []), retroLog];

        const templateTypes = nextRetros.reduce<RetroTemplateType[]>((types, item) => {
            if (!item.template_type) return types;

            const templateType = item.template_type as RetroTemplateType;

            if (!types.includes(templateType)) {
                types.push(templateType);
            }

            return types;
        }, []);

        return {
            ...baseRetro,
            retro_date: retroLog.retro_date ?? baseRetro?.retro_date ?? formatDate(selectedDate, DATE_FORMAT.api),
            template_types: templateTypes,
            count: nextRetros.length,
            latest_created_at: baseRetro?.latest_created_at ?? retroLog.created_at,
            retros: nextRetros,
        };
    };

    const handleCalendarDateSelect = (date: Date) => {
        if (date.getTime() > todayStart.getTime()) {
            return;
        }

        const retro = visibleRetroArr.find((retro) => {
            if (retro.retro_date) return isSameDate(new Date(retro.retro_date), date);
        });
        console.log('CALENDAR retro', retro);

        if (retro && retro.retros && retro.template_types) {
            setSelectedRetro(retro);

            let nextCategory = retro.template_types[0].toLowerCase();
            setSelectedCategory(nextCategory);

            const mapped = retro.retros.reduce(
                (acc, cur) => {
                    if (!cur.template_type || !cur.content) return acc;

                    acc[cur.template_type.toLowerCase()] = cur.content;
                    return acc;
                },
                {} as Record<string, Record<string, string>>
            );
            console.log('mapped', mapped);

            setContent(mapped);

            let currentRetro = retro.retros.find((item) => item.template_type?.toLowerCase() == nextCategory);

            const lastSaved = formatLastSaved(currentRetro?.updated_at ?? '');
            setAutoSaveText(lastSaved);
        } else {
            setSelectedRetro(undefined);
            initContent();
            setAutoSaveText('');
        }

        setSelectedDate(date);
        setIsOpenCalendar(false);
    };

    const moveSelectedDate = (days: number) => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + days);

        handleCalendarDateSelect(nextDate);
    };

    const formatKoreanTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const period = hours < 12 ? '오전' : '오후';
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;

        return `${period} ${displayHour}:${minutes}`;
    };

    const relativeDate = (targetDate: string): string => {
        const now = new Date();
        const target = new Date(targetDate);

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());

        const diffTime = today.getTime() - targetDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays <= 3) return `${diffDays}일 전`;

        // 그 이상은 날짜 출력
        const m = String(target.getMonth() + 1);
        const d = String(target.getDate());

        return `${m}월 ${d}일`;
    };

    const formatLastSaved = (targetDate: string): string => {
        const now = new Date();
        const target = new Date(targetDate);

        if (Number.isNaN(target.getTime())) {
            return '마지막 저장 -';
        }

        const diffMs = now.getTime() - target.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        const relative = relativeDate(targetDate);

        if (diffSeconds < 60) return '마지막 저장 방금 전';
        if (diffMinutes < 60) return `마지막 저장 ${diffMinutes}분 전`;
        if (diffHours < 12) return `마지막 저장 ${diffHours}시간 전`;

        if (relative === '오늘') {
            return `마지막 저장 ${formatKoreanTime(target)}`;
        }

        if (relative === '어제') {
            return `마지막 저장 1일 전 ${formatKoreanTime(target)}`;
        }

        if (relative.includes('일 전')) {
            return `마지막 저장 ${relative} ${formatKoreanTime(target)}`;
        }

        const yy = String(target.getFullYear()).slice(-2);
        const mm = String(target.getMonth() + 1).padStart(2, '0');
        const dd = String(target.getDate()).padStart(2, '0');

        return `마지막 저장 ${yy}. ${mm}. ${dd} ${formatKoreanTime(target)}`;
    };

    const handleRetroClick = (retro: RetroLogListItem): void => {
        if (!retro?.retros || !retro.template_types) return;

        setSelectedRetro(retro);

        const newObj: Record<string, { [key: string]: string }> = {};

        retro.retros.map((retro) => {
            if (!retro.template_type) return;
            newObj[retro.template_type.toLowerCase()] = { ...retro.content };
        });

        let nextCategory = retro.template_types[0].toLowerCase();

        setContent(newObj);
        setSelectedDate(new Date(`${retro.retro_date}T00:00:00`));
        setSelectedCategory(nextCategory);

        let currentRetro = retro.retros?.find((item) => item.template_type?.toLowerCase() == nextCategory);

        if (!currentRetro?.updated_at) return;
        const lastSaved = formatLastSaved(currentRetro.updated_at);
        setAutoSaveText(lastSaved);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: string, key: string) => {
        const newObj = { ...content };

        newObj[type] ?? (newObj[type] = {});
        newObj[type][key] = e.target.value;
        setContent(newObj);

        if (isSaveProgresing) return;

        setAutoSaveState('writing');
        setAutoSaveText('작성중...');

        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
        }

        contentChangeTimerRef.current = setTimeout(() => {
            saveContent();
        }, 2000);
    };

    const copyContent = async () => {
        const selectedCategoryKey = selectedCategory.toUpperCase() as keyof typeof RETRO_FORM;

        const selectedCategoryForm = RETRO_FORM[selectedCategoryKey];
        const selectedCategoryContent = content[selectedCategory] ?? {};

        let copyContent = '';

        Object.entries(selectedCategoryForm).map(([key, value]) => {
            copyContent += `
# ${value.label}
${selectedCategoryContent[key] ?? ''}

-----

            `;
        });

        await navigator.clipboard.writeText(copyContent);
        showToast({
            iconName: 'check',
            message: '클립보드에 복사되었습니다.',
            duration: 2000,
        });
    };

    const handleChangeCategory = (value: string) => {
        setSelectedCategory(value);

        if (!selectedRetro) return setAutoSaveText('');

        let currentRetro = selectedRetro.retros?.find((item) => item.template_type?.toLowerCase() == value);
        if (!currentRetro?.updated_at) return setAutoSaveText('');

        const lastSaved = formatLastSaved(currentRetro.updated_at);
        setAutoSaveText(lastSaved);
    };

    const saveContent = async () => {
        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
        }
        setAutoSaveState('saving');
        setAutoSaveText('저장중...');

        setIsSaveProgresing(true);

        let currentRetro = selectedRetro?.retros?.find((item) => item.template_type?.toLowerCase() == selectedCategory);

        // 업데이트
        if (currentRetro?.id) {
            await updateRetroLog({
                id: currentRetro.id,
                data: {
                    content: contentRef.current[selectedCategory],
                },
            }).then((res) => {
                console.log('UPDATE then res', res);
                setSelectedRetro((prev) => mergeRetroLogIntoSelectedRetro(res, prev));
                void queryClient.invalidateQueries({
                    queryKey: retroLogsQueryKey,
                });

                setAutoSaveState('saved');
                setAutoSaveText('마지막 저장 방금 전');

                setIsSaveProgresing(false);
            });

            return;
        }

        await createRetroLog({
            data: {
                retro_date: formatDate(selectedDate, DATE_FORMAT.api),
                template_type: capitalize(selectedCategory) as CreateRetroLogRequestTemplateType,
                content: contentRef.current[selectedCategory],
            },
        }).then((res) => {
            console.log('CREATE then res', res);
            setSelectedRetro((prev) => mergeRetroLogIntoSelectedRetro(res, prev));
            void queryClient.invalidateQueries({
                queryKey: retroLogsQueryKey,
            });

            setAutoSaveState('saved');
            setAutoSaveText('마지막 저장 방금 전');

            setIsSaveProgresing(false);
        });
    };

    const openDeleteModal = (retro: RetroLogListItem) => {
        if (!retro.retros?.length) {
            showToast({
                iconName: 'error',
                message: '삭제할 회고가 없습니다.',
                duration: 3000,
            });
            return;
        }

        setDeleteTargetRetro(retro);
        setDeleteTargetTemplateTypes([]);
        setIsDeleteModalOpen(true);
    };

    const toggleDeleteTargetTemplateType = (value: string) => {
        setDeleteTargetTemplateTypes((prev) => {
            if (prev.includes(value)) {
                return prev.filter((type) => type !== value);
            }

            return [...prev, value];
        });
    };

    const removeDeleteTimers = (ids: string[]) => {
        ids.forEach((id) => {
            delete deleteTimerMapRef.current[id];
        });
    };

    const clearPendingDelete = (ids: string[]) => {
        const timerIds = new Set(
            ids.map((id) => deleteTimerMapRef.current[id]).filter((timerId): timerId is number => Boolean(timerId))
        );

        timerIds.forEach((timerId) => {
            window.clearTimeout(timerId);
        });

        removeDeleteTimers(ids);

        setPendingDeleteRetroIds((prev) => prev.filter((id) => !ids.includes(id)));
    };

    const handleDeleteRetro = async () => {
        if (!deleteTargetRetro) return;

        if (deleteTargetTemplateTypes.length === 0) {
            showToast({
                iconName: 'error',
                message: '삭제할 회고를 선택해주세요.',
                duration: 3000,
            });
            return;
        }

        const targetRetros =
            deleteTargetRetro.retros?.filter((retro) => {
                const templateType = retro.template_type?.toLowerCase();

                return templateType ? deleteTargetTemplateTypes.includes(templateType) : false;
            }) ?? [];

        const targetRetroIds = targetRetros.map((retro) => retro.id).filter((id): id is string => Boolean(id));

        if (targetRetroIds.length === 0) {
            showToast({
                iconName: 'error',
                message: '삭제할 회고 id가 없습니다.',
                duration: 3000,
            });
            return;
        }

        if (targetRetroIds.some((id) => deleteTimerMapRef.current[id])) {
            return;
        }

        if (contentChangeTimerRef.current) {
            window.clearTimeout(contentChangeTimerRef.current);
            contentChangeTimerRef.current = null;
        }

        const deletedCurrentCategory = deleteTargetTemplateTypes.includes(selectedCategory);
        const deletedSelectedDate = selectedRetro?.retro_date === deleteTargetRetro.retro_date;

        setPendingDeleteRetroIds((prev) => [...prev, ...targetRetroIds.filter((id) => !prev.includes(id))]);

        setIsDeleteModalOpen(false);
        setDeleteTargetRetro(undefined);
        setDeleteTargetTemplateTypes([]);

        if (deletedSelectedDate && deletedCurrentCategory) {
            setSelectedRetro(undefined);
            initContent();
            setAutoSaveText('');
        }

        const timerId = window.setTimeout(async () => {
            try {
                await Promise.all(targetRetroIds.map((id) => deleteRetroLog({ id })));
                await queryClient.invalidateQueries({
                    queryKey: retroLogsQueryKey,
                });
            } catch {
                showToast({
                    iconName: 'error',
                    message: '회고 삭제에 실패했어요.',
                    duration: 3000,
                });
            } finally {
                removeDeleteTimers(targetRetroIds);
                setPendingDeleteRetroIds((prev) => prev.filter((id) => !targetRetroIds.includes(id)));
            }
        }, RETRO_DELETE_UNDO_DURATION);

        targetRetroIds.forEach((id) => {
            deleteTimerMapRef.current[id] = timerId;
        });

        showToast({
            message: '회고를 삭제했어요',
            iconName: 'delete',
            textButton: true,
            textButtonLabel: '취소',
            onTextButtonClick: () => clearPendingDelete(targetRetroIds),
            duration: RETRO_DELETE_UNDO_DURATION,
        });
    };

    const getRetroCategoryLabel = (type: string) => {
        switch (type) {
            case RETRO_CATEGORY_NAME.TECH:
                return '기술';
            case RETRO_CATEGORY_NAME.DECISION:
                return '의사결정';
            case RETRO_CATEGORY_NAME.COMMUNICATION:
                return '소통';
            case RETRO_CATEGORY_NAME.EMOTION:
                return '감정';
            default:
                return type;
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteTargetRetro(undefined);
        setDeleteTargetTemplateTypes([]);
    };

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const RetroSkeletonRow = () => {
        return (
            <div className='flex flex-col w-full gap-3 rounded-xl border border-neutral-subtle bg-white p-4 animate-pulse'>
                <div className='h-4 w-[45%] rounded-full bg-gray-100' />
                <div className='flex gap-2'>
                    <div className='h-5 w-12 rounded-full bg-gray-100' />
                    <div className='h-5 w-12 rounded-full bg-gray-100' />
                </div>
            </div>
        );
    };

    return (
        <Container className='overflow-hidden'>
            <div className='flex h-[calc(100dvh-140px)] min-h-0 flex-col overflow-hidden'>
                <SectionHeader title='회고' type='main' />
                <SidebarContentLayout
                    className='min-h-0 flex-1 items-stretch overflow-hidden'
                    gap='24px'
                    sidebarWidth='320px'
                >
                    <aside className='h-full min-h-0'>
                        <section className={panelClassName}>
                            <SearchInput placeholder='제목 또는 내용으로 검색하세요' />
                            <div className='mt-4 mb-2 flex w-full justify-between'>
                                <p className='text-neutral-darker'>전체</p>
                                <Badge label={`총 ${retroLogs.length}건`} />
                            </div>

                            <div className='flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto mask-b-from-97% pb-10'>
                                {isRetroLogsLoading && visibleRetroArr.length === 0
                                    ? Array.from({ length: 3 }, (_, index) => (
                                          <RetroSkeletonRow key={`retro-skeleton-${index}`} />
                                      ))
                                    : null}

                                {!isRetroLogsLoading && visibleRetroArr.length === 0 ? (
                                    <div className='flex min-h-40 w-full shrink-0 items-center justify-center rounded-[28px] border-2 border-dashed border-gray-100 bg-white px-6 py-10 text-center'>
                                        <p className='text-lg font-semibold leading-7 text-neutral'>
                                            아직 작성된 회고가 없습니다.
                                        </p>
                                    </div>
                                ) : null}

                                {visibleRetroArr.map((retro: RetroLogListItem) => (
                                    <RetroCard
                                        key={retro.retro_date}
                                        retro={retro}
                                        state={
                                            retro.retro_date && isSameDate(retro.retro_date, selectedDate)
                                                ? 'selected'
                                                : 'default'
                                        }
                                        onClick={() => handleRetroClick(retro)}
                                        onDeleteClick={() => openDeleteModal(retro)}
                                    />
                                ))}
                            </div>

                            <Button fullWidth={true} variant='outline'>
                                캘린더에서 보기
                            </Button>
                        </section>
                    </aside>
                    <section className='h-full min-h-0'>
                        <section className={panelClassName + ' items-end'}>
                            <div
                                ref={calendarWrapperRef}
                                className='relative flex w-full items-center justify-between gap-4'
                            >
                                <div className='flex min-w-0 items-center gap-2.5'>
                                    <button
                                        aria-label='이전 날짜로 이동'
                                        className='inline-flex shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-neutral-darker hover:cursor-pointer'
                                        onClick={() => moveSelectedDate(-1)}
                                        type='button'
                                    >
                                        <Icon name='arrow_left' size={20} />
                                    </button>

                                    <button
                                        className='inline-flex min-w-0 items-center rounded-lg px-3 py-2 transition-colors hover:bg-neutral-subtle hover:cursor-pointer'
                                        onClick={() => setIsOpenCalendar((prev) => !prev)}
                                        type='button'
                                    >
                                        <p className='truncate text-2xl leading-none font-bold text-black'>
                                            {formatDate(selectedDate, DATE_FORMAT.log)}
                                        </p>
                                    </button>

                                    <button
                                        aria-label='다음 날짜로 이동'
                                        className='inline-flex shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-neutral-darker disabled:text-neutral disabled:cursor-not-allowed hover:cursor-pointer'
                                        disabled={selectedDate.getTime() >= todayStart.getTime()}
                                        onClick={() => moveSelectedDate(1)}
                                        type='button'
                                    >
                                        <Icon name='arrow_right' size={20} />
                                    </button>
                                </div>
                                <div className='flex items-center text-neutral text-sm whitespace-nowrap'>
                                    {autoSaveState === 'saving' ? (
                                        <div className='animate-spin h-4 w-4 border-3 border-gray-300 border-t-primary rounded-full mr-1' />
                                    ) : (
                                        ''
                                    )}
                                    {autoSaveText}
                                </div>

                                {isOpenCalendar ? (
                                    <div className='absolute top-full left-0 z-20 mt-2 w-[22rem] max-w-full rounded-2xl border border-neutral-lighter bg-white p-4 shadow-shadow-1'>
                                        <Calendar
                                            maxDate={todayStart}
                                            selectedDate={selectedDate}
                                            onSelectDate={handleCalendarDateSelect}
                                        />
                                    </div>
                                ) : null}
                            </div>

                            <SegmentedControl
                                className='mt-5 mb-3'
                                ariaLabel='기록 타입'
                                options={[
                                    { value: RETRO_CATEGORY_NAME.TECH, label: '기술' },
                                    { value: RETRO_CATEGORY_NAME.DECISION, label: '의사결정' },
                                    { value: RETRO_CATEGORY_NAME.COMMUNICATION, label: '소통' },
                                    { value: RETRO_CATEGORY_NAME.EMOTION, label: '감정' },
                                ]}
                                defaultValue={RETRO_CATEGORY_NAME.TECH}
                                value={selectedCategory}
                                onValueChange={handleChangeCategory}
                            />

                            <RetroItem
                                content={content}
                                selectedCategory={selectedCategory}
                                onChangeTextarea={handleTextareaChange}
                            />

                            <div>
                                <Button
                                    className='mt-3 mr-2 px-6'
                                    variant='outline'
                                    size='lg'
                                    disabled={!Object.values(content[selectedCategory] ?? {}).some((v) => v?.trim())}
                                    onClick={copyContent}
                                >
                                    내용 복사
                                </Button>

                                <Button
                                    className='mt-3 px-10'
                                    variant='filled'
                                    size='lg'
                                    disabled={!Object.values(content[selectedCategory] ?? {}).some((v) => v?.trim())}
                                    onClick={saveContent}
                                >
                                    저장
                                </Button>
                            </div>
                        </section>
                    </section>
                </SidebarContentLayout>
            </div>

            {isDeleteModalOpen && deleteTargetRetro ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]'>
                    <div
                        className='w-full max-w-[420px] rounded-[1.75rem] border border-neutral-lighter bg-white p-6 shadow-shadow-1'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='delete-retro-title'
                    >
                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <h2 id='delete-retro-title' className='text-2xl font-bold text-black'>
                                    회고 삭제
                                </h2>
                                <p className='mt-2 text-base leading-6 text-neutral-darker'>
                                    {deleteTargetRetro.retro_date} 회고 중 삭제할 항목을 선택하세요.
                                </p>
                            </div>

                            <button
                                aria-label='닫기'
                                className='inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-neutral transition-colors hover:bg-neutral-subtle hover:text-neutral-darker'
                                onClick={closeDeleteModal}
                                type='button'
                            >
                                <Icon name='close' size={20} />
                            </button>
                        </div>

                        <div className='mt-5 flex flex-col gap-2'>
                            {deleteTargetRetro.retros?.map((retro) => {
                                const value = retro.template_type?.toLowerCase();

                                if (!value) return null;

                                const checked = deleteTargetTemplateTypes.includes(value);

                                return (
                                    <label
                                        key={retro.id ?? value}
                                        className={[
                                            'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors',
                                            checked
                                                ? 'border-danger bg-danger/5 text-danger'
                                                : 'border-neutral-subtle bg-white text-neutral-darker hover:border-neutral',
                                        ].join(' ')}
                                    >
                                        <input
                                            className='size-4 accent-danger'
                                            type='checkbox'
                                            value={value}
                                            checked={checked}
                                            onChange={() => toggleDeleteTargetTemplateType(value)}
                                        />
                                        <span className='text-base font-medium'>{getRetroCategoryLabel(value)}</span>
                                    </label>
                                );
                            })}
                        </div>

                        <div className='mt-6 grid grid-cols-2 gap-2'>
                            <Button fullWidth variant='outline' onClick={closeDeleteModal}>
                                취소
                            </Button>
                            <Button
                                fullWidth
                                variant='filled'
                                className='!bg-danger hover:!bg-danger-darker'
                                disabled={deleteTargetTemplateTypes.length === 0}
                                onClick={handleDeleteRetro}
                            >
                                삭제하기
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Container>
    );
}
