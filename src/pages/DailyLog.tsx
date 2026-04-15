import { Input, SearchInput } from '@/components/form';
import MdEditor, { type MdEditorHandle } from '@/features/log/components/MdEditor';
import { useDailyLogSaveStatusStore } from '@/features/log/stores/dailyLogSaveStatus';
import { Container, SectionHeader, SidebarContentLayout } from '@/components/layout';
import { Badge, Button, DailyLogCard, Icon } from '@/components/ui';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { Calendar } from '@@/ui';
import { useModal, useToast } from '@/hooks';
import {
    createDailyLog as createDailyLogRequest,
    getAllDailyLogs,
    getGetAllDailyLogsQueryKey,
    getDailyLog,
    getGetDailyLogQueryKey,
    updateDailyLog as updateDailyLogRequest,
    useDeleteDailyLog,
    useSearchDailyLogs,
} from '@/api/generated/daily-logs/daily-logs';
import { queryClient } from '@/api/queryClient';
import { DATE_FORMAT, formatDate } from '@/utils';
import type { DailyLog, DailyLogSummary, PaginatedDailyLogsResponse } from '@/api/generated/model';
import { isSameDate } from '@/utils/dateUtils';
import { useBeforeUnload } from 'react-router-dom';

const DAILY_LOG_PAGE_SIZE = 10;
const LOG_AUTO_SAVE_DURATION = 5000;

type DailyLogInfiniteData = InfiniteData<PaginatedDailyLogsResponse, number>;

type SaveDailyLogOptions = {
    background?: boolean;
};

export default function DailyLog() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayDateKey = formatDate(todayStart, DATE_FORMAT.api);

    const [search, setSearch] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isContentDirty, setIsContentDirty] = useState(false);
    const [autoSaveText, setAutoSaveText] = useState('');
    const [autoSaveState, setAutoSaveState] = useState<'' | 'writing' | 'saving' | 'saved' | 'error'>('');
    const [isSaveProgresing, setIsSaveProgresing] = useState(false);
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedLog, setSelectedLog] = useState<DailyLogSummary>();
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
    const trimmedSearchKeyword = searchKeyword.trim();
    const isSearchMode = trimmedSearchKeyword.length > 0;
    const isBackgroundDailyLogSaving = useDailyLogSaveStatusStore((state) => state.isBackgroundSaving);

    const dailyLogsQueryKey = getGetAllDailyLogsQueryKey({ limit: DAILY_LOG_PAGE_SIZE });
    const {
        data: dailyLogsResponse,
        isLoading,
        isFetching: isDailyLogsFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: dailyLogsQueryKey,
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            getAllDailyLogs({
                page: pageParam,
                limit: DAILY_LOG_PAGE_SIZE,
            }),
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.meta?.current_page ?? 1;
            const totalPages = lastPage.meta?.total_pages ?? 1;

            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
    const { mutateAsync: deleteDailyLog } = useDeleteDailyLog();
    const { data: searchLogs = [], isLoading: isSearchLoading } = useSearchDailyLogs(
        { q: trimmedSearchKeyword },
        {
            query: {
                enabled: isSearchMode,
            },
        }
    );

    const { showModal } = useModal();
    const { showToast } = useToast();

    const contentChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
    const listScrollRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const mdEditorRef = useRef<MdEditorHandle | null>(null);
    const contentRef = useRef(content);
    const lastSavedContentRef = useRef(content);
    const titleRef = useRef(title);
    const selectedDateRef = useRef(selectedDate);
    const selectedLogRef = useRef<DailyLogSummary | undefined>(selectedLog);
    const isSaveProgresingRef = useRef(isSaveProgresing);
    const savePromiseRef = useRef<Promise<boolean> | null>(null);
    const isMountedRef = useRef(false);
    const initialTodayLogSelectedRef = useRef(false);
    const initialTodayLogDetailFetchRef = useRef(false);
    const deleteTimerMapRef = useRef<Record<string, number>>({});

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!isOpenCalendar) {
            return;
        }

        const handlePointerDownOutside = (event: MouseEvent) => {
            if (!calendarWrapperRef.current?.contains(event.target as Node)) {
                setIsOpenCalendar(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDownOutside);

        return () => {
            document.removeEventListener('mousedown', handlePointerDownOutside);
        };
    }, [isOpenCalendar]);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    useEffect(() => {
        selectedDateRef.current = selectedDate;
    }, [selectedDate]);

    useEffect(() => {
        selectedLogRef.current = selectedLog;
    }, [selectedLog]);

    useEffect(() => {
        isSaveProgresingRef.current = isSaveProgresing;
    }, [isSaveProgresing]);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target || !hasNextPage || isSearchMode) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            {
                root: listScrollRef.current,
                rootMargin: '120px',
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearchMode]);

    const DAILY_LOG_DELETE_UNDO_DURATION = 3000;

    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

    const dailyLogs = dailyLogsResponse?.pages.flatMap((page) => page.data ?? []) ?? [];
    const visibleLogs = dailyLogs.filter((log) => !log.id || !pendingDeleteIds.includes(log.id));
    const visibleSearchLogs = searchLogs
        .filter((log) => !log.id || !pendingDeleteIds.includes(log.id))
        .map(
            (log): DailyLogSummary => ({
                id: log.id,
                log_date: log.log_date,
                title: log.title,
                tags: log.tags,
                has_retro_log: log.has_retro_log,
            })
        );
    const displayLogs = isSearchMode ? visibleSearchLogs : visibleLogs;
    const displayLoading = isSearchMode ? isSearchLoading : isLoading;
    const totalCount = dailyLogsResponse?.pages[0]?.meta?.total_count ?? 0;
    const displayTotalCount = isSearchMode ? displayLogs.length : totalCount;
    const emptyLogMessage = isSearchMode ? '검색 결과가 없습니다.' : '아직 작성된 로그가 없습니다.';
    const displayedAutoSaveState = isBackgroundDailyLogSaving ? 'saving' : autoSaveState;
    const displayedAutoSaveText = isBackgroundDailyLogSaving ? '저장중...' : autoSaveText;

    const toDailyLogSummary = (log: DailyLog): DailyLogSummary => ({
        id: log.id,
        log_date: log.log_date,
        updated_at: log.updated_at,
        title: log.title,
        content: log.content,
        tags: log.tags,
    });

    const mergeDailyLogSummary = (log: DailyLog, baseLog?: DailyLogSummary): DailyLogSummary => ({
        ...baseLog,
        ...toDailyLogSummary(log),
    });

    const upsertDailyLogDetailCache = (log: DailyLog) => {
        if (!log.log_date) return;

        queryClient.setQueryData<DailyLog>(getGetDailyLogQueryKey({ date: log.log_date }), log);
    };

    const upsertDailyLogListCache = (log: DailyLog) => {
        if (!log.log_date) return;

        queryClient.setQueryData<DailyLogInfiniteData>(dailyLogsQueryKey, (current) => {
            const nextLog = mergeDailyLogSummary(log);

            if (!current) {
                return {
                    pageParams: [1],
                    pages: [
                        {
                            data: [nextLog],
                            meta: {
                                current_page: 1,
                                limit: DAILY_LOG_PAGE_SIZE,
                                total_count: 1,
                                total_pages: 1,
                            },
                        },
                    ],
                };
            }

            let didUpdate = false;
            const pages = current.pages.map((page) => {
                const logs = page.data ?? [];
                let didUpdatePage = false;

                const nextLogs = logs.map((item) => {
                    const isSameLog = (log.id && item.id === log.id) || item.log_date === log.log_date;

                    if (!isSameLog) return item;

                    didUpdate = true;
                    didUpdatePage = true;
                    return mergeDailyLogSummary(log, item);
                });

                return didUpdatePage ? { ...page, data: nextLogs } : page;
            });

            if (didUpdate) {
                return { ...current, pages };
            }

            const [firstPage, ...restPages] = pages;
            const pageSize = firstPage?.meta?.limit ?? DAILY_LOG_PAGE_SIZE;
            const firstLogs = firstPage?.data ?? [];
            const totalCount = (firstPage?.meta?.total_count ?? firstLogs.length) + 1;
            const totalPages = Math.max(firstPage?.meta?.total_pages ?? 1, Math.ceil(totalCount / pageSize));
            const nextFirstLogs = [nextLog, ...firstLogs].sort((left, right) =>
                (right.log_date ?? '').localeCompare(left.log_date ?? '')
            );

            return {
                ...current,
                pageParams: current.pageParams.length ? current.pageParams : [1],
                pages: [
                    {
                        ...(firstPage ?? {}),
                        data: nextFirstLogs,
                        meta: {
                            ...firstPage?.meta,
                            current_page: firstPage?.meta?.current_page ?? 1,
                            limit: pageSize,
                            total_count: totalCount,
                            total_pages: totalPages,
                        },
                    },
                    ...restPages,
                ],
            };
        });
    };

    const syncSavedDailyLogCaches = (log: DailyLog) => {
        upsertDailyLogDetailCache(log);
        upsertDailyLogListCache(log);
    };

    const resetContentState = (nextContent: string) => {
        contentRef.current = nextContent;
        lastSavedContentRef.current = nextContent;
        setContent(nextContent);
        setIsContentDirty(false);
    };

    const restoreLastSavedState = () => {
        const lastSavedText = selectedLogRef.current?.updated_at
            ? formatLastSaved(selectedLogRef.current.updated_at)
            : '';

        setAutoSaveState(lastSavedText ? 'saved' : '');
        setAutoSaveText(lastSavedText);
    };

    const markContentSaved = (savedContent: string) => {
        lastSavedContentRef.current = savedContent;
        setIsContentDirty(contentRef.current !== savedContent);
    };

    const handleContentChange = (value: string | undefined) => {
        const nextContent = value ?? '';

        contentRef.current = nextContent;
        setContent(nextContent);
        setIsContentDirty(nextContent !== lastSavedContentRef.current);

        if (nextContent === lastSavedContentRef.current) {
            if (contentChangeTimerRef.current) {
                clearTimeout(contentChangeTimerRef.current);
            }

            restoreLastSavedState();
            return;
        }

        if (isSaveProgresing) return;

        setAutoSaveState('writing');
        setAutoSaveText('작성중...');

        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
        }

        contentChangeTimerRef.current = setTimeout(() => {
            void saveDailyLogContent();
        }, LOG_AUTO_SAVE_DURATION);
    };

    const saveDailyLogContent = async (options: SaveDailyLogOptions = {}) => {
        const isBackgroundSave = options.background ?? false;
        const canUpdateUi = () => !isBackgroundSave && isMountedRef.current;

        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
            contentChangeTimerRef.current = null;
        }

        const contentToSave = contentRef.current;

        if (contentToSave === lastSavedContentRef.current) {
            if (canUpdateUi()) {
                setIsContentDirty(false);
                restoreLastSavedState();
            }

            return true;
        }

        if (canUpdateUi()) {
            setAutoSaveState('saving');
            setAutoSaveText('저장중...');
        }

        isSaveProgresingRef.current = true;
        if (canUpdateUi()) {
            setIsSaveProgresing(true);
        }

        const dateToSave = formatDate(selectedDateRef.current, DATE_FORMAT.api);
        const nextTitle =
            titleRef.current == ''
                ? `${formatDate(selectedDateRef.current, DATE_FORMAT.display)} 로그`
                : titleRef.current;

        const savePromise = (async () => {
            try {
                const savedLog = selectedLogRef.current?.id
                    ? await updateDailyLogRequest(selectedLogRef.current.id, {
                          title: nextTitle,
                          content: contentToSave,
                          is_dirty: false,
                      })
                    : await createDailyLogRequest({
                          log_date: dateToSave,
                          title: nextTitle,
                          content: contentToSave,
                      });
                const savedSummary = toDailyLogSummary(savedLog);

                syncSavedDailyLogCaches(savedLog);
                selectedLogRef.current = savedSummary;
                lastSavedContentRef.current = contentToSave;
                titleRef.current = savedLog.title ?? nextTitle;

                if (canUpdateUi()) {
                    setSelectedLog(savedSummary);
                    setTitle(titleRef.current);
                    markContentSaved(contentToSave);
                }

                void Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: dailyLogsQueryKey,
                    }),
                    savedLog.log_date
                        ? queryClient.invalidateQueries({
                              queryKey: getGetDailyLogQueryKey({ date: savedLog.log_date }),
                          })
                        : Promise.resolve(),
                ]).catch(() => undefined);

                if (canUpdateUi()) {
                    setAutoSaveState('saved');
                    setAutoSaveText('마지막 저장 방금 전');
                }

                return true;
            } catch {
                if (canUpdateUi()) {
                    setAutoSaveState('error');
                    setAutoSaveText('저장에 실패했어요');
                }

                showToast({
                    iconName: 'error',
                    message: '데일리로그 저장에 실패했어요.',
                    duration: 3000,
                });

                return false;
            } finally {
                isSaveProgresingRef.current = false;
                if (canUpdateUi()) {
                    setIsSaveProgresing(false);
                }
            }
        })();

        savePromiseRef.current = savePromise;
        void savePromise.finally(() => {
            if (savePromiseRef.current === savePromise) {
                savePromiseRef.current = null;
            }
        });

        return savePromise;
    };

    const flushPendingDailyLogSave = async (options: SaveDailyLogOptions = {}) => {
        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
            contentChangeTimerRef.current = null;
        }

        if (savePromiseRef.current) {
            const saved = await savePromiseRef.current;

            if (!saved) {
                return false;
            }
        }

        if (contentRef.current === lastSavedContentRef.current) {
            return true;
        }

        return saveDailyLogContent(options);
    };

    const saveContent = async () => {
        await flushPendingDailyLogSave();
    };

    useBeforeUnload((event) => {
        if (
            contentRef.current === lastSavedContentRef.current &&
            !isSaveProgresingRef.current &&
            !useDailyLogSaveStatusStore.getState().isBackgroundSaving
        ) {
            return;
        }

        event.preventDefault();
        event.returnValue = '';
    });

    useEffect(() => {
        return () => {
            if (contentRef.current === lastSavedContentRef.current && !savePromiseRef.current) {
                return;
            }

            const { beginBackgroundSave, endBackgroundSave } = useDailyLogSaveStatusStore.getState();

            beginBackgroundSave();
            void flushPendingDailyLogSave({ background: true }).finally(endBackgroundSave);
        };
    }, []);

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

    const formatKoreanTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const period = hours < 12 ? '오전' : '오후';
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;

        return `${period} ${displayHour}:${minutes}`;
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

    const handleChangeSearchInput = (val: string) => {
        setSearch(val);

        if (!val.trim()) {
            setSearchKeyword('');
        }
    };

    const handleClearSearchInput = () => {
        setSearch('');
        setSearchKeyword('');
    };

    const handleLogClick = (log: DailyLogSummary): void => {
        selectedLogRef.current = log;
        setSelectedLog(log);
        titleRef.current = log.title ?? '';
        resetContentState(log.content ?? '');
        setTitle(log.title ?? '');
        const nextDate = new Date(`${log.log_date}T00:00:00`);
        selectedDateRef.current = nextDate;
        setSelectedDate(nextDate);
        const lastSaved = formatLastSaved(log.updated_at ?? '');
        setAutoSaveText(lastSaved);
    };

    const handleDeleteConfirm = (log: DailyLogSummary): void => {
        showModal({
            title: `${log.log_date} 로그 삭제`,
            description: `지금 삭제하시면 복구할 수 없어요.\n그래도 삭제하시겠어요?`,
            tone: 'danger',
            confirmLabel: '삭제하기',
            onConfirm: () => handleDeleteWithUndo(log),
        });
    };

    const clearPendingDelete = (id: string) => {
        const timerId = deleteTimerMapRef.current[id];

        if (timerId) {
            window.clearTimeout(timerId);
            delete deleteTimerMapRef.current[id];
        }

        setPendingDeleteIds((prev) => prev.filter((logId) => logId !== id));
    };

    const handleDeleteWithUndo = (log: DailyLogSummary) => {
        if (!log.id) return;
        if (deleteTimerMapRef.current[log.id]) return;

        const id = log.id;

        if (contentChangeTimerRef.current) {
            window.clearTimeout(contentChangeTimerRef.current);
            contentChangeTimerRef.current = null;
        }

        setPendingDeleteIds((prev) => [...prev, id]);

        selectedLogRef.current = undefined;
        setSelectedLog(undefined);
        titleRef.current = '';
        setTitle('');
        resetContentState('');
        setAutoSaveText('');

        deleteTimerMapRef.current[id] = window.setTimeout(async () => {
            try {
                await deleteDailyLog({ id });

                await queryClient.invalidateQueries({
                    queryKey: dailyLogsQueryKey,
                });
            } catch {
                showToast({
                    message: '로그 삭제에 실패했어요',
                    iconName: 'error',
                    duration: 3000,
                });
            } finally {
                clearPendingDelete(id);
            }
        }, DAILY_LOG_DELETE_UNDO_DURATION);

        showToast({
            message: '로그를 삭제했어요',
            iconName: 'delete',
            textButton: true,
            textButtonLabel: '취소',
            onTextButtonClick: () => clearPendingDelete(id),
            duration: DAILY_LOG_DELETE_UNDO_DURATION,
        });
    };

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

        let log = visibleLogs.find((log) => isSameDate(new Date(log.log_date ? log.log_date : ''), date));
        console.log(log);

        if (log) {
            selectedLogRef.current = log;
            setSelectedLog(log);
            titleRef.current = log.title ?? '';
            setTitle(log.title ?? '');
            resetContentState(log.content ?? '');

            const lastSaved = formatLastSaved(log.updated_at ?? '');
            setAutoSaveText(lastSaved);
        } else {
            selectedLogRef.current = undefined;
            setSelectedLog(undefined);
            titleRef.current = '';
            setTitle('');
            resetContentState('');

            setAutoSaveText('');
        }

        selectedDateRef.current = date;
        setSelectedDate(date);
        setIsOpenCalendar(false);
    };

    useEffect(() => {
        if (
            initialTodayLogSelectedRef.current ||
            isLoading ||
            isSearchMode ||
            selectedLog ||
            isContentDirty ||
            formatDate(selectedDate, DATE_FORMAT.api) !== todayDateKey
        ) {
            return;
        }

        const selectTodayLog = (log: DailyLogSummary) => {
            initialTodayLogSelectedRef.current = true;
            selectedLogRef.current = log;
            titleRef.current = log.title ?? '';
            setSelectedLog(log);
            setTitle(log.title ?? '');
            resetContentState(log.content ?? '');
            setAutoSaveText(formatLastSaved(log.updated_at ?? ''));
        };

        const todayLog = visibleLogs.find((log) => log.log_date === todayDateKey);

        if (todayLog) {
            selectTodayLog(todayLog);
            return;
        }

        if (isLoading || isDailyLogsFetching || initialTodayLogDetailFetchRef.current) {
            return;
        }

        initialTodayLogDetailFetchRef.current = true;
        let isCurrent = true;

        const fetchTodayLog = async () => {
            try {
                const fetchedTodayLog = await getDailyLog({ date: todayDateKey });

                if (!isCurrent) {
                    return;
                }

                selectTodayLog(toDailyLogSummary(fetchedTodayLog));
            } catch {
                if (isCurrent) {
                    initialTodayLogDetailFetchRef.current = false;
                }
            }
        };

        void fetchTodayLog();

        return () => {
            isCurrent = false;
            if (!initialTodayLogSelectedRef.current) {
                initialTodayLogDetailFetchRef.current = false;
            }
        };
    }, [
        isContentDirty,
        isDailyLogsFetching,
        isLoading,
        isSearchMode,
        selectedDate,
        selectedLog,
        todayDateKey,
        visibleLogs,
    ]);

    useEffect(() => {
        if (
            !selectedLog ||
            isLoading ||
            isDailyLogsFetching ||
            isSearchMode ||
            contentRef.current !== lastSavedContentRef.current
        ) {
            return;
        }

        const selectedDateKey = formatDate(selectedDate, DATE_FORMAT.api);
        const latestLog = visibleLogs.find((log) => log.log_date === selectedDateKey);

        if (!latestLog || (latestLog.content ?? '') === contentRef.current) {
            return;
        }

        selectedLogRef.current = latestLog;
        titleRef.current = latestLog.title ?? '';
        setSelectedLog(latestLog);
        setTitle(latestLog.title ?? '');
        resetContentState(latestLog.content ?? '');
        setAutoSaveText(formatLastSaved(latestLog.updated_at ?? ''));
    }, [isDailyLogsFetching, isLoading, isSearchMode, selectedDate, selectedLog, visibleLogs]);

    const moveSelectedDate = (days: number) => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + days);

        handleCalendarDateSelect(nextDate);
    };

    const searchLogList = () => {
        setSearchKeyword(search.trim());
    };

    const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Tab' || event.shiftKey) {
            return;
        }

        event.preventDefault();
        mdEditorRef.current?.focusContent();
    };

    const LogSkeletonRow = () => {
        return (
            <div className='flex flex-col w-full gap-3 rounded-xl border border-neutral-subtle bg-white p-4 animate-pulse'>
                <div className='w-[80%] h-4 rounded-full bg-gray-100' />
                <div className='w-[30%] h-3 rounded-full bg-gray-100' />
            </div>
        );
    };

    const EmptyLogList = () => {
        return (
            <div className='flex w-full shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-white py-5 text-center'>
                <p className='text-md text-neutral'>{emptyLogMessage}</p>
            </div>
        );
    };

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
                            <div className='flex w-full gap-2'>
                                <SearchInput
                                    className='flex-1 min-w-0'
                                    placeholder='제목 또는 내용으로 검색하세요'
                                    value={search}
                                    onChange={(e) => handleChangeSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;

                                        e.preventDefault();
                                        searchLogList();
                                    }}
                                    rightElement={
                                        search ? (
                                            <button
                                                aria-label='검색어 지우기'
                                                className='flex size-5 shrink-0 items-center justify-center rounded-full text-neutral-darker transition-colors hover:bg-gray-100 hover:text-black'
                                                type='button'
                                                onClick={handleClearSearchInput}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <Icon name='close' size={14} />
                                            </button>
                                        ) : null
                                    }
                                />
                                {search && (
                                    <Button className='!px-2' variant='outline' onClick={searchLogList}>
                                        <Icon name='search' size={20} />
                                    </Button>
                                )}
                            </div>
                            <div className='mt-4 mb-2 flex w-full justify-between'>
                                <p className='text-neutral-darker'>전체</p>
                                <Badge label={`총 ${displayTotalCount}건`} />
                            </div>

                            <div
                                ref={listScrollRef}
                                className='flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto mask-b-from-97% pb-10'
                            >
                                {displayLoading && displayLogs.length === 0
                                    ? Array.from({ length: 3 }, (_, index) => (
                                          <LogSkeletonRow key={`log-skeleton-${index}`} />
                                      ))
                                    : null}

                                {!displayLoading && displayLogs.length === 0 ? <EmptyLogList /> : null}

                                {displayLogs.map((log) => (
                                    <DailyLogCard
                                        key={log.id}
                                        dateLabel={log.log_date ? relativeDate(log.log_date) : ''}
                                        title={log.title ?? ''}
                                        state={
                                            log.log_date && isSameDate(log.log_date, selectedDate)
                                                ? 'selected'
                                                : 'default'
                                        }
                                        onClick={() => handleLogClick(log)}
                                        onDeleteClick={() => handleDeleteConfirm(log)}
                                    />
                                ))}

                                {!isSearchMode && isFetchingNextPage
                                    ? Array.from({ length: 2 }, (_, index) => (
                                          <LogSkeletonRow key={`next-log-skeleton-${index}`} />
                                      ))
                                    : null}
                                <div ref={loadMoreRef} className='h-1 shrink-0' />
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
                                <div className='flex items-center text-neutral text-sm whitespace-nowrap'>
                                    {displayedAutoSaveState === 'saving' ? (
                                        <div className='animate-spin h-4 w-4 border-3 border-gray-300 border-t-primary rounded-full mr-1' />
                                    ) : (
                                        ''
                                    )}
                                    {displayedAutoSaveText}
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

                            <Input
                                className='mt-5 mb-3'
                                placeholder='제목을 입력해 주세요'
                                value={title}
                                onChange={(e) => {
                                    titleRef.current = e.target.value;
                                    setTitle(e.target.value);
                                }}
                                onKeyDown={handleTitleKeyDown}
                            />
                            <MdEditor
                                ref={mdEditorRef}
                                content={content}
                                contentChange={handleContentChange}
                            ></MdEditor>
                            <Button
                                className='mt-3 px-10'
                                variant='filled'
                                size='lg'
                                disabled={!content || !isContentDirty}
                                onClick={saveContent}
                            >
                                저장
                            </Button>
                        </section>
                    </section>
                </SidebarContentLayout>
            </div>
        </Container>
    );
}
