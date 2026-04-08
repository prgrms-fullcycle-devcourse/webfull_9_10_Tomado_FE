import { useAuthStore } from '@/features/auth';
import type { AuthTokens } from '@/features/auth/types';

type Primitive = string | number | boolean;

type QueryValue = Primitive | null | undefined | Array<Primitive | null | undefined>;

interface ErrorResponse {
    error?: {
        code?: string;
        message?: string;
    };
}

interface AuthTokensResponse {
    access_token: string;
    refresh_token: string;
}

export interface CustomInstanceConfig extends Omit<RequestInit, 'body'> {
    params?: Record<string, QueryValue>;
    body?: BodyInit | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_PATH = '/api/v1/auth/refresh';

// INFO: 여러 요청이 동시에 401을 받아도 refresh 요청은 한 번만 보내기 위한 공유 promise입니다.
let refreshPromise: Promise<AuthTokens | null> | null = null;

const buildQueryString = (params?: Record<string, QueryValue>) => {
    if (!params) {
        return '';
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value == null) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item != null) {
                    searchParams.append(key, String(item));
                }
            });

            return;
        }

        searchParams.set(key, String(value));
    });

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : '';
};

const buildRequestUrl = (url: string, params?: Record<string, QueryValue>) => {
    const requestUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    return `${requestUrl}${buildQueryString(params)}`;
};

const readErrorMessage = async (response: Response) => {
    try {
        const payload = (await response.clone().json()) as ErrorResponse;
        return payload.error?.message ?? `Request failed with status ${response.status}`;
    } catch {
        return `Request failed with status ${response.status}`;
    }
};

const requestTokens = async (refreshToken: string) => {
    const response = await fetch(buildRequestUrl(REFRESH_PATH), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const payload = (await response.json()) as AuthTokensResponse;

    return {
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
    };
};

// INFO: access token이 만료되면 refresh token으로 새 토큰 쌍을 발급받아 store를 갱신합니다.
const refreshTokens = async () => {
    const { logout, setTokens, tokens } = useAuthStore.getState();
    const refreshToken = tokens?.refreshToken;

    if (!refreshToken) {
        logout();
        return null;
    }

    if (!refreshPromise) {
        refreshPromise = requestTokens(refreshToken)
            .then((nextTokens) => {
                setTokens(nextTokens);
                return nextTokens;
            })
            .catch((error) => {
                logout();
                throw error;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

export const customInstance = async <TResponse>(url: string, config: CustomInstanceConfig = {}): Promise<TResponse> => {
    const { params, headers, ...requestInit } = config;

    // INFO: 생성된 모든 API 호출은 이 함수로 들어오며, base URL과 인증 헤더를 공통 적용합니다.
    const executeRequest = async (accessToken?: string) =>
        fetch(buildRequestUrl(url, params), {
            ...requestInit,
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...headers,
            },
        });

    const initialToken = useAuthStore.getState().tokens?.accessToken;
    let response = await executeRequest(initialToken);
    const isRefreshRequest = url.endsWith(REFRESH_PATH);

    // INFO: 일반 요청이 401이면 refresh 후 동일 요청을 한 번 재시도합니다.
    if (response.status === 401 && !isRefreshRequest) {
        const nextTokens = await refreshTokens();

        if (!nextTokens) {
            throw new Error('Authentication expired');
        }

        response = await executeRequest(nextTokens.accessToken);
    }

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    if (response.status === 204) {
        return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
};
