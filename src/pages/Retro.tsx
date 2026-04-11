import type { CreateRetroLogRequestTemplateType, RetroLogListItem } from '@/api/generated/model';
import { useCreateRetroLog, useUpdateRetroLog } from '@/api/generated/retro-logs/retro-logs';
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

    const testRetroArr: RetroLogListItem[] = [
        {
            retro_date: '2026-04-10',
            template_types: ['Communication', 'Tech'],
            count: 2,
            latest_created_at: '2026-04-11T03:02:42.128Z',
            retros: [
                {
                    id: '8e7c5999-cb98-412a-8ed2-2630150c7820',
                    user_id: '18d23066-e476-49de-851e-fa8aef41241d',
                    daily_log_id: undefined,
                    retro_date: '2026-04-10',
                    template_type: 'Communication',
                    content: {
                        improvements: '명세 변경 시 Swagger와 Notion을 동시에 갱신하겠다.',
                        feedback_received: '400 에러와 field를 명시해 달라는 요청을 받았다.',
                        communication_friction: '초기 문서에는 쿼리 파라미터가 하나만 필수라고 적혀 있었다.',
                        communication_highlights: '짧은 미팅으로 API 계약을 빠르게 맞췄다.',
                    },
                    is_dirty: false,
                    draft_content: null,
                    created_at: '2026-04-11T03:02:42.128Z',
                    updated_at: '2026-04-11T03:02:42.128Z',
                },
                {
                    id: 'c61bf311-e5f0-4fe7-9570-3ca922df65c6',
                    user_id: '18d23066-e476-49de-851e-fa8aef41241d',
                    daily_log_id: undefined,
                    retro_date: '2026-04-10',
                    template_type: 'Tech',
                    content: {
                        next_to_try: '회고 content 검색에 인덱스/쿼리 전략을 실험해본다.',
                        learned_today: 'Prisma $transaction으로 생성과 통계 갱신을 한 번에 처리하는 패턴을 배웠다.',
                        applied_technology: 'optional JSON 필드 null 처리에 Prisma.DbNull을 적용했다.',
                        technical_difficulty: 'PATCH 시 Json 타입과 DbNull 조합에서 타입 에러가 났다!!!!',
                    },
                    is_dirty: false,
                    draft_content: null,
                    created_at: '2026-04-11T03:01:57.920Z',
                    updated_at: '2026-04-11T07:10:57.530Z',
                },
            ],
        },
        {
            retro_date: '2026-04-09',
            template_types: ['Emotion'],
            count: 1,
            latest_created_at: '2026-04-11T03:02:54.756Z',
            retros: [
                {
                    id: 'c0a5f490-edb8-4a5b-a9a4-0f4617a305ee',
                    user_id: '18d23066-e476-49de-851e-fa8aef41241d',
                    daily_log_id: undefined,
                    retro_date: '2026-04-09',
                    template_type: 'Emotion',
                    content: {
                        mood_today: '병합 해소 후 안도감이 크다. 다소 피곤하다.',
                        grateful_for: '리뷰 코멘트가 구체적이어서 수정이 빨랐다!',
                        what_drained: '인증·회고 작업을 번갈아 하며 맥락 전환이 잦았다.',
                        what_energized: '동료와 짝으로 디버깅한 시간.',
                    },
                    is_dirty: false,
                    draft_content: null,
                    created_at: '2026-04-11T03:02:54.756Z',
                    updated_at: '2026-04-11T03:10:08.083Z',
                },
            ],
        },
    ];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [content, setContent] = useState<Record<string, Record<string, string>>>({});
    const [selectedCategory, setSelectedCategory] = useState(RETRO_CATEGORY_NAME.TECH);
    const [selectedRetro, setSelectedRetro] = useState<RetroLogListItem>();
    const [autoSaveText, setAutoSaveText] = useState('');
    const [autoSaveState, setAutoSaveState] = useState<'' | 'writing' | 'saving' | 'saved' | 'error'>('');
    const [isSaveProgresing, setIsSaveProgresing] = useState(false);

    const { mutateAsync: createRetroLog } = useCreateRetroLog();
    const { mutateAsync: updateRetroLog } = useUpdateRetroLog();

    const { showToast } = useToast();

    const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
    const contentChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const contentRef = useRef(content);

    useEffect(() => {
        initContent();
    }, []);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

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

    const handleCalendarDateSelect = (date: Date) => {
        if (date.getTime() > todayStart.getTime()) {
            return;
        }

        let retro = testRetroArr.find((retro) => {
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
        setSelectedDate((currentDate) => {
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + days);

            if (nextDate.getTime() > todayStart.getTime()) {
                return currentDate;
            }

            return nextDate;
        });
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
        console.log('SAVE currentRetro', currentRetro);

        // 업데이트
        if (currentRetro?.id) {
            await updateRetroLog({
                id: currentRetro.id,
                data: {
                    content: contentRef.current[selectedCategory],
                },
            }).then((res) => {
                console.log('UPDATE then res', res);
                setSelectedRetro(res);

                setAutoSaveState('saved');
                setAutoSaveText('마지막 저장 방금 전');

                setIsSaveProgresing(false);
            });

            return;
        }

        console.log('SAVE selectedCategory', selectedCategory);
        console.log('SAVE contentRef.current', contentRef.current);
        console.log('SAVE contentRef.current[selectedCategory]', contentRef.current[selectedCategory]);

        await createRetroLog({
            data: {
                retro_date: formatDate(selectedDate, DATE_FORMAT.api),
                template_type: capitalize(selectedCategory) as CreateRetroLogRequestTemplateType,
                content: contentRef.current[selectedCategory],
            },
        }).then((res) => {
            console.log('res', res);
            // TODO: Retro 목록 조회 코드 필요
            // setSelectedRetro(res);

            setAutoSaveState('saved');
            setAutoSaveText('마지막 저장 방금 전');

            setIsSaveProgresing(false);
        });
    };

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
                                <Badge label={`총 ${testRetroArr.length}건`} />
                            </div>

                            <div className='flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto mask-b-from-97% pb-10'>
                                {testRetroArr.map((retro: RetroLogListItem) => (
                                    <RetroCard
                                        key={retro.retro_date}
                                        retro={retro}
                                        state={
                                            retro.retro_date && isSameDate(retro.retro_date, selectedDate)
                                                ? 'selected'
                                                : 'default'
                                        }
                                        onClick={() => handleRetroClick(retro)}
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
        </Container>
    );
}
