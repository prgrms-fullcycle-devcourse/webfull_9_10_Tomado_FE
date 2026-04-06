import RetroItem from '@/features/log/components/RetroItem';
import { RETRO_CATEGORY_NAME, RETRO_FORM } from '@/features/log/retroConstants';
import { useToast } from '@/hooks';
import { DATE_FORMAT, formatDate } from '@/utils';
import { SearchInput, SegmentedControl } from '@@/form';
import { Container, SectionHeader, SidebarContentLayout } from '@@/layout';
import { Badge, Button, Calendar, Icon, RetroCard } from '@@/ui';
import { useRef, useState } from 'react';

export default function Retro() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const testRetroArr = [
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            retro_date: '2026-04-01',
            template_type: 'Tech',
            content: {
                learned_today: 'Prisma $transaction으로 생성과 통계 갱신을 한 번에 처리하는 패턴을 배웠다.',
                applied_technology: 'optional JSON 필드 null 처리에 Prisma.DbNull을 적용했다.',
                technical_difficulty: 'PATCH 시 Json 타입과 DbNull 조합에서 타입 에러가 났다.',
                next_to_try: '회고 content 검색에 인덱스/쿼리 전략을 실험해본다.',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-04-01T19:00:00Z',
            updated_at: '2026-04-01T19:30:00Z',
        },
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            retro_date: '2026-04-01',
            template_type: 'Decision',
            content: {
                decision_made:
                    '같은 날짜에 템플릿별로 회고를 나누고, 조회는 date+daily_log_id 또는 date+template_type으로 한다.',
                decision_reason: '일일 로그 없이도 회고를 남길 수 있어 템플릿으로 구분해야 한다.',
                outcome_impact: 'CONFLICT는 날짜+템플릿 단위로만 발생한다.',
                alternatives_considered: '날짜당 단일 회고만 허용하는 안은 폐기했다.',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-04-01T19:00:00Z',
            updated_at: '2026-04-01T19:30:00Z',
        },
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            retro_date: '2026-04-01',
            template_type: 'Communication',
            content: {
                communication_highlights: '짧은 미팅으로 API 계약을 빠르게 맞췄다.',
                communication_friction: '초기 문서에는 쿼리 파라미터가 하나만 필수라고 적혀 있었다.',
                feedback_received: '400 에러와 field를 명시해 달라는 요청을 받았다.',
                improvements: '명세 변경 시 Swagger와 Notion을 동시에 갱신하겠다.',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-04-01T19:00:00Z',
            updated_at: '2026-04-01T19:30:00Z',
        },
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            retro_date: '2026-04-01',
            template_type: 'Emotion',
            content: {
                mood_today: '병합 해소 후 안도감이 크다. 다소 피곤하다.',
                what_energized: '동료와 짝으로 디버깅한 시간.',
                what_drained: '인증·회고 작업을 번갈아 하며 맥락 전환이 잦았다.',
                grateful_for: '리뷰 코멘트가 구체적이어서 수정이 빨랐다.',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-04-01T19:00:00Z',
            updated_at: '2026-04-01T19:30:00Z',
        },
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901234577',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012347',
            retro_date: '2026-03-28',
            template_type: 'Emotion',
            content: {
                mood_today: '병합 해소 후 안도감이 크다.',
                what_energized: '동료와 짝으로 디버깅한 시간.',
                what_drained: '인증·회고 작업을 번갈아 하며 맥락 전환이 잦았다.',
                grateful_for: '리뷰 코멘트가 구체적이어서 수정이 빨랐다.',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-28T19:00:00Z',
            updated_at: '2026-03-28T19:30:00Z',
        },
    ];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [content, setContent] = useState<Record<string, Record<string, string>>>({});
    const [selectedCategory, setSelectedCategory] = useState(RETRO_CATEGORY_NAME.TECH);

    const { showToast } = useToast();

    // type Retro = {
    //     id: string;
    //     user_id: string;
    //     log_date: string;
    //     content: string;
    //     title: string;
    //     tags: string[];
    //     is_dirty: boolean;
    //     draft_content: null;
    //     created_at: string;
    //     updated_at: string;
    // };

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

    // const handleRetroClick = (retro: Retro): void => {
    // setContent(log.content);
    // setTitle(log.title);
    // setSelectedDate(new Date(`${log.log_date}T00:00:00`));
    // const lastSaved = formatLastSaved(log.updated_at);
    // setAutoSaveText(lastSaved);
    // };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: string, key: string) => {
        const newObj = { ...content };

        newObj[type] ?? (newObj[type] = {});
        newObj[type][key] = e.target.value;
        setContent(newObj);
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

    const copyContent = async () => {
        console.log(content[selectedCategory]);
        const selectedCategoryKey = selectedCategory.toUpperCase() as keyof typeof RETRO_FORM;

        const selectedCategoryForm = RETRO_FORM[selectedCategoryKey];
        const selectedCategoryContent = content[selectedCategory] ?? {};

        let copyContent = '';

        Object.entries(selectedCategoryForm).map(([key, value]) => {
            console.log('key', key);
            console.log('value', value);

            copyContent += `
# ${value.label}
${selectedCategoryContent[key] ?? ''}

-----

            `;
        });

        console.log('----');
        console.log(copyContent);

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
                                <Badge label='총 0건' />
                            </div>

                            <div className='flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto mask-b-from-97% pb-10'>
                                {testRetroArr.map((retro) => (
                                    <RetroCard
                                        key={retro.id}
                                        date={relativeDate(retro.created_at)}
                                        // onClick={() => handleRetroClick(retro)}
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
