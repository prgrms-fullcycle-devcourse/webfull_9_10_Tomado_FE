import type { Login200 } from '@/api/generated/model/login200';
import type { Register201 } from '@/api/generated/model/register201';
import type { AuthTokens, AuthUser } from './types';

type AuthSuccessResponse = Login200 | Register201;

const mapAuthSuccessToAuthUser = (response: AuthSuccessResponse): AuthUser => ({
    id: response.user?.id ?? '',
    loginId: response.user?.login_id ?? '',
    nickname: response.user?.nickname ?? '',
    avatarSrc: response.user?.avatar_url ?? null,
});

const mapAuthSuccessToAuthTokens = (response: AuthSuccessResponse): AuthTokens => ({
    accessToken: response.access_token ?? '',
    refreshToken: response.refresh_token ?? '',
});

export const mapLoginResponseToAuthUser = (response: Login200): AuthUser =>
    mapAuthSuccessToAuthUser(response);

export const mapLoginResponseToAuthTokens = (response: Login200): AuthTokens =>
    mapAuthSuccessToAuthTokens(response);

export const mapRegisterResponseToAuthUser = (response: Register201): AuthUser =>
    mapAuthSuccessToAuthUser(response);

export const mapRegisterResponseToAuthTokens = (response: Register201): AuthTokens =>
    mapAuthSuccessToAuthTokens(response);
