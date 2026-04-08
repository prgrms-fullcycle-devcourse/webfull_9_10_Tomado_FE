import type { Login200 } from '@/api/generated/model/login200';
import type { Register201 } from '@/api/generated/model/register201';
import type { User } from '@/api/generated/model/user';
import type { AuthUser } from './types';

type AuthSuccessResponse = Login200 | Register201;

const mapAuthSuccessToAuthUser = (response: AuthSuccessResponse): AuthUser => ({
    id: response.user?.id ?? '',
    loginId: response.user?.login_id ?? '',
    nickname: response.user?.nickname ?? '',
    avatarSrc: response.user?.avatar_url ?? null,
});

export const mapLoginResponseToAuthUser = (response: Login200): AuthUser =>
    mapAuthSuccessToAuthUser(response);

export const mapRegisterResponseToAuthUser = (response: Register201): AuthUser =>
    mapAuthSuccessToAuthUser(response);

/** GET /users/me 응답으로 스토어용 사용자 정보를 만듭니다. */
export const mapUserDtoToAuthUser = (user: User): AuthUser => ({
    id: user.id ?? '',
    loginId: user.login_id ?? '',
    nickname: user.nickname ?? '',
    avatarSrc: user.avatar_url ?? null,
});
