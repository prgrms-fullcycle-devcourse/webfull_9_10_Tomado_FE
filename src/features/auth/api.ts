import type { Login200 } from '@/api/generated/model/login200';
import type { AuthTokens, AuthUser } from './types';

export const mapLoginResponseToAuthUser = (response: Login200): AuthUser => ({
    id: response.user?.id ?? '',
    loginId: response.user?.login_id ?? '',
    nickname: response.user?.nickname ?? '',
    avatarSrc: response.user?.avatar_url ?? null,
});

export const mapLoginResponseToAuthTokens = (response: Login200): AuthTokens => ({
    accessToken: response.access_token ?? '',
    refreshToken: response.refresh_token ?? '',
});
