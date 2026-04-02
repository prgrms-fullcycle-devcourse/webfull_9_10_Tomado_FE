import type { PostApiV1AuthLogin200 } from '@/api/generated/model/postApiV1AuthLogin200';
import type { AuthTokens, AuthUser } from './types';

export const mapLoginResponseToAuthUser = (response: PostApiV1AuthLogin200): AuthUser => ({
    id: response.user?.id ?? '',
    loginId: response.user?.login_id ?? '',
    nickname: response.user?.nickname ?? '',
    avatarSrc: response.user?.avatar_url ?? null,
});

export const mapLoginResponseToAuthTokens = (response: PostApiV1AuthLogin200): AuthTokens => ({
    accessToken: response.access_token ?? '',
    refreshToken: response.refresh_token ?? '',
});
