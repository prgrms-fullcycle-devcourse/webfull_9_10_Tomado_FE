import { Input, SearchInput } from '@/components/form';
import MdEditor from '@/features/log/components/MdEditor';
import { Container, SectionHeader, SidebarContentLayout } from '@/components/layout';
import { Badge, Button, DailyLogCard } from '@/components/ui';
import { useState, useEffect } from 'react';

export default function DailyLog() {
    const [content, setContent] = useState('');
    const [autoSaveText, setAutoSaveText] = useState('');
    const [autoSaveSate, setAutoSaveSate] = useState<'' | 'writing' | 'saving' | 'saved' | 'error'>('');

    type Log = {
        id: string;
        user_id: string;
        log_date: string;
        content: string;
        tags: string[];
        is_dirty: boolean;
        draft_content: null;
        created_at: string;
        updated_at: string;
    };

    const testLogArr = [
        {
            id: 'f6a7b8c9-d0e1-2345-f014-456789012345',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            log_date: '2026-03-27',
            title: '제목을 뭐로할까?',
            content: '## 오늘 한 일\n- UI 작업\n- API 연동',
            tags: ['frontend', 'docs'],
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-27T09:00:00Z',
            updated_at: '2026-03-27T18:00:00Z',
        },
        {
            id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            log_date: '2026-03-26',
            title: '엄청 힘들었던 날',
            content: '## 오늘 한 일\n- 점심먹기\n- 저녁먹기',
            tags: ['frontend', 'docs'],
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-26T09:00:00Z',
            updated_at: '2026-03-26T18:00:00Z',
        },
        {
            id: 'f6a7b8c9-d0e1-2345-f013-456789012345',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            log_date: '2026-03-19',
            title: '기분이 매우 좋았고 모든것이 잘풀려서 뭘 하든 잘되던 날',
            content: '## 오늘 한 일\n- 친구만나기\n- 놀러가기',
            tags: ['frontend', 'docs'],
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-19T09:00:00Z',
            updated_at: '2026-03-19T18:00:00Z',
        },
        {
            id: 'f6a7b8c9-d0e1-2345-f052-456789012345',
            user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            log_date: '2026-03-09',
            title: '알차게 보낸 날',
            content: '## 오늘 한 일\n- API 명세서 작성 완료\n- ERD 리뷰',
            tags: ['backend', 'docs'],
            is_dirty: false,
            draft_content: null,
            created_at: '2026-03-09T09:00:00Z',
            updated_at: '2026-03-09T18:00:00Z',
        },
    ];

    useEffect(() => {
        if (!content) return;

        setAutoSaveText('작성중... ');
        const timer = setTimeout(() => {
            saveContent();
        }, 2000);

        return () => clearTimeout(timer);
    }, [content]);

    const saveContent = (): void => {
        setAutoSaveSate('saving');
        setAutoSaveText('저장중... ');

        // TODO: 저장 API 다녀온 후
        setTimeout(() => {
            setAutoSaveSate('saved');
            setAutoSaveText('마지막 저장 방금 전');
        }, 1000);
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
        const m = String(target.getMonth() + 1).padStart(1, '0');
        const d = String(target.getDate()).padStart(1, '0');

        return `${m}월 ${d}일`;
    };

    const handleLogClick = (log: Log): void => {};

    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

    return (
        <Container className='overflow-hidden'>
            <div className='flex h-[calc(100dvh-140px)] min-h-0 flex-col overflow-hidden'>
                <SectionHeader title='데일리로그' type='main' />
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
                                {testLogArr.map((log) => (
                                    <DailyLogCard
                                        key={log.id}
                                        dateLabel={relativeDate(log.created_at)}
                                        title={log.title}
                                        onClick={() => handleLogClick(log)}
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
                            <div className='flex w-full'>
                                <SectionHeader
                                    datePicker
                                    onNextClick={() => {}}
                                    onPreviousClick={() => {}}
                                    title='2026년 3월 18일 수요일'
                                    type='sub'
                                />
                                <div className='flex items-center text-neutral text-sm whitespace-nowrap'>
                                    {autoSaveSate === 'saving' ? (
                                        <div className='animate-spin h-4 w-4 border-3 border-gray-300 border-t-primary rounded-full mr-1' />
                                    ) : (
                                        ''
                                    )}
                                    {autoSaveText}
                                </div>
                            </div>
                            <Input className='mt-5 mb-3' placeholder='제목을 입력해 주세요' />
                            <MdEditor content={content} contentChange={(value) => setContent(value || '')}></MdEditor>
                            <Button className='mt-3 px-10' variant='filled' size='lg' disabled={!content}>
                                저장
                            </Button>
                        </section>
                    </section>
                </SidebarContentLayout>
            </div>
        </Container>
    );
}
