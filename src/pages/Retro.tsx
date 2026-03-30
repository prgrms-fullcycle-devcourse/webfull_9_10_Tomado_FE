import { SearchInput, SegmentedControl, TextArea } from '@/components/form';
import { Container, SectionHeader, SidebarContentLayout } from '@/components/layout';
import { Badge, Button, Icon, RetroCard } from '@/components/ui';
import Calendar from '@/components/ui/Calendar';
import { useRef, useState } from 'react';

export default function Retro() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const testRetroArr = [
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            retro_date: '2026-03-28',
            template_type: 'Tech',
            content: {
                what_went_well: 'API 명세서 설계가 예상보다 빨리 완료됨',
                what_to_improve: '에러 케이스 예시 작성이 미흡했음',
                action_items: '다음 PR 전에 에러 시나리오 테스트 케이스 추가',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-28T19:00:00Z',
            updated_at: '2026-03-28T19:30:00Z',
        },
        {
            id: 'b8c9d0e1-f2a3-4567-0123-678901233567',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            daily_log_id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            retro_date: '2026-03-18',
            template_type: 'Tech',
            content: {
                what_went_well: 'API 명세서 설계가 예상보다 빨리 완료됨',
                what_to_improve: '에러 케이스 예시 작성이 미흡했음',
                action_items: '다음 PR 전에 에러 시나리오 테스트 케이스 추가',
            },
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-18T19:00:00Z',
            updated_at: '2026-03-18T19:30:00Z',
        },
    ];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [content, setContent] = useState<ContentState>({
        tech: ['배운 기술이에요', ' 적용한 기술이에요', '기술적 어려움 이에요', '다음에 시도할 내용이에요'],
    });

    type Retro = {
        id: string;
        user_id: string;
        log_date: string;
        content: string;
        title: string;
        tags: string[];
        is_dirty: boolean;
        draft_content: null;
        created_at: string;
        updated_at: string;
    };

    type ContentState = {
        [key: string]: string[];
    };

    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

    const calendarWrapperRef = useRef<HTMLDivElement | null>(null);

    const formatSectionHeaderDate = (date: Date): string => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        });
    };

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
        // setContent(log.content);
        // setTitle(log.title);
        // setSelectedDate(new Date(`${log.log_date}T00:00:00`));
        // const lastSaved = formatLastSaved(log.updated_at);
        // setAutoSaveText(lastSaved);
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
                                            {formatSectionHeaderDate(selectedDate)}
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
                                    { value: 'tech', label: '기술' },
                                    { value: 'decision', label: '의사결정' },
                                    { value: 'communication', label: '소통' },
                                    { value: 'emotion', label: '감정' },
                                ]}
                                defaultValue='tech'
                            />

                            <div className='grid grid-cols-2 gap-3 w-full h-full auto-rows-fr'>
                                <TextArea
                                    className='h-full flex flex-col min-h-0 [&_label+div]:flex-1 [&_textarea]:flex-1 [&_textarea]:min-h-0 [&_textarea]:resize-none [&_textarea]:overflow-y-auto'
                                    label='오늘 배운 기술'
                                    placeholder='어떤 기술이나 도구를 배웠나요?'
                                    value={content['tech'][0]}
                                />
                                <TextArea
                                    className='h-full flex flex-col min-h-0 [&_label+div]:flex-1 [&_textarea]:flex-1 [&_textarea]:min-h-0 [&_textarea]:resize-none [&_textarea]:overflow-y-auto'
                                    label='적용한 기술'
                                    placeholder='실제로 어떻게 적용했나요?'
                                    value={content['tech'][1]}
                                />
                                <TextArea
                                    className='h-full flex flex-col min-h-0 [&_label+div]:flex-1 [&_textarea]:flex-1 [&_textarea]:min-h-0 [&_textarea]:resize-none [&_textarea]:overflow-y-auto'
                                    label='기술적 어려움'
                                    placeholder='어떤 기술적 문제를 만났나요?'
                                    value={content['tech'][2]}
                                />
                                <TextArea
                                    className='h-full flex flex-col min-h-0 [&_label+div]:flex-1 [&_textarea]:flex-1 [&_textarea]:min-h-0 [&_textarea]:resize-none [&_textarea]:overflow-y-auto'
                                    label='다음에 시도할 것'
                                    placeholder='다음에 시도해볼 기술은 무엇인가요?'
                                    value={content['tech'][3]}
                                />
                            </div>

                            <div>
                                <Button
                                    className='mt-3 mr-2 px-6'
                                    variant='outline'
                                    size='lg'
                                    // disabled={!content}
                                    // onClick={saveContent}
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
