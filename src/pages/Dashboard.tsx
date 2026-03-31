import { useState } from 'react';

import { DATE_FORMAT, formatDate, getTodayDate, parseDate } from '@/utils';
import { Container, SectionHeader, DoubleColumnLayout } from '@@/layout';
import { SegmentedControl } from '@@/form';
import { Calendar, HeatMap } from '@@@/stats';

const pageClassName = 'flex w-full flex-col gap-2.5';
const panelClassName = 'w-full rounded-2xl bg-white p-5 shadow-1';
const sidePanelClassName = 'min-h-[620px]';
const summarySectionClassName = 'grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center';
const summaryTitleClassName = 'text-2xl font-bold';
const summaryRangeClassName = 'text-sm text-neutral';
const metricsGridClassName = 'flex gap-2.5 justify-end';
const metricClassName = 'flex flex-col items-center gap-1.5 text-center p-2.5';
const metricValueClassName = 'text-3xl font-bold';
const metricLabelClassName = 'text-sm';
const historyMetricsClassName =
    'flex flex-col w-full items-center gap-1.5 text-center px-2.5 py-5 bg-neutral-subtle rounded-lg';

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

export default function Dashboard() {
    const summary = dashboardSummaryMock;
    const formattedDateRange =
        summary.dateRange.startDate && summary.dateRange.endDate
            ? `${formatDate(parseDate(summary.dateRange.startDate), DATE_FORMAT.display)} ~ ${formatDate(summary.dateRange.endDate, DATE_FORMAT.display)}`
            : '-';

    const [view, setView] = useState<'calendar' | 'history'>('calendar');

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
                                            <strong className={metricValueClassName}>289세션</strong>
                                            <span className={metricLabelClassName}>연간 포모도로</span>
                                        </div>
                                        <div className={historyMetricsClassName}>
                                            <strong className={metricValueClassName}>144.5시간</strong>
                                            <span className={metricLabelClassName}>연간 집중 시간</span>
                                        </div>
                                        <div className={historyMetricsClassName}>
                                            <strong className={metricValueClassName}>3.9세션</strong>
                                            <span className={metricLabelClassName}>일 평균 포모도로</span>
                                        </div>
                                    </div>
                                    <HeatMap />
                                </>
                            )}
                        </section>
                        <section className={`${panelClassName} ${sidePanelClassName}`}>
                            <h2 className='text-xl font-bold'>{formatDate(getTodayDate(), DATE_FORMAT.display)}</h2>
                        </section>
                    </DoubleColumnLayout>
                </div>
            </Container>
        </main>
    );
}
