# Auth Domain

## Summary

- 인증 상태, 세션 복구, 로그인/회원가입 폼 로직, 사용자 정보 매핑을 담당합니다.
- 토큰은 프론트 저장소에 직접 두지 않고 httpOnly 쿠키 기반 세션을 전제로 동작합니다.

## Main Parts

- `useAuthStore.ts`
    - 인증 원본 상태를 저장하는 zustand store
    - `sessionHydrated`, `isAuth`, `user`를 관리
    - `login`, `logout`, `updateUser`, `setSessionHydrated` 액션 제공

- `AuthSessionBridge.tsx`
    - 앱 시작 시 `GET /users/me`로 세션 복구
    - 쿠키 세션을 기준으로 store를 복원
    - 복구 전까지는 자식 렌더를 보류

- `useLoginForm.ts`
    - 로그인 입력 상태, 유효성, 제출 동작 담당
    - 일반 로그인과 데모 로그인 흐름 포함
    - 데모 로그인도 환경변수에 저장된 계정으로 실제 로그인 API를 호출

- `useSignupForm.ts`
    - 회원가입 입력 상태와 필드 검증 담당
    - payload 변환 전의 폼 로직에 집중

- `api.ts`
    - 로그인/회원가입/프로필 응답을 `AuthUser`로 매핑

- `avatarStorage.ts`
    - 사용자 아바타 업로드/삭제 관련 유틸

- `useMyProfileController.ts`
    - `My` 페이지의 프로필/계정 액션 오케스트레이션 담당
    - 닉네임 저장, 아바타 업로드/삭제, 회원탈퇴, 프로필 메뉴 상태를 묶어 처리

## Route Flow

- `GuestLayout`
    - `isAuth`가 true면 `/main`으로 리다이렉트

- `AuthLayout`
    - `isAuth`가 false면 `/`로 리다이렉트
    - 로그인 이후 공통 레이아웃 역할 수행
    - 프로필과 설정 데이터를 받아 store/도메인 상태에 반영

## Session Strategy

- access token / refresh token은 JS 메모리나 localStorage에 직접 두지 않음
- 인증 여부는 서버 쿠키 세션과 `GET /users/me` 결과로 복구
- 프론트는 store에 `AuthUser`와 인증 여부만 유지

## Current Notes

- 데모 로그인은 프론트에서 별도 user를 주입하지 않습니다.
- `VITE_DEMO_LOGIN_ID`, `VITE_DEMO_LOGIN_PASSWORD`가 설정되면 해당 계정으로 실제 로그인 API를 호출합니다.
- 프로필 최신화는 `AuthLayout`에서 `useGetMyProfile` 결과를 받아 `updateUser`로 반영합니다.
- `My` 페이지의 프로필/계정 영역은 `useMyProfileController`가 담당합니다.
- 닉네임 저장은 프로필 캐시와 auth store를 먼저 갱신하는 낙관적 업데이트 기준으로 동작합니다.
- 회원 탈퇴 성공 시 로그아웃 후 랜딩 페이지로 이동합니다.
- 아바타 업로드/삭제 성공 시 auth store와 프로필 조회 캐시를 함께 갱신합니다.
- 로그아웃, 회원탈퇴, 세션 복구 실패 같은 인증 종료 경로에서는 BGM 재생도 함께 정리합니다.
