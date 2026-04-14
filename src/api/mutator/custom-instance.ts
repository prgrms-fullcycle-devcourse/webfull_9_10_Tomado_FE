import { useAuthStore } from '@/features/auth';
import { stopBgmPlayback } from '@/features/settings';

type Primitive = string | number | boolean;

type QueryValue = Primitive | null | undefined | Array<Primitive | null | undefined>;

interface ErrorResponse {
    error?: {
        code?: string;
        message?: string;
    };
}

interface HttpError extends Error {
    status?: number;
    code?: string;
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

const buildHttpError = async (response: Response): Promise<HttpError> => {
    let code: string | undefined;
    let message = `Request failed with status ${response.status}`;

    try {
        const payload = (await response.clone().json()) as ErrorResponse;
        code = payload.error?.code;
        message = payload.error?.message ?? message;
    } catch {
        message = await readErrorMessage(response);
    }

    const error = new Error(message) as HttpError;
    error.status = response.status;
    error.code = code;

    return error;
};

// INFO: refresh 쿠키를 사용해 세션을 복구합니다.
const refreshSessionViaCookie = async (): Promise<void> => {
    const response = await fetch(buildRequestUrl(REFRESH_PATH), {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        stopBgmPlayback();
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
    const { params, headers, body, ...requestInit } = config;
    const isFormDataBody = typeof FormData !== 'undefined' && body instanceof FormData;

    const executeRequest = async () =>
        fetch(buildRequestUrl(url, params), {
            ...requestInit,
            body,
            credentials: 'include',
            headers: {
                ...(isFormDataBody ? {} : { 'Content-Type': 'application/json' }),
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
        throw await buildHttpError(response);
    }

    if (response.status === 204) {
        return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
};
