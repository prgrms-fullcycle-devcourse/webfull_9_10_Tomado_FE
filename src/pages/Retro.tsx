import type {
    CreateRetroLogRequestTemplateType,
    RetroLog,
    RetroLogListItem,
    RetroLogSearchItem,
} from '@/api/generated/model';
import {
    createRetroLog as createRetroLogRequest,
    getRetroLog,
    getGetRetroLogQueryKey,
    getListRetroLogsQueryKey,
    updateRetroLog as updateRetroLogRequest,
    useDeleteRetroLog,
    useSearchRetroLogs,
} from '@/api/generated/retro-logs/retro-logs';
import { customInstance } from '@/api/mutator/custom-instance';
import { queryClient } from '@/api/queryClient';
import RetroItem from '@/features/log/components/RetroItem';
import { RETRO_CATEGORY_NAME, RETRO_FORM } from '@/features/log/retroConstants';
import { useRetroSaveStatusStore } from '@/features/log/stores/retroSaveStatus';
import { useToast } from '@/hooks';
import { DATE_FORMAT, formatDate, getTodayDate, isValidApiDate, parseDate } from '@/utils';
import { isSameDate } from '@/utils/dateUtils';
import { SearchInput, SegmentedControl } from '@@/form';
import { Container, SectionHeader, SidebarContentLayout } from '@@/layout';
import { Badge, Button, Calendar, Icon, RetroCard } from '@@/ui';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeUnload, useNavigate, useSearchParams } from 'react-router-dom';

const RETRO_LOG_PAGE_SIZE = 10;

type RetroContent = Record<string, string>;
type RetroContentMap = Record<string, RetroContent>;

type RetroLogListResponse = {
    items?: RetroLogListItem[];
    page?: number;
    page_size?: number;
    total_count?: number;
    total_pages?: number;
    has_next?: boolean;
};

type RetroLogInfiniteData = InfiniteData<RetroLogListResponse, number>;

type RetroLogListParams = {
    page: number;
    page_size: number;
};

type SaveCategoryContentOptions = {
    background?: boolean;
};

const getRetroLogListPage = (params: RetroLogListParams, options?: RequestInit) => {
    return customInstance<RetroLogListResponse>('/api/v1/retro-logs/list', {
        ...options,
        method: 'GET',
        params: {
            page: params.page,
            page_size: params.page_size,
        },
    });
};

const createEmptyRetroContent = (): RetroContentMap => ({
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

const cloneRetroContentMap = (contentMap: RetroContentMap): RetroContentMap => {
    return Object.fromEntries(Object.entries(contentMap).map(([category, fields]) => [category, { ...fields }]));
};

const isSameRetroContent = (left: RetroContent = {}, right: RetroContent = {}) => {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);

    return Array.from(keys).every((key) => (left[key] ?? '') === (right[key] ?? ''));
};

const isSameRetroContentMap = (left: RetroContentMap = {}, right: RetroContentMap = {}) => {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);

    return Array.from(keys).every((key) => isSameRetroContent(left[key], right[key]));
};

const getInitialSelectedDate = (searchParams: URLSearchParams) => {
    const routeDate = searchParams.get('date');

    return parseDate(isValidApiDate(routeDate) ? routeDate : getTodayDate());
};

export default function Retro() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const routeDate = searchParams.get('date');
    const routeDateKey = isValidApiDate(routeDate) ? routeDate : null;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayDateKey = formatDate(todayStart, DATE_FORMAT.api);
    type RetroTemplateType = NonNullable<RetroLogListItem['template_types']>[number];

    const [search, setSearch] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(() => getInitialSelectedDate(searchParams));
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [content, setContent] = useState<RetroContentMap>(() => createEmptyRetroContent());
    const [selectedCategory, setSelectedCategory] = useState(RETRO_CATEGORY_NAME.TECH);
    const [selectedRetro, setSelectedRetro] = useState<RetroLogListItem>();
    const [isSelectedCategoryDirty, setIsSelectedCategoryDirty] = useState(false);
    const [autoSaveText, setAutoSaveText] = useState('');
    const [autoSaveState, setAutoSaveState] = useState<'' | 'writing' | 'saving' | 'saved' | 'error'>('');
    const [isSaveProgresing, setIsSaveProgresing] = useState(false);
    const [deleteTargetRetro, setDeleteTargetRetro] = useState<RetroLogListItem>();
    const [deleteTargetTemplateTypes, setDeleteTargetTemplateTypes] = useState<string[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pendingDeleteRetroIds, setPendingDeleteRetroIds] = useState<string[]>([]);
    const trimmedSearchKeyword = searchKeyword.trim();
    const isSearchMode = trimmedSearchKeyword.length > 0;
    const isBackgroundRetroSaving = useRetroSaveStatusStore((state) => state.isBackgroundSaving);

    const retroLogsQueryKey = [...getListRetroLogsQueryKey(), { page_size: RETRO_LOG_PAGE_SIZE }] as const;
    const {
        data: retroLogsResponse,
        isLoading: isRetroLogsLoading,
        isFetching: isRetroLogsFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: retroLogsQueryKey,
        initialPageParam: 1,
        queryFn: ({ pageParam, signal }) =>
            getRetroLogListPage(
                {
                    page: pageParam,
                    page_size: RETRO_LOG_PAGE_SIZE,
                },
                { signal }
            ),
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.page ?? 1;
            const totalPages = lastPage.total_pages ?? currentPage;
            const hasNext = lastPage.has_next ?? currentPage < totalPages;

            return hasNext ? currentPage + 1 : undefined;
        },
    });
    const { data: retroSearchResults = [], isLoading: isRetroSearchLoading } = useSearchRetroLogs(
        { q: trimmedSearchKeyword },
        {
            query: {
                enabled: isSearchMode,
            },
        }
    );
    const { mutateAsync: deleteRetroLog } = useDeleteRetroLog();

    const { showToast } = useToast();

    const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
    const listScrollRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const contentChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const contentRef = useRef(content);
    const lastSavedContentRef = useRef<RetroContentMap>({});
    const isSelectedCategoryDirtyRef = useRef(isSelectedCategoryDirty);
    const selectedCategoryRef = useRef(selectedCategory);
    const selectedDateRef = useRef(selectedDate);
    const selectedRetroRef = useRef<RetroLogListItem | undefined>(selectedRetro);
    const isSaveProgresingRef = useRef(isSaveProgresing);
    const savePromiseRef = useRef<Promise<boolean> | null>(null);
    const isMountedRef = useRef(false);
    const initialTodayRetroSelectedRef = useRef(false);
    const initialTodayRetroDetailFetchRef = useRef(false);
    const deleteTimerMapRef = useRef<Record<string, number>>({});

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    useEffect(() => {
        isSelectedCategoryDirtyRef.current = isSelectedCategoryDirty;
    }, [isSelectedCategoryDirty]);

    useEffect(() => {
        selectedCategoryRef.current = selectedCategory;
    }, [selectedCategory]);

    useEffect(() => {
        selectedDateRef.current = selectedDate;
    }, [selectedDate]);

    useEffect(() => {
        selectedRetroRef.current = selectedRetro;
    }, [selectedRetro]);

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

    const RETRO_AUTO_SAVE_DURATION = 5000;
    const RETRO_DELETE_UNDO_DURATION = 3000;
    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';

    const getVisibleRetroList = (retroList: RetroLogListItem[]): RetroLogListItem[] => {
        return retroList
            .map((retro): RetroLogListItem | null => {
                const visibleRetros =
                    retro.retros?.filter((item) => !item.id || !pendingDeleteRetroIds.includes(item.id)) ?? [];

                if (visibleRetros.length === 0) return null;

                const templateTypes = visibleRetros.reduce<RetroTemplateType[]>((types, item) => {
                    if (item.template_type) {
                        types.push(item.template_type as RetroTemplateType);
                    }

                    return types;
                }, []);

                return {
                    ...retro,
                    retros: visibleRetros,
                    count: visibleRetros.length,
                    template_types: templateTypes,
                };
            })
            .filter((retro): retro is RetroLogListItem => retro !== null);
    };

    const retroLogs = useMemo(
        () => retroLogsResponse?.pages.flatMap((page) => page.items ?? []) ?? [],
        [retroLogsResponse]
    );
    const visibleRetroArr = useMemo(() => getVisibleRetroList(retroLogs), [retroLogs, pendingDeleteRetroIds]);
    const visibleSearchResults = retroSearchResults.filter(
        (retro) => !retro.id || !pendingDeleteRetroIds.includes(retro.id)
    );
    const displayLoading = isSearchMode ? isRetroSearchLoading : isRetroLogsLoading;
    const totalRetroCount = retroLogsResponse?.pages[0]?.total_count ?? visibleRetroArr.length;
    const displayTotalCount = isSearchMode ? visibleSearchResults.length : totalRetroCount;
    const emptyRetroMessage = isSearchMode ? '검색 결과가 없습니다.' : '아직 작성된 회고가 없습니다.';
    const selectedCategoryHasContent = Object.values(content[selectedCategory] ?? {}).some((value) => value?.trim());
    const displayedAutoSaveState = isBackgroundRetroSaving ? 'saving' : autoSaveState;
    const displayedAutoSaveText = isBackgroundRetroSaving ? '저장중...' : autoSaveText;

    const findRetroListItemByRetroId = (retroId: string, retroList: RetroLogListItem[]) => {
        return getVisibleRetroList(retroList).find((retro) => retro.retros?.some((item) => item.id === retroId));
    };

    const getRetroContentMap = (retros: RetroLog[]): RetroContentMap => {
        return retros.reduce((acc, cur) => {
            if (!cur.template_type || !cur.content) return acc;

            acc[cur.template_type.toLowerCase()] = cur.content;
            return acc;
        }, {} as RetroContentMap);
    };

    const resetContentState = (nextContent: RetroContentMap) => {
        const clonedContent = cloneRetroContentMap(nextContent);

        contentRef.current = clonedContent;
        lastSavedContentRef.current = cloneRetroContentMap(clonedContent);
        setContent(clonedContent);
        setIsSelectedCategoryDirty(false);
    };

    const getCategoryLastSavedText = (category: string) => {
        const currentRetro = selectedRetroRef.current?.retros?.find(
            (item) => item.template_type?.toLowerCase() === category
        );

        return currentRetro?.updated_at ? formatLastSaved(currentRetro.updated_at) : '';
    };

    const restoreCategorySaveState = (category: string) => {
        if (selectedCategoryRef.current !== category) {
            return;
        }

        const lastSavedText = getCategoryLastSavedText(category);

        setAutoSaveState(lastSavedText ? 'saved' : '');
        setAutoSaveText(lastSavedText);
    };

    const isCategoryContentDirty = (category: string, nextContent: RetroContentMap = contentRef.current) => {
        return !isSameRetroContent(nextContent[category], lastSavedContentRef.current[category]);
    };

    const markCategoryContentSaved = (category: string, savedContent: RetroContent) => {
        lastSavedContentRef.current = {
            ...lastSavedContentRef.current,
            [category]: { ...savedContent },
        };

        if (selectedCategoryRef.current === category) {
            setIsSelectedCategoryDirty(isCategoryContentDirty(category));
        }
    };

    const syncCategorySaveState = (category: string, nextContent: RetroContentMap = contentRef.current) => {
        const isDirty = isCategoryContentDirty(category, nextContent);

        if (selectedCategoryRef.current !== category) {
            return isDirty;
        }

        setIsSelectedCategoryDirty(isDirty);

        if (isDirty) {
            setAutoSaveState('writing');
            setAutoSaveText('작성중...');
            return isDirty;
        }

        restoreCategorySaveState(category);
        return isDirty;
    };

    const getDirtyCategories = () => {
        return Object.keys(contentRef.current).filter((category) => isCategoryContentDirty(category));
    };

    const buildRetroListItem = (retros: RetroLog[], retroDate: string): RetroLogListItem | undefined => {
        const visibleRetros = retros.filter((retro) => !retro.id || !pendingDeleteRetroIds.includes(retro.id));

        if (visibleRetros.length === 0) return undefined;

        const templateTypes = visibleRetros.reduce<RetroTemplateType[]>((types, item) => {
            if (!item.template_type) return types;

            const templateType = item.template_type as RetroTemplateType;

            if (!types.includes(templateType)) {
                types.push(templateType);
            }

            return types;
        }, []);

        const latestCreatedAt = visibleRetros.reduce<string | undefined>((latest, retro) => {
            if (!retro.created_at) return latest;
            if (!latest) return retro.created_at;

            return new Date(retro.created_at).getTime() > new Date(latest).getTime() ? retro.created_at : latest;
        }, undefined);

        return {
            retro_date: retroDate,
            template_types: templateTypes,
            count: visibleRetros.length,
            latest_created_at: latestCreatedAt,
            retros: visibleRetros,
        };
    };

    const routeDateListRetro = useMemo(() => {
        if (!routeDateKey) {
            return undefined;
        }

        return visibleRetroArr.find((retro) => retro.retro_date && isSameDate(retro.retro_date, routeDateKey));
    }, [routeDateKey, visibleRetroArr]);

    const initContent = () => {
        resetContentState(createEmptyRetroContent());
    };

    const clearRetroState = () => {
        selectedRetroRef.current = undefined;
        selectedCategoryRef.current = RETRO_CATEGORY_NAME.TECH;
        setSelectedRetro(undefined);
        setSelectedCategory(RETRO_CATEGORY_NAME.TECH);
        initContent();
        setAutoSaveState('');
        setAutoSaveText('');
    };

    const applyRetroState = (retro: RetroLogListItem) => {
        if (!retro.retros || !retro.template_types?.length) {
            clearRetroState();
            return;
        }

        const nextCategory = retro.template_types[0].toLowerCase();

        selectedRetroRef.current = retro;
        selectedCategoryRef.current = nextCategory;
        setSelectedRetro(retro);
        setSelectedCategory(nextCategory);
        resetContentState(getRetroContentMap(retro.retros));
        restoreCategorySaveState(nextCategory);
    };

    useEffect(() => {
        if (!routeDateKey) {
            return;
        }

        setSelectedDate(parseDate(routeDateKey));
        setIsOpenCalendar(false);

        if (routeDateListRetro && !isSelectedCategoryDirtyRef.current) {
            applyRetroState(routeDateListRetro);
        }
    }, [routeDateKey, routeDateListRetro]);

    useEffect(() => {
        if (!routeDateKey) {
            return;
        }

        let isCurrent = true;
        const nextSelectedDate = parseDate(routeDateKey);

        setSelectedDate(nextSelectedDate);
        setIsOpenCalendar(false);

        const syncRouteDate = async () => {
            try {
                const dateRetros = await getRetroLog({ date: routeDateKey });

                if (!isCurrent || isSelectedCategoryDirtyRef.current) {
                    return;
                }

                const matchedRetro = buildRetroListItem(dateRetros, routeDateKey);

                if (!matchedRetro?.retros || !matchedRetro.template_types?.length) {
                    clearRetroState();
                    return;
                }

                applyRetroState(matchedRetro);
            } catch {
                if (!isCurrent || isSelectedCategoryDirtyRef.current) {
                    return;
                }

                clearRetroState();
            }
        };

        void syncRouteDate();

        return () => {
            isCurrent = false;
        };
    }, [routeDateKey]);

    const mergeRetroLogIntoRetroListItem = (
        retroLog: RetroLog,
        baseRetro: RetroLogListItem | undefined,
        retroDate: string
    ): RetroLogListItem => {
        const nextRetros = baseRetro?.retros?.some((item) => retroLog.id && item.id === retroLog.id)
            ? baseRetro.retros.map((item) => (item.id === retroLog.id ? retroLog : item))
            : [...(baseRetro?.retros?.filter((item) => item.template_type !== retroLog.template_type) ?? []), retroLog];

        const templateTypes = nextRetros.reduce<RetroTemplateType[]>((types, item) => {
            if (!item.template_type) return types;

            const templateType = item.template_type as RetroTemplateType;

            if (!types.includes(templateType)) {
                types.push(templateType);
            }

            return types;
        }, []);

        return {
            ...baseRetro,
            retro_date: retroLog.retro_date ?? baseRetro?.retro_date ?? retroDate,
            template_types: templateTypes,
            count: nextRetros.length,
            latest_created_at: baseRetro?.latest_created_at ?? retroLog.created_at,
            retros: nextRetros,
        };
    };

    const mergeRetroLogIntoSelectedRetro = (retroLog: RetroLog, baseRetro?: RetroLogListItem): RetroLogListItem => {
        return mergeRetroLogIntoRetroListItem(
            retroLog,
            baseRetro,
            formatDate(selectedDateRef.current, DATE_FORMAT.api)
        );
    };

    const upsertRetroLogDetailCache = (retroLog: RetroLog, retroDate: string) => {
        queryClient.setQueryData<RetroLog[]>(getGetRetroLogQueryKey({ date: retroDate }), (currentRetros = []) => {
            const existingIndex = currentRetros.findIndex((item) => {
                if (retroLog.id && item.id === retroLog.id) return true;

                return item.template_type === retroLog.template_type;
            });

            if (existingIndex === -1) {
                return [...currentRetros, retroLog];
            }

            return currentRetros.map((item, index) => (index === existingIndex ? retroLog : item));
        });
    };

    const upsertRetroLogListCache = (retroLog: RetroLog, retroDate: string) => {
        queryClient.setQueryData<RetroLogInfiniteData>(retroLogsQueryKey, (current) => {
            const nextListItem = mergeRetroLogIntoRetroListItem(retroLog, undefined, retroDate);

            if (!current) {
                return {
                    pageParams: [1],
                    pages: [
                        {
                            items: [nextListItem],
                            page: 1,
                            page_size: RETRO_LOG_PAGE_SIZE,
                            total_count: 1,
                            total_pages: 1,
                            has_next: false,
                        },
                    ],
                };
            }

            let didUpdate = false;
            const pages = current.pages.map((page) => {
                const items = page.items ?? [];
                let didUpdatePage = false;

                const nextItems = items.map((item) => {
                    if (item.retro_date !== retroDate) return item;

                    didUpdate = true;
                    didUpdatePage = true;
                    return mergeRetroLogIntoRetroListItem(retroLog, item, retroDate);
                });

                return didUpdatePage ? { ...page, items: nextItems } : page;
            });

            if (didUpdate) {
                return { ...current, pages };
            }

            const [firstPage, ...restPages] = pages;
            const pageSize = firstPage?.page_size ?? RETRO_LOG_PAGE_SIZE;
            const firstItems = firstPage?.items ?? [];
            const totalCount = (firstPage?.total_count ?? firstItems.length) + 1;
            const totalPages = Math.max(firstPage?.total_pages ?? 1, Math.ceil(totalCount / pageSize));
            const nextFirstItems = [nextListItem, ...firstItems].sort((left, right) =>
                (right.retro_date ?? '').localeCompare(left.retro_date ?? '')
            );
            const nextFirstPage: RetroLogListResponse = {
                ...(firstPage ?? {}),
                items: nextFirstItems,
                page: firstPage?.page ?? 1,
                page_size: pageSize,
                total_count: totalCount,
                total_pages: totalPages,
                has_next: firstPage?.has_next ?? totalCount > pageSize,
            };

            return {
                ...current,
                pageParams: current.pageParams.length ? current.pageParams : [1],
                pages: [nextFirstPage, ...restPages],
            };
        });
    };

    const syncSavedRetroLogCaches = (retroLog: RetroLog, retroDate: string) => {
        upsertRetroLogDetailCache(retroLog, retroDate);
        upsertRetroLogListCache(retroLog, retroDate);
    };

    const handleCalendarDateSelect = (date: Date) => {
        if (date.getTime() > todayStart.getTime()) {
            return;
        }

        const retro = visibleRetroArr.find((retro) => {
            if (retro.retro_date) return isSameDate(new Date(retro.retro_date), date);
        });
        console.log('CALENDAR retro', retro);

        if (retro && retro.retros && retro.template_types?.length) {
            selectedRetroRef.current = retro;
            setSelectedRetro(retro);

            const nextCategory = retro.template_types[0].toLowerCase();
            selectedCategoryRef.current = nextCategory;
            setSelectedCategory(nextCategory);

            const mapped = getRetroContentMap(retro.retros);
            console.log('mapped', mapped);

            resetContentState(mapped);

            restoreCategorySaveState(nextCategory);
        } else {
            selectedRetroRef.current = undefined;
            setSelectedRetro(undefined);
            initContent();
            setAutoSaveState('');
            setAutoSaveText('');
        }

        setSelectedDate(date);
        setIsOpenCalendar(false);
    };

    const moveSelectedDate = (days: number) => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + days);

        handleCalendarDateSelect(nextDate);
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
        if (!retro?.retros || !retro.template_types?.length) return;

        selectedRetroRef.current = retro;
        setSelectedRetro(retro);

        const nextCategory = retro.template_types[0].toLowerCase();
        selectedCategoryRef.current = nextCategory;

        resetContentState(getRetroContentMap(retro.retros));
        setSelectedDate(new Date(`${retro.retro_date}T00:00:00`));
        setSelectedCategory(nextCategory);

        restoreCategorySaveState(nextCategory);
    };

    useEffect(() => {
        if (
            initialTodayRetroSelectedRef.current ||
            isRetroLogsLoading ||
            isSearchMode ||
            selectedRetro ||
            isSelectedCategoryDirty ||
            formatDate(selectedDate, DATE_FORMAT.api) !== todayDateKey
        ) {
            return;
        }

        const selectTodayRetro = (retro: RetroLogListItem) => {
            if (!retro.retros || !retro.template_types?.length) return;

            const nextCategory = retro.template_types[0].toLowerCase();

            initialTodayRetroSelectedRef.current = true;
            selectedRetroRef.current = retro;
            selectedCategoryRef.current = nextCategory;
            setSelectedRetro(retro);
            resetContentState(getRetroContentMap(retro.retros));
            setSelectedDate(new Date(`${retro.retro_date}T00:00:00`));
            setSelectedCategory(nextCategory);
            restoreCategorySaveState(nextCategory);
        };

        const todayRetro = visibleRetroArr.find((retro) => retro.retro_date === todayDateKey);

        if (todayRetro?.retros && todayRetro.template_types?.length) {
            selectTodayRetro(todayRetro);
            return;
        }

        if (isRetroLogsLoading || isRetroLogsFetching || initialTodayRetroDetailFetchRef.current) {
            return;
        }

        initialTodayRetroDetailFetchRef.current = true;
        let isCurrent = true;

        const fetchTodayRetro = async () => {
            try {
                const dateRetros = await getRetroLog({ date: todayDateKey });
                const fetchedTodayRetro = buildRetroListItem(dateRetros, todayDateKey);

                if (!isCurrent || !fetchedTodayRetro?.retros || !fetchedTodayRetro.template_types?.length) {
                    return;
                }

                selectTodayRetro(fetchedTodayRetro);
            } catch {
                if (isCurrent) {
                    initialTodayRetroDetailFetchRef.current = false;
                }
            }
        };

        void fetchTodayRetro();

        return () => {
            isCurrent = false;
            if (!initialTodayRetroSelectedRef.current) {
                initialTodayRetroDetailFetchRef.current = false;
            }
        };
    }, [
        isRetroLogsLoading,
        isRetroLogsFetching,
        isSearchMode,
        isSelectedCategoryDirty,
        selectedDate,
        selectedRetro,
        todayDateKey,
        visibleRetroArr,
    ]);

    useEffect(() => {
        if (
            !selectedRetro ||
            isRetroLogsLoading ||
            isRetroLogsFetching ||
            isSearchMode ||
            getDirtyCategories().length > 0
        ) {
            return;
        }

        const selectedDateKey = formatDate(selectedDate, DATE_FORMAT.api);
        const latestRetro = visibleRetroArr.find((retro) => retro.retro_date === selectedDateKey);

        if (!latestRetro?.retros || !latestRetro.template_types?.length) {
            return;
        }

        const latestContentMap = getRetroContentMap(latestRetro.retros);

        if (isSameRetroContentMap(latestContentMap, contentRef.current)) {
            return;
        }

        const currentCategory = selectedCategoryRef.current;
        const nextCategory = latestRetro.template_types.some((type) => type.toLowerCase() === currentCategory)
            ? currentCategory
            : latestRetro.template_types[0].toLowerCase();

        selectedRetroRef.current = latestRetro;
        selectedCategoryRef.current = nextCategory;
        setSelectedRetro(latestRetro);
        resetContentState(latestContentMap);
        setSelectedCategory(nextCategory);
        restoreCategorySaveState(nextCategory);
    }, [isRetroLogsFetching, isRetroLogsLoading, isSearchMode, selectedDate, selectedRetro, visibleRetroArr]);

    const handleChangeSearchInput = (value: string) => {
        setSearch(value);

        if (!value.trim()) {
            setSearchKeyword('');
        }
    };

    const handleClearSearchInput = () => {
        setSearch('');
        setSearchKeyword('');
    };

    const searchRetroList = () => {
        setSearchKeyword(search.trim());
    };

    const handleDashboardCalendarClick = () => {
        navigate(`/dashboard?view=calendar&date=${formatDate(selectedDate, DATE_FORMAT.api)}`);
    };

    const handleSearchRetroClick = async (searchItem: RetroLogSearchItem) => {
        if (!searchItem.id || !searchItem.retro_date || !searchItem.template_type) return;

        let matchedRetro = findRetroListItemByRetroId(searchItem.id, retroLogs);

        if (!matchedRetro) {
            try {
                const dateRetros = await getRetroLog({ date: searchItem.retro_date });
                matchedRetro = buildRetroListItem(dateRetros, searchItem.retro_date);
            } catch {
                matchedRetro = undefined;
            }
        }

        if (!matchedRetro?.retros || !matchedRetro.template_types) {
            showToast({
                iconName: 'error',
                message: '회고 상세 정보를 찾을 수 없어요.',
                duration: 3000,
            });
            return;
        }

        const nextCategory = searchItem.template_type.toLowerCase();
        selectedRetroRef.current = matchedRetro;
        setSelectedRetro(matchedRetro);
        resetContentState(getRetroContentMap(matchedRetro.retros));
        setSelectedDate(new Date(`${searchItem.retro_date}T00:00:00`));
        selectedCategoryRef.current = nextCategory;
        setSelectedCategory(nextCategory);
        restoreCategorySaveState(nextCategory);
        setIsOpenCalendar(false);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: string, key: string) => {
        const nextContent = {
            ...contentRef.current,
            [type]: {
                ...(contentRef.current[type] ?? {}),
                [key]: e.target.value,
            },
        };

        contentRef.current = nextContent;
        setContent(nextContent);

        if (!syncCategorySaveState(type, nextContent)) {
            if (contentChangeTimerRef.current) {
                clearTimeout(contentChangeTimerRef.current);
            }

            return;
        }

        if (isSaveProgresing) return;

        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
        }

        contentChangeTimerRef.current = setTimeout(() => {
            void saveCategoryContent(type);
        }, RETRO_AUTO_SAVE_DURATION);
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
        selectedCategoryRef.current = value;
        setSelectedCategory(value);
        syncCategorySaveState(value);
    };

    const saveCategoryContent = async (categoryToSave: string, options: SaveCategoryContentOptions = {}) => {
        const isBackgroundSave = options.background ?? false;
        const canUpdateUi = () => !isBackgroundSave && isMountedRef.current;

        if (contentChangeTimerRef.current) {
            clearTimeout(contentChangeTimerRef.current);
            contentChangeTimerRef.current = null;
        }

        const contentToSave = { ...(contentRef.current[categoryToSave] ?? {}) };

        if (!isCategoryContentDirty(categoryToSave)) {
            if (canUpdateUi() && selectedCategoryRef.current === categoryToSave) {
                setIsSelectedCategoryDirty(false);
                restoreCategorySaveState(categoryToSave);
            }

            return true;
        }

        if (canUpdateUi() && selectedCategoryRef.current === categoryToSave) {
            setAutoSaveState('saving');
            setAutoSaveText('저장중...');
        }

        isSaveProgresingRef.current = true;
        if (canUpdateUi()) {
            setIsSaveProgresing(true);
        }

        const savePromise = (async () => {
            try {
                const currentRetro = selectedRetroRef.current?.retros?.find(
                    (item) => item.template_type?.toLowerCase() === categoryToSave
                );
                const savedRetro = currentRetro?.id
                    ? await updateRetroLogRequest(currentRetro.id, {
                          content: contentToSave,
                      })
                    : await createRetroLogRequest({
                          retro_date: formatDate(selectedDateRef.current, DATE_FORMAT.api),
                          template_type: capitalize(categoryToSave) as CreateRetroLogRequestTemplateType,
                          content: contentToSave,
                      });
                const savedRetroDate = savedRetro.retro_date ?? formatDate(selectedDateRef.current, DATE_FORMAT.api);

                syncSavedRetroLogCaches(savedRetro, savedRetroDate);

                if (canUpdateUi()) {
                    setSelectedRetro((prev) => {
                        const nextRetro = mergeRetroLogIntoSelectedRetro(savedRetro, prev);
                        selectedRetroRef.current = nextRetro;
                        return nextRetro;
                    });
                    markCategoryContentSaved(categoryToSave, contentToSave);
                }

                void Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: retroLogsQueryKey,
                    }),
                    queryClient.invalidateQueries({
                        queryKey: getGetRetroLogQueryKey({ date: savedRetroDate }),
                    }),
                ]).catch(() => undefined);

                if (canUpdateUi() && selectedCategoryRef.current === categoryToSave) {
                    setAutoSaveState('saved');
                    setAutoSaveText('마지막 저장 방금 전');
                }

                return true;
            } catch {
                if (canUpdateUi() && selectedCategoryRef.current === categoryToSave) {
                    setAutoSaveState('error');
                    setAutoSaveText('저장에 실패했어요');
                }

                showToast({
                    iconName: 'error',
                    message: '회고 저장에 실패했어요.',
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

    const flushPendingRetroSave = async (options: SaveCategoryContentOptions = {}) => {
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

        const dirtyCategories = getDirtyCategories();

        for (const category of dirtyCategories) {
            const saved = await saveCategoryContent(category, options);

            if (!saved) {
                return false;
            }
        }

        return true;
    };

    const saveContent = async () => {
        await flushPendingRetroSave();
    };

    useBeforeUnload((event) => {
        if (
            getDirtyCategories().length === 0 &&
            !isSaveProgresingRef.current &&
            !useRetroSaveStatusStore.getState().isBackgroundSaving
        ) {
            return;
        }

        event.preventDefault();
        event.returnValue = '';
    });

    useEffect(() => {
        return () => {
            if (getDirtyCategories().length === 0 && !savePromiseRef.current) {
                return;
            }

            const { beginBackgroundSave, endBackgroundSave } = useRetroSaveStatusStore.getState();

            beginBackgroundSave();
            void flushPendingRetroSave({ background: true }).finally(endBackgroundSave);
        };
    }, []);

    const openDeleteModal = (retro: RetroLogListItem) => {
        if (!retro.retros?.length) {
            showToast({
                iconName: 'error',
                message: '삭제할 회고가 없습니다.',
                duration: 3000,
            });
            return;
        }

        setDeleteTargetRetro(retro);
        setDeleteTargetTemplateTypes([]);
        setIsDeleteModalOpen(true);
    };

    const toggleDeleteTargetTemplateType = (value: string) => {
        setDeleteTargetTemplateTypes((prev) => {
            if (prev.includes(value)) {
                return prev.filter((type) => type !== value);
            }

            return [...prev, value];
        });
    };

    const removeDeleteTimers = (ids: string[]) => {
        ids.forEach((id) => {
            delete deleteTimerMapRef.current[id];
        });
    };

    const clearPendingDelete = (ids: string[]) => {
        const timerIds = new Set(
            ids.map((id) => deleteTimerMapRef.current[id]).filter((timerId): timerId is number => Boolean(timerId))
        );

        timerIds.forEach((timerId) => {
            window.clearTimeout(timerId);
        });

        removeDeleteTimers(ids);

        setPendingDeleteRetroIds((prev) => prev.filter((id) => !ids.includes(id)));
    };

    const handleDeleteRetro = async () => {
        if (!deleteTargetRetro) return;

        if (deleteTargetTemplateTypes.length === 0) {
            showToast({
                iconName: 'error',
                message: '삭제할 회고를 선택해주세요.',
                duration: 3000,
            });
            return;
        }

        const targetRetros =
            deleteTargetRetro.retros?.filter((retro) => {
                const templateType = retro.template_type?.toLowerCase();

                return templateType ? deleteTargetTemplateTypes.includes(templateType) : false;
            }) ?? [];

        const targetRetroIds = targetRetros.map((retro) => retro.id).filter((id): id is string => Boolean(id));

        if (targetRetroIds.length === 0) {
            showToast({
                iconName: 'error',
                message: '삭제할 회고 id가 없습니다.',
                duration: 3000,
            });
            return;
        }

        if (targetRetroIds.some((id) => deleteTimerMapRef.current[id])) {
            return;
        }

        if (contentChangeTimerRef.current) {
            window.clearTimeout(contentChangeTimerRef.current);
            contentChangeTimerRef.current = null;
        }

        const deletedCurrentCategory = deleteTargetTemplateTypes.includes(selectedCategory);
        const deletedSelectedDate = selectedRetro?.retro_date === deleteTargetRetro.retro_date;

        setPendingDeleteRetroIds((prev) => [...prev, ...targetRetroIds.filter((id) => !prev.includes(id))]);

        setIsDeleteModalOpen(false);
        setDeleteTargetRetro(undefined);
        setDeleteTargetTemplateTypes([]);

        if (deletedSelectedDate && deletedCurrentCategory) {
            selectedRetroRef.current = undefined;
            setSelectedRetro(undefined);
            initContent();
            setAutoSaveState('');
            setAutoSaveText('');
        }

        const timerId = window.setTimeout(async () => {
            try {
                await Promise.all(targetRetroIds.map((id) => deleteRetroLog({ id })));
                await queryClient.invalidateQueries({
                    queryKey: retroLogsQueryKey,
                });
            } catch {
                showToast({
                    iconName: 'error',
                    message: '회고 삭제에 실패했어요.',
                    duration: 3000,
                });
            } finally {
                removeDeleteTimers(targetRetroIds);
                setPendingDeleteRetroIds((prev) => prev.filter((id) => !targetRetroIds.includes(id)));
            }
        }, RETRO_DELETE_UNDO_DURATION);

        targetRetroIds.forEach((id) => {
            deleteTimerMapRef.current[id] = timerId;
        });

        showToast({
            message: '회고를 삭제했어요',
            iconName: 'delete',
            textButton: true,
            textButtonLabel: '취소',
            onTextButtonClick: () => clearPendingDelete(targetRetroIds),
            duration: RETRO_DELETE_UNDO_DURATION,
        });
    };

    const getRetroCategoryLabel = (type: string) => {
        switch (type) {
            case RETRO_CATEGORY_NAME.TECH:
                return '기술';
            case RETRO_CATEGORY_NAME.DECISION:
                return '의사결정';
            case RETRO_CATEGORY_NAME.COMMUNICATION:
                return '소통';
            case RETRO_CATEGORY_NAME.EMOTION:
                return '감정';
            default:
                return type;
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteTargetRetro(undefined);
        setDeleteTargetTemplateTypes([]);
    };

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const RetroSkeletonRow = () => {
        return (
            <div className='flex flex-col w-full gap-3 rounded-xl border border-neutral-subtle bg-white p-4 animate-pulse'>
                <div className='h-4 w-[45%] rounded-full bg-gray-100' />
                <div className='flex gap-2'>
                    <div className='h-5 w-12 rounded-full bg-gray-100' />
                    <div className='h-5 w-12 rounded-full bg-gray-100' />
                </div>
            </div>
        );
    };

    const RetroSearchResultCard = ({ searchItem }: { searchItem: RetroLogSearchItem }) => {
        const templateType = searchItem.template_type?.toLowerCase();
        const isSelected =
            !!searchItem.id &&
            selectedRetro?.retros?.some((retro) => retro.id === searchItem.id) &&
            selectedCategory === templateType;

        return (
            <button
                aria-selected={isSelected || undefined}
                className={[
                    'flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-300',
                    isSelected
                        ? 'border-primary bg-primary-subtle'
                        : 'border-neutral-subtle bg-transparent hover:cursor-pointer hover:border-neutral-lighter hover:bg-gray-50',
                ].join(' ')}
                type='button'
                onClick={() => handleSearchRetroClick(searchItem)}
            >
                <div className='flex items-start justify-between gap-3'>
                    <p className='min-w-0 truncate text-lg leading-none font-medium text-black'>
                        {searchItem.retro_date ? relativeDate(searchItem.retro_date) : '날짜 없음'}
                    </p>

                    {templateType ? (
                        <span className='shrink-0 rounded-full border border-neutral-subtle px-2 py-1 text-xs leading-none font-medium text-neutral-darker'>
                            {getRetroCategoryLabel(templateType)}
                        </span>
                    ) : null}
                </div>

                <p className='text-sm leading-5 text-neutral-darker'>
                    {searchItem.content_preview?.trim() || '미리보기 내용이 없습니다.'}
                </p>
            </button>
        );
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
                            <div className='flex w-full gap-2'>
                                <SearchInput
                                    className='flex-1 min-w-0'
                                    placeholder='제목 또는 내용으로 검색하세요'
                                    value={search}
                                    onChange={(e) => handleChangeSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;

                                        e.preventDefault();
                                        searchRetroList();
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
                                {search ? (
                                    <Button className='!px-2' variant='outline' onClick={searchRetroList}>
                                        <Icon name='search' size={20} />
                                    </Button>
                                ) : null}
                            </div>
                            <div className='mt-4 mb-2 flex w-full justify-between'>
                                <p className='text-neutral-darker'>{isSearchMode ? '검색 결과' : '전체'}</p>
                                <Badge label={`총 ${displayTotalCount}건`} />
                            </div>

                            <div
                                ref={listScrollRef}
                                className='flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto mask-b-from-97% pb-10'
                            >
                                {displayLoading &&
                                ((isSearchMode && visibleSearchResults.length === 0) ||
                                    (!isSearchMode && visibleRetroArr.length === 0))
                                    ? Array.from({ length: 3 }, (_, index) => (
                                          <RetroSkeletonRow key={`retro-skeleton-${index}`} />
                                      ))
                                    : null}

                                {!displayLoading &&
                                ((isSearchMode && visibleSearchResults.length === 0) ||
                                    (!isSearchMode && visibleRetroArr.length === 0)) ? (
                                    <div className='flex min-h-40 w-full shrink-0 items-center justify-center rounded-[28px] border-2 border-dashed border-gray-100 bg-white px-6 py-10 text-center'>
                                        <p className='text-lg font-semibold leading-7 text-neutral'>
                                            {emptyRetroMessage}
                                        </p>
                                    </div>
                                ) : null}

                                {isSearchMode
                                    ? visibleSearchResults.map((searchItem, index) => (
                                          <RetroSearchResultCard
                                              key={searchItem.id ?? `${searchItem.retro_date}-${index}`}
                                              searchItem={searchItem}
                                          />
                                      ))
                                    : visibleRetroArr.map((retro: RetroLogListItem) => (
                                          <RetroCard
                                              key={retro.retro_date}
                                              retro={retro}
                                              state={
                                                  retro.retro_date && isSameDate(retro.retro_date, selectedDate)
                                                      ? 'selected'
                                                      : 'default'
                                              }
                                              onClick={() => handleRetroClick(retro)}
                                              onDeleteClick={() => openDeleteModal(retro)}
                                          />
                                      ))}

                                {!isSearchMode && isFetchingNextPage
                                    ? Array.from({ length: 2 }, (_, index) => (
                                          <RetroSkeletonRow key={`next-retro-skeleton-${index}`} />
                                      ))
                                    : null}
                                <div ref={loadMoreRef} className='h-1 shrink-0' />
                            </div>

                            <Button fullWidth={true} variant='outline' onClick={handleDashboardCalendarClick}>
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
                                    disabled={!selectedCategoryHasContent}
                                    onClick={copyContent}
                                >
                                    내용 복사
                                </Button>

                                <Button
                                    className='mt-3 px-10'
                                    variant='filled'
                                    size='lg'
                                    disabled={!selectedCategoryHasContent || !isSelectedCategoryDirty}
                                    onClick={saveContent}
                                >
                                    저장
                                </Button>
                            </div>
                        </section>
                    </section>
                </SidebarContentLayout>
            </div>

            {isDeleteModalOpen && deleteTargetRetro ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]'>
                    <div
                        className='w-full max-w-[420px] rounded-[1.75rem] border border-neutral-lighter bg-white p-6 shadow-shadow-1'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='delete-retro-title'
                    >
                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <h2 id='delete-retro-title' className='text-2xl font-bold text-black'>
                                    회고 삭제
                                </h2>
                                <p className='mt-2 text-base leading-6 text-neutral-darker'>
                                    {deleteTargetRetro.retro_date} 회고 중 삭제할 항목을 선택하세요.
                                </p>
                            </div>

                            <button
                                aria-label='닫기'
                                className='inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-neutral transition-colors hover:bg-neutral-subtle hover:text-neutral-darker'
                                onClick={closeDeleteModal}
                                type='button'
                            >
                                <Icon name='close' size={20} />
                            </button>
                        </div>

                        <div className='mt-5 flex flex-col gap-2'>
                            {deleteTargetRetro.retros?.map((retro) => {
                                const value = retro.template_type?.toLowerCase();

                                if (!value) return null;

                                const checked = deleteTargetTemplateTypes.includes(value);

                                return (
                                    <label
                                        key={retro.id ?? value}
                                        className={[
                                            'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors',
                                            checked
                                                ? 'border-danger bg-danger/5 text-danger'
                                                : 'border-neutral-subtle bg-white text-neutral-darker hover:border-neutral',
                                        ].join(' ')}
                                    >
                                        <input
                                            className='size-4 accent-danger'
                                            type='checkbox'
                                            value={value}
                                            checked={checked}
                                            onChange={() => toggleDeleteTargetTemplateType(value)}
                                        />
                                        <span className='text-base font-medium'>{getRetroCategoryLabel(value)}</span>
                                    </label>
                                );
                            })}
                        </div>

                        <div className='mt-6 grid grid-cols-2 gap-2'>
                            <Button fullWidth variant='outline' onClick={closeDeleteModal}>
                                취소
                            </Button>
                            <Button
                                fullWidth
                                variant='filled'
                                className='!bg-danger hover:!bg-danger-darker'
                                disabled={deleteTargetTemplateTypes.length === 0}
                                onClick={handleDeleteRetro}
                            >
                                삭제하기
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Container>
    );
}
