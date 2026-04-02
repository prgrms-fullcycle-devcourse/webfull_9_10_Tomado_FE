export interface SignupRequest {
    login_id: string;
    password: string;
    nickname: string;
}

export interface LoginRequest {
    login_id: string;
    password: string;
}

export interface SignupFormValues {
    userId: string;
    nickname: string;
    password: string;
    passwordConfirm: string;
}

export interface LoginFormValues {
    userId: string;
    password: string;
}

export interface AuthUser {
    id: string;
    loginId: string;
    nickname: string;
    avatarSrc?: string | null;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface SignupFieldValidation {
    isValid: boolean;
    helperText: string;
}

export const DEMO_LOGIN_CREDENTIALS = {
    userId: 'demojohn1',
    password: 'Demo@1234',
} as const;

export const DEMO_AUTH_USER: AuthUser = {
    id: 'demo-user',
    loginId: DEMO_LOGIN_CREDENTIALS.userId,
    nickname: '데모유저',
    avatarSrc: null,
};
