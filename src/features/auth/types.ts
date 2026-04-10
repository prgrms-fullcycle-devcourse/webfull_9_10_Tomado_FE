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
