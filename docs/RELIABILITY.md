# Reliability

이 문서는 Tomado 프론트엔드에서 상태 복구, 전역 실행기, 인증 회복, 공통 표시 상태 일관성을 어떻게 다루는지 정리합니다.

## Goal

- 새로고침 이후에도 세션과 주요 상태를 가능한 한 복구합니다.
- 같은 전역 상태를 여러 화면이 보더라도 동작 기준이 어긋나지 않게 유지합니다.
- 외부 요청 실패 시 복구 가능한 경로를 우선 제공합니다.

## Auth Session Recovery

- 인증 토큰은 프론트 저장소에 직접 두지 않습니다.
- 인증 여부는 쿠키 세션과 `GET /users/me` 결과를 기준으로 복구합니다.
- `AuthSessionBridge`가 앱 초기 로드 시 세션 복구를 수행합니다.
- 세션 복구가 끝나기 전에는 자식 렌더를 보류합니다.

관련 파일:

- `src/features/auth/AuthSessionBridge.tsx`
- `src/features/auth/useAuthStore.ts`

## API Retry And Refresh

- API 요청은 `customInstance`를 통해 수행합니다.
- 일반 요청이 `401`을 반환하면 refresh 쿠키 기반 세션 복구를 한 번 시도합니다.
- refresh 성공 시 원래 요청을 재시도합니다.
- refresh 실패 시 인증 상태를 로그아웃으로 정리합니다.
- 중복 refresh 요청은 `refreshPromise`로 하나로 묶습니다.

관련 파일:

- `src/api/mutator/custom-instance.ts`

## Timer Runtime Reliability

- 타이머 원본 상태는 `useTimerStore`가 단일 source of truth입니다.
- 실제 시간 진행은 `TimerTicker`가 전역에서 한 번만 수행합니다.
- ticker는 `requestAnimationFrame` 대신 `setInterval` 기반으로 동작해 백그라운드 탭에서도 멈춤 영향을 줄입니다.
- 감소량은 호출 주기가 아니라 `lastTickAt` 기준 경과 시간으로 계산합니다.

관련 파일:

- `src/features/timer/useTimerStore.ts`
- `src/features/timer/components/TimerTicker.tsx`

## Shared Timer Session View

- 타이머 표시용 파생 상태는 `useTimerSessionView`에서 계산합니다.
- 현재는 `AuthLayout`에서 한 번 조합한 `timerSession`을 공통으로 사용합니다.
- `Main`, `FocusMode`, `TimerProgressBar`, `useTimerMetadata`가 동일한 표시 기준을 공유합니다.
- 이를 통해 화면별 중복 조합과 표시 기준 불일치를 줄입니다.

관련 파일:

- `src/routes/AuthLayout.tsx`
- `src/features/timer/useTimerSessionView.ts`
- `src/features/timer/components/FocusMode.tsx`
- `src/features/timer/components/TimerProgressBar.tsx`

## Persisted UI State

- 집중 모드 배경 index는 persist store로 유지합니다.
- 앱을 다시 열어도 마지막 배경 선택 상태를 복구합니다.

관련 파일:

- `src/features/timer/useFocusModeStore.ts`

## Recovery Principles

- 원본 상태와 표시 상태를 분리합니다.
- 같은 전역 상태를 여러 소비처가 쓸 때는 공통 상위에서 조합하는 방식을 우선 검토합니다.
- 복구/재시도 로직은 가능한 한 한 군데로 모읍니다.
- 세션 만료, 새로고침, 백그라운드 탭 같은 현실적인 사용 조건을 먼저 고려합니다.
