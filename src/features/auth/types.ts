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

export interface SignupFieldValidation {
    isValid: boolean;
    helperText: string;
}
