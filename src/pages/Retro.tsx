import RetroItem from '@/features/log/components/RetroItem';
import { RETRO_CATEGORY_NAME, RETRO_FORM } from '@/features/log/retroConstants';
import { useToast } from '@/hooks';
import { DATE_FORMAT, formatDate } from '@/utils';
import { isSameDate } from '@/utils/dateUtils';
import { SearchInput, SegmentedControl } from '@@/form';
import { Container, SectionHeader, SidebarContentLayout } from '@@/layout';
import { Badge, Button, Calendar, Icon, RetroCard } from '@@/ui';
import { useRef, useState } from 'react';

export type Retro = {
    retro_date: string;
    template_types: string[];
    count: number;
    latest_created_at: string;
    retros: {
        id: string;
        user_id: string;
        daily_log_id: string;
        retro_date: string;
        template_type: string;
        content: {
            [key in string]: string;
        };
        is_dirty: boolean;
        draft_content: null;
        created_at: string;
        updated_at: string;
    }[];
};

export default function Retro() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const testRetroArr: Retro[] = [
        {
            retro_date: '2026-03-18',
            template_types: ['Emotion'],
            count: 1,
            latest_created_at: '2026-03-18T09:10:00Z',
            retros: [
                {
                    id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
                    user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
                    retro_date: '2026-03-18',
                    template_type: 'Emotion',
                    content: {
                        mood_today: '피곤했지만 성취감이 있었다.',
                        what_energized: '팀원과 빠르게 이슈를 해결한 순간.',
                        what_drained: '잦은 컨텍스트 스위칭.',
                        grateful_for: '정확한 피드백을 받은 것.',
                    },
                    is_dirty: false,
                    draft_content: null,
                    created_at: '2026-03-18T09:10:00Z',
                    updated_at: '2026-03-18T09:20:00Z',
                },
            ],
        },
        {
            retro_date: '2026-03-14',
            template_types: ['Tech', 'Communication'],
            count: 2,
            latest_created_at: '2026-03-14T11:20:00Z',
            retros: [
                {
                    id: 'c9d0e1f2-a3b4-5678-0123-789012345678',
                    user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
                    retro_date: '2026-03-14',
                    template_type: 'Tech',
                    content: {
                        learned_today: '트랜잭션 처리 패턴을 학습했다.',
                        applied_technology: 'Prisma transaction을 적용했다.',
                        technical_difficulty: 'JSON 타입 정합성 이슈가 있었다.',
                        next_to_try: '검색 성능 최적화를 시도한다.',
                    },
                    is_dirty: false,
                    draft_content: null,
                    created_at: '2026-03-14T10:00:00Z',
                    updated_at: '2026-03-14T10:30:00Z',
                },
                {
                    id: 'd0e1f2a3-b4c5-6789-0123-890123456789',
                    user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
                    retro_date: '2026-03-14',
                    template_type: 'Communication',
                    content: {
                        communication_highlights: '논의 포인트를 빠르게 합의했다.',
                        communication_friction: '요구사항 전달이 일부 늦었다.',
                        feedback_received: '에러 메시지 명확화 요청을 받았다.',
                        improvements: '변경 사항 공유 템플릿을 표준화한다.',
                    },
                    is_dirty: false,
                    draft_content: null,
                    created_at: '2026-03-14T11:00:00Z',
                    updated_at: '2026-03-14T11:20:00Z',
                },
            ],
        },
    ];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [content, setContent] = useState<Record<string, Record<string, string>>>({});
    const [selectedCategory, setSelectedCategory] = useState(RETRO_CATEGORY_NAME.TECH);

    const { showToast } = useToast();

    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

    const calendarWrapperRef = useRef<HTMLDivElement | null>(null);

    const handleCalendarDateSelect = (date: Date) => {
        if (date.getTime() > todayStart.getTime()) {
            return;
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

    const handleRetroClick = (retro: Retro): void => {
        if (!retro) return;

        const newObj: Record<string, { [key: string]: string }> = {};

        retro.retros.map((retro) => {
            newObj[retro.template_type.toLowerCase()] = { ...retro.content };
        });

        setContent(newObj);
        setSelectedDate(new Date(`${retro.retro_date}T00:00:00`));
        setSelectedCategory(retro.template_types[0].toLowerCase());

        // const lastSaved = formatLastSaved(log.updated_at);
        // setAutoSaveText(lastSaved);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: string, key: string) => {
        const newObj = { ...content };

        newObj[type] ?? (newObj[type] = {});
        newObj[type][key] = e.target.value;
        setContent(newObj);
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
                                {testRetroArr.map((retro: Retro) => (
                                    <RetroCard
                                        key={retro.retro_date}
                                        retro={retro}
                                        state={isSameDate(retro.retro_date, selectedDate) ? 'selected' : 'default'}
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
                                {/* <div className='flex items-center text-neutral text-sm whitespace-nowrap'>
                                    {autoSaveSate === 'saving' ? (
                                        <div className='animate-spin h-4 w-4 border-3 border-gray-300 border-t-primary rounded-full mr-1' />
                                    ) : (
                                        ''
                                    )}
                                    {autoSaveText}
                                </div> */}

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
                                onValueChange={(value: string) => setSelectedCategory(value)}
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
                                    // disabled={!content}
                                    // onClick={saveContent}
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
