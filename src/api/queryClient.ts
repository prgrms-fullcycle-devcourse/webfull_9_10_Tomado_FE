import { QueryClient } from '@tanstack/react-query';

// INFO: 서버 상태 캐시 정책을 앱 전체에서 공유하기 위한 기본 QueryClient입니다.
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // INFO: 조회 직후 30초 동안은 fresh 데이터로 간주해 불필요한 재요청을 줄입니다.
            staleTime: 30_000,
            // INFO: 포커스 복귀 때 자동 재조회하지 않고, 명시적인 invalidation 중심으로 운용합니다.
            refetchOnWindowFocus: false,
        },
    },
});
