import { useAuthStore } from '@/features/auth';

type Primitive = string | number | boolean;

type QueryValue = Primitive | null | undefined | Array<Primitive | null | undefined>;

interface ErrorResponse {
    error?: {
        code?: string;
        message?: string;
    };
}

export interface CustomInstanceConfig extends Omit<RequestInit, 'body'> {
    params?: Record<string, QueryValue>;
    body?: BodyInit | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_PATH = '/api/v1/auth/refresh';

let refreshPromise: Promise<void> | null = null;

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

/** Refresh 쿠키로 세션 갱신(백엔드가 Set-Cookie로 토큰을 갱신한다고 가정). */
const refreshSessionViaCookie = async (): Promise<void> => {
    const response = await fetch(buildRequestUrl(REFRESH_PATH), {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        useAuthStore.getState().logout();
        throw new Error(await readErrorMessage(response));
    }
};

const refreshSessionOnce = async (): Promise<void> => {
    if (!refreshPromise) {
        refreshPromise = refreshSessionViaCookie().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
};

export const customInstance = async <TResponse>(url: string, config: CustomInstanceConfig = {}): Promise<TResponse> => {
    const { params, headers, ...requestInit } = config;

    const executeRequest = async () =>
        fetch(buildRequestUrl(url, params), {
            ...requestInit,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

    let response = await executeRequest();
    const isRefreshRequest = url.endsWith(REFRESH_PATH);

    if (response.status === 401 && !isRefreshRequest) {
        try {
            await refreshSessionOnce();
        } catch {
            throw new Error('Authentication expired');
        }

        response = await executeRequest();
    }

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    if (response.status === 204) {
        return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
};
