export interface SignupRequest {
    login_id: string;
    password: string;
    nickname: string;
}

export interface SignupFormValues {
    userId: string;
    nickname: string;
    password: string;
    passwordConfirm: string;
}

export interface SignupFieldValidation {
    isValid: boolean;
    helperText: string;
}
