import { useState } from 'react';

import { useGetDailyLog } from '@/api/generated/daily-logs/daily-logs';
import { useGetRetroLog } from '@/api/generated/retro-logs/retro-logs';
import {
    useGetStatsCalendar,
    useGetStatsHeatmap,
    useGetStatsHeatmapSummary,
    useGetStatsOverview,
} from '@/api/generated/stats/stats';
import type { DailyLog } from '@/api/generated/model/dailyLog';
import type { RetroLog, RetroLogTemplateType } from '@/api/generated/model';
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
const retroTagMap = [
    { label: '기술', iconName: 'tech', className: '!border-danger !text-danger' },
    { label: '결정', iconName: 'decision', className: 'border-yellow-400 text-yellow-400' },
    { label: '소통', iconName: 'communication', className: '!border-info !text-info' },
    { label: '감정', iconName: 'emotion', className: 'border-success-darker text-success-darker' },
] as const;
const retroTemplateLabelMap: Record<RetroLogTemplateType, (typeof retroTagMap)[number]> = {
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

const getFormattedHours = (totalFocusSeconds = 0) => {
    const hours = totalFocusSeconds / 3600;

    if (Number.isInteger(hours)) {
        return `${hours}시간`;
    }

    return `${hours.toFixed(1)}시간`;
};

const getFormattedAverageSessions = (dailyAverageSessions = 0) => {
    if (Number.isInteger(dailyAverageSessions)) {
        return `${dailyAverageSessions}세션`;
    }

    return `${dailyAverageSessions.toFixed(1)}세션`;
};

const isNotFoundError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return false;
    }

    return error.message.includes('404') || error.message.includes('없');
};

export default function Dashboard() {
    const [view, setView] = useState<'calendar' | 'history'>('calendar');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const selectedDateObject = parseDate(selectedDate);
    const { data: statsOverview } = useGetStatsOverview();
    const { data: heatmapSummary, isLoading: isHeatmapSummaryLoading } = useGetStatsHeatmapSummary();
    const { data: heatmapData = [], isLoading: isHeatmapLoading } = useGetStatsHeatmap();
    const { data: calendarTileContent = [], isLoading: isCalendarLoading } = useGetStatsCalendar({
        year: selectedDateObject.getFullYear(),
        month: selectedDateObject.getMonth() + 1,
    });
    const {
        data: selectedDailyLog,
        error: dailyLogError,
        isLoading: isDailyLogLoading,
    } = useGetDailyLog({ date: selectedDate }, { query: { retry: false } });
    const { data: selectedRetros = [], isLoading: isRetroLoading } = useGetRetroLog(
        { date: selectedDate },
        { query: { retry: false } }
    );

    const selectedDailyLogPreview = selectedDailyLog?.content ? getDailyLogPreview(selectedDailyLog.content) : null;
    const selectedRetroTags = selectedRetros
        .map((retro) => (retro.template_type ? retroTemplateLabelMap[retro.template_type] : null))
        .filter(Boolean);
    const dailyLogStatusMessage = dailyLogError
        ? isNotFoundError(dailyLogError)
            ? '작성된 데일리로그가 없습니다.'
            : '데일리로그를 불러오지 못했어요.'
        : '작성된 데일리로그가 없습니다.';
    const formattedDateRange = `가입일부터 ${formatDate(getTodayDate(), DATE_FORMAT.display)}까지`;
    const summaryMetrics = [
        { label: '연속스트릭', value: `${statsOverview?.streak ?? 0}일`, accent: true },
        { label: '포모도로', value: `${statsOverview?.total_sessions ?? 0}세션` },
        { label: '집중 시간', value: getFormattedHours(statsOverview?.total_focus_sec ?? 0) },
        { label: '데일리로그', value: `${statsOverview?.total_daily_logs ?? 0}건` },
        { label: '회고', value: `${statsOverview?.total_retro_logs ?? 0}건` },
    ];

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
                                {summaryMetrics.map((metric) => (
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
                                <Calendar
                                    isLoading={isCalendarLoading}
                                    selectedDate={selectedDate}
                                    onSelectDate={setSelectedDate}
                                    tileContent={calendarTileContent}
                                />
                            ) : (
                                <>
                                    <div className={'flex justify-center gap-2.5 my-5'}>
                                        <div className={historyMetricsClassName}>
                                            <strong className={historyMetricValueClassName}>
                                                {isHeatmapSummaryLoading
                                                    ? '-'
                                                    : `${heatmapSummary?.total_sessions ?? 0}세션`}
                                            </strong>
                                            <span className={metricLabelClassName}>연간 포모도로</span>
                                        </div>
                                        <div className={historyMetricsClassName}>
                                            <strong className={historyMetricValueClassName}>
                                                {isHeatmapSummaryLoading
                                                    ? '-'
                                                    : getFormattedHours(heatmapSummary?.total_focus_sec ?? 0)}
                                            </strong>
                                            <span className={metricLabelClassName}>연간 집중 시간</span>
                                        </div>
                                        <div className={historyMetricsClassName}>
                                            <strong className={historyMetricValueClassName}>
                                                {isHeatmapSummaryLoading
                                                    ? '-'
                                                    : getFormattedAverageSessions(
                                                          heatmapSummary?.daily_avg_sessions ?? 0
                                                      )}
                                            </strong>
                                            <span className={metricLabelClassName}>일 평균 포모도로</span>
                                        </div>
                                    </div>
                                    <HeatMap
                                        isLoading={isHeatmapLoading}
                                        onSelectDate={setSelectedDate}
                                        selectedDate={selectedDate}
                                        values={heatmapData}
                                    />
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
                                    {isDailyLogLoading ? (
                                        <DetailSkeleton lines={3} />
                                    ) : selectedDailyLogPreview ? (
                                        <>
                                            <p className={detailLogTitleClassName}>{selectedDailyLog?.title ?? ''}</p>
                                            <p className={detailLogDescriptionClassName}>{selectedDailyLogPreview}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className={detailLogTitleClassName}>{selectedDailyLog?.title ?? ''}</p>
                                            <p className={detailLogDescriptionClassName}>{dailyLogStatusMessage}</p>
                                        </>
                                    )}
                                </article>

                                <article className={detailCardClassName}>
                                    <div className={detailCardHeaderClassName}>
                                        <h3 className='font-bold'>회고</h3>
                                        <Icon name='arrow_right' size={16} />
                                    </div>
                                    {isRetroLoading ? (
                                        <TagSkeleton />
                                    ) : selectedRetroTags.length > 0 ? (
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

const DetailSkeleton = ({ lines = 2 }: { lines?: number }) => {
    return (
        <div className='flex flex-col gap-2 animate-pulse'>
            <div className='h-4 w-1/3 rounded-full bg-neutral-subtle' />
            {Array.from({ length: lines }, (_, index) => (
                <div
                    className={`h-3 rounded-full bg-neutral-subtle ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
                    key={`detail-skeleton-${index}`}
                />
            ))}
        </div>
    );
};

const TagSkeleton = () => {
    return (
        <div className='flex flex-wrap gap-2 animate-pulse'>
            {Array.from({ length: 3 }, (_, index) => (
                <div className='h-7 w-16 rounded-full bg-neutral-subtle' key={`tag-skeleton-${index}`} />
            ))}
        </div>
    );
};
