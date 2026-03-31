import { useState } from 'react';

import { DATE_FORMAT, formatDate, getTodayDate, parseDate } from '@/utils';
import { Container, SectionHeader, DoubleColumnLayout } from '@@/layout';
import { SegmentedControl } from '@@/form';
import { Icon, Tag } from '@@/ui';
import { TodoPanel } from '@@@/todo';
import { Calendar, HeatMap } from '@@@/stats';

const pageClassName = 'flex w-full flex-col gap-2.5';
const panelClassName = 'w-full rounded-2xl bg-white p-5 shadow-1';
const summarySectionClassName = 'grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center';
const summaryTitleClassName = 'text-2xl font-bold';
const summaryRangeClassName = 'text-sm text-neutral';
const metricsGridClassName = 'flex gap-2.5 justify-end';
const metricClassName = 'flex flex-col items-center gap-1.5 text-center p-2.5';
const metricValueClassName = 'text-2xl font-bold text-gray-700';
const metricLabelClassName = 'text-sm';
const historyMetricsClassName =
    'flex flex-col w-full items-center gap-1.5 text-center px-2.5 py-5 bg-neutral-subtle rounded-2xl';
const historyMetricValueClassName = 'text-3xl font-bold text-gray-700';
const detailPanelClassName = 'flex h-full flex-col gap-2.5';
const detailCardClassName = 'rounded-xl border border-neutral-lighter px-5 py-4';
const detailCardHeaderClassName = 'mb-3 flex items-start justify-between gap-3';
const detailLogTitleClassName = 'mb-2 text-sm font-semibold text-neutral-darker';
const detailLogDescriptionClassName = 'text-xs text-neutral-darker line-clamp-3';
const retroTagListClassName = 'flex flex-wrap gap-1.5';

interface DashboardSummaryResponse {
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    };
    stats: {
        streakDays: number;
        pomodoroSessions: number;
        focusHours: number;
        dailyLogCount: number;
        retroCount: number;
    };
}

const dashboardSummaryMock: DashboardSummaryResponse = {
    dateRange: {
        startDate: '2024-03-02',
        endDate: getTodayDate(),
    },
    stats: {
        streakDays: 12,
        pomodoroSessions: 342,
        focusHours: 171,
        dailyLogCount: 28,
        retroCount: 12,
    },
};

const summaryMetrics = (summary: DashboardSummaryResponse['stats']) => [
    { label: '연속스트릭', value: `${summary.streakDays}일`, accent: true },
    { label: '포모도로', value: `${summary.pomodoroSessions}세션` },
    { label: '집중 시간', value: `${summary.focusHours}시간` },
    { label: '데일리로그', value: `${summary.dailyLogCount}건` },
    { label: '회고', value: `${summary.retroCount}건` },
];

// TODO: useDailyLogByDate 훅 분리
const testDailyLogArr = [
    {
        id: 'f6a7b8c9-d0e1-2345-f014-456789012345',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        log_date: '2026-03-31',
        title: '제목을 뭐로할까?',
        content:
            '## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동## 오늘 한 일\n- UI 작업\n- API 연동',
        tags: ['frontend', 'docs'],
        is_dirty: false,
        draft_content: null,
        created_at: '2026-03-31T09:00:00Z',
        updated_at: '2026-03-31T18:00:00Z',
    },
    {
        id: 'f6a7b8c9-d0e1-2345-f015-456789012345',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        log_date: '2026-04-01',
        title: '제목을 뭐로할까?',
        content: '## 오늘 한 일\n- UI 작업\n- API 연동',
        tags: ['frontend', 'docs'],
        is_dirty: false,
        draft_content: null,
        created_at: '2026-04-01T09:00:00Z',
        updated_at: '2026-04-01T18:00:00Z',
    },
];

// TODO: useRetroByDate 훅 분리
const retroTagMap = [
    { label: '기술', iconName: 'tech', className: '!border-danger !text-danger' },
    { label: '결정', iconName: 'decision', className: 'border-yellow-400 text-yellow-400' },
    { label: '소통', iconName: 'communication', className: '!border-info !text-info' },
    { label: '감정', iconName: 'emotion', className: 'border-success-darker text-success-darker' },
] as const;

const testRetroArr = [
    {
        id: 'b8c9d0e1-f2a3-4567-0123-678901234567',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        daily_log_id: 'f6a7b8c9-d0e1-2345-f014-456789012345',
        retro_date: '2026-03-31',
        template_type: 'Tech',
        content: {
            learned_today: '히트맵 셀 hover 이벤트 처리 방식',
            applied_technology: 'react-calendar-heatmap + 커스텀 tooltip 상태 관리',
            technical_difficulty: '스크롤 영역 안에서 tooltip이 찌그러지는 문제',
            next_to_try: '좌표 clamp와 선택 상태 동기화 개선',
        },
        is_dirty: false,
        draft_content: null,
        created_at: '2026-03-31T19:00:00Z',
        updated_at: '2026-03-31T19:30:00Z',
    },
    {
        id: 'c9d0e1f2-a345-4567-0123-678901234567',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        daily_log_id: 'f6a7b8c9-d0e1-2345-f014-456789012345',
        retro_date: '2026-03-31',
        template_type: 'Communication',
        content: {
            communication_highlights: '캘린더 담당자와 selectedDate 계약을 명확히 정리함',
            communication_friction: '히트맵 응답 구조와 summary 역할이 잠시 혼재됨',
            feedback_received: '평균값은 백엔드에서 계산하는 게 낫다는 합의',
            improvements: 'API 책임 범위를 먼저 확정하고 붙이기',
        },
        is_dirty: false,
        draft_content: null,
        created_at: '2026-03-31T20:00:00Z',
        updated_at: '2026-03-31T20:30:00Z',
    },
    {
        id: 'd0e1f2a3-b456-4567-0123-678901234567',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        daily_log_id: 'f6a7b8c9-d0e1-2345-f015-456789012345',
        retro_date: '2026-04-01',
        template_type: 'Decision',
        content: {
            decision_made: '상세 패널은 selectedDate 기준으로만 연동하기',
            decision_reason: '캘린더 구현 전에도 대시보드 기본 동작을 보장하기 위해',
            outcome_impact: '날짜 선택 흐름이 단순해지고 연결 포인트가 명확해짐',
            alternatives_considered: 'None',
        },
        is_dirty: false,
        draft_content: null,
        created_at: '2026-04-01T19:00:00Z',
        updated_at: '2026-04-01T19:30:00Z',
    },
] as const;

const retroTemplateLabelMap = {
    Tech: retroTagMap[0],
    Decision: retroTagMap[1],
    Communication: retroTagMap[2],
    Emotion: retroTagMap[3],
};

const getDailyLogPreview = (content: string) => {
    return content
        .replace(/^#+\s*/gm, '')
        .replace(/^- /gm, '')
        .replace(/\n+/g, ' ')
        .trim();
};

export default function Dashboard() {
    const summary = dashboardSummaryMock;
    const formattedDateRange =
        summary.dateRange.startDate && summary.dateRange.endDate
            ? `${formatDate(parseDate(summary.dateRange.startDate), DATE_FORMAT.display)} ~ ${formatDate(summary.dateRange.endDate, DATE_FORMAT.display)}`
            : '-';

    const [view, setView] = useState<'calendar' | 'history'>('calendar');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const selectedDailyLog = testDailyLogArr.find((log) => log.log_date === selectedDate);
    const selectedDailyLogPreview = selectedDailyLog ? getDailyLogPreview(selectedDailyLog.content) : null;
    const selectedRetros = testRetroArr.filter((retro) => retro.retro_date === selectedDate);
    const selectedRetroTags = selectedRetros.map((retro) => retroTemplateLabelMap[retro.template_type]);

    return (
        <main>
            <Container>
                <SectionHeader title='대시보드' />

                <div className={pageClassName}>
                    <section className={panelClassName}>
                        <div className={summarySectionClassName}>
                            <div className='flex flex-col gap-2'>
                                <h2 className={summaryTitleClassName}>누적 기록</h2>
                                <p className={summaryRangeClassName}>{formattedDateRange}</p>
                            </div>

                            <div className={metricsGridClassName}>
                                {summaryMetrics(summary.stats).map((metric) => (
                                    <div className={metricClassName} key={metric.label}>
                                        <strong
                                            className={`${metricValueClassName} ${metric.accent ? 'text-primary' : ''}`}
                                        >
                                            {metric.value}
                                        </strong>
                                        <span className={metricLabelClassName}>{metric.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <DoubleColumnLayout className='md:grid-cols-[minmax(0,1fr)_400px]'>
                        <section className={`${panelClassName}`}>
                            <SegmentedControl
                                options={[
                                    { label: '캘린더', value: 'calendar' },
                                    { label: '최근 1년 히스토리', value: 'history' },
                                ]}
                                value={view}
                                onValueChange={(value) => setView(value as 'calendar' | 'history')}
                            />
                            {view === 'calendar' ? (
                                <Calendar />
                            ) : (
                                <>
                                    <div className={'flex justify-center gap-2.5 my-5'}>
                                        <div className={historyMetricsClassName}>
                                            <strong className={historyMetricValueClassName}>289세션</strong>
                                            <span className={metricLabelClassName}>연간 포모도로</span>
                                        </div>
                                        <div className={historyMetricsClassName}>
                                            <strong className={historyMetricValueClassName}>144.5시간</strong>
                                            <span className={metricLabelClassName}>연간 집중 시간</span>
                                        </div>
                                        <div className={historyMetricsClassName}>
                                            <strong className={historyMetricValueClassName}>3.9세션</strong>
                                            <span className={metricLabelClassName}>일 평균 포모도로</span>
                                        </div>
                                    </div>
                                    <HeatMap onSelectDate={setSelectedDate} selectedDate={selectedDate} />
                                </>
                            )}
                        </section>
                        <section className={panelClassName}>
                            <div className={detailPanelClassName}>
                                <h2 className='font-semibold'>{formatDate(selectedDate, DATE_FORMAT.display)}</h2>

                                <article className={detailCardClassName}>
                                    <div className={detailCardHeaderClassName}>
                                        <h3 className='font-bold'>데일리로그</h3>
                                        <Icon name='arrow_right' size={16} />
                                    </div>
                                    <p className={detailLogTitleClassName}></p>
                                    {selectedDailyLogPreview ? (
                                        <p className={detailLogDescriptionClassName}>{selectedDailyLogPreview}</p>
                                    ) : (
                                        <p className={detailLogDescriptionClassName}>작성된 데일리로그가 없습니다.</p>
                                    )}
                                </article>

                                <article className={detailCardClassName}>
                                    <div className={detailCardHeaderClassName}>
                                        <h3 className='font-bold'>회고</h3>
                                        <Icon name='arrow_right' size={16} />
                                    </div>
                                    {selectedRetroTags.length > 0 ? (
                                        <div className={retroTagListClassName}>
                                            {selectedRetroTags.map((tag) => (
                                                <Tag
                                                    className={tag.className}
                                                    iconName={tag.iconName}
                                                    key={tag.label}
                                                    label={tag.label}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={detailLogDescriptionClassName}>작성된 회고가 없습니다.</p>
                                    )}
                                </article>

                                <section className={`${detailCardClassName} flex flex-1 flex-col`}>
                                    <h3 className='font-bold'>투두리스트</h3>
                                    <TodoPanel assignedDate={selectedDate} className='mt-4 flex-1' />
                                </section>
                            </div>
                        </section>
                    </DoubleColumnLayout>
                </div>
            </Container>
        </main>
    );
}
