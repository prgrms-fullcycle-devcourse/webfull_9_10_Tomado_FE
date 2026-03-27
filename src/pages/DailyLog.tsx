import { Input, SearchInput } from '@/components/form';
import MdEditor from '@/features/log/components/MdEditor';
import { Container, SectionHeader, SidebarContentLayout } from '@/components/layout';
import { Badge, Button, DailyLogCard } from '@/components/ui';
import { useState } from 'react';

export default function DailyLog() {
    const [content, setContent] = useState('');

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
                                <DailyLogCard dateLabel='어제' title='제목 뭘로 할까?' />
                                <DailyLogCard
                                    dateLabel='2일 전'
                                    title='제목 뭘로 할까? 엄청나게 긴 제목으로 하고싶은데?'
                                />
                                <DailyLogCard dateLabel='3월 14일' title='React 기본 정리' />
                            </div>

                            <Button fullWidth={true} variant='outline'>
                                캘린더에서 보기
                            </Button>
                        </section>
                    </aside>
                    <section className='h-full min-h-0'>
                        <section className={panelClassName}>
                            <SectionHeader
                                datePicker
                                onNextClick={() => {}}
                                onPreviousClick={() => {}}
                                title='2026년 3월 18일 수요일'
                                type='sub'
                            />
                            <Input className='mt-5 mb-3' placeholder='제목을 입력해 주세요' />
                            <MdEditor content={content} contentChange={(value) => setContent(value || '')}></MdEditor>
                        </section>
                    </section>
                </SidebarContentLayout>
            </div>
        </Container>
    );
}
