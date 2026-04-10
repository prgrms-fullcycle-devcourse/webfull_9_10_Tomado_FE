# Security

이 문서는 Tomado 프론트엔드의 인증, 세션, 민감 정보 처리 기준을 정리합니다.

## Auth Principles

- 인증 토큰은 프론트 저장소에 직접 보관하지 않습니다.
- access token / refresh token은 httpOnly 쿠키 기반 전달을 전제로 합니다.
- 프론트는 인증 결과로 받은 사용자 정보와 인증 여부만 store에 유지합니다.
- 인증 여부 복구는 로컬 저장값이 아니라 `GET /users/me` 응답 기준으로 처리합니다.

관련 파일:

- `src/features/auth/useAuthStore.ts`
- `src/features/auth/AuthSessionBridge.tsx`

## Session Recovery

- 앱 시작 시 `AuthSessionBridge`가 세션 복구를 수행합니다.
- 복구 전에는 자식 렌더를 보류해 라우트 가드가 잘못 동작하지 않게 합니다.
- 세션 복구 실패 시 인증 상태를 비로그인으로 정리합니다.
- 데모 로그인도 실제 서버 세션을 발급받는 계정 기준으로 동작해야 하며, 프론트 전용 가짜 세션을 별도로 유지하지 않습니다.

## API Authentication

- API 요청은 `customInstance`를 통해 수행합니다.
- 모든 요청은 `credentials: 'include'` 기준으로 쿠키를 함께 전송합니다.
- 일반 요청이 `401`을 반환하면 refresh 쿠키 기반 세션 복구를 한 번 시도합니다.
- refresh 성공 시 원래 요청을 재시도합니다.
- refresh 실패 시 클라이언트 인증 상태를 로그아웃으로 정리합니다.
- 중복 refresh 요청은 하나의 promise로 합쳐 동시에 여러 번 호출되지 않게 합니다.

관련 파일:

- `src/api/mutator/custom-instance.ts`

## Store Rules

- `useAuthStore`에는 토큰을 저장하지 않습니다.
- store에는 아래 정보만 유지합니다.
    - `sessionHydrated`
    - `isAuth`
    - `user`

## Error Handling

- 인증 만료나 refresh 실패는 조용히 무시하지 않습니다.
- 인증 복구가 불가능하면 비로그인 상태로 정리하고 보호 라우트에서 이탈시킵니다.

## File Upload

- 아바타 업로드는 `FormData`를 사용합니다.
- 파일 업로드 요청도 동일하게 `customInstance`를 통해 보내며 쿠키 기반 인증을 사용합니다.
- 업로드 토큰이나 추가 민감 정보는 클라이언트 state에 별도로 보관하지 않습니다.

관련 파일:

- `src/features/auth/avatarStorage.ts`

## Current Security Posture

- 클라이언트는 쿠키 세션 기반 설계를 전제로 동작합니다.
- 사용자 프로필은 서버 응답을 매핑한 최소 정보만 유지합니다.
- 문서 기준과 실제 구현이 어긋나면 코드 기준으로 문서를 즉시 수정합니다.
