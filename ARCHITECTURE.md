# Architecture

Tomado 프론트엔드는 Vite + React + TypeScript 기반의 SPA입니다.

## Layer Map

```txt
src/
├── api          # 생성 코드 포함 API 호출 레이어
├── assets       # 정적 리소스
├── components   # 공용 UI / 레이아웃 컴포넌트
├── features     # 도메인별 기능 모듈
├── hooks        # 공용 커스텀 훅
├── pages        # 라우트 페이지 조합
├── routes       # 라우트 트리와 레이아웃
├── stores       # toast, modal 같은 전역 UI 상태
├── styles       # 글로벌 스타일 및 토큰
└── utils        # 공용 유틸
```

## Core Rules

- `pages`는 얇게 유지하고, 상태와 동작은 `features`로 보냅니다.
- `features`는 도메인 책임 단위로 나눕니다.
- 공용 UI는 `components/ui` 또는 `components/layout`에 둡니다.
- 도메인 내부에서만 의미가 있는 UI는 각 `features/*/components`에 둡니다.
- 공용 훅은 `src/hooks`, 도메인 훅은 각 `features/*`에 둡니다.
- toast, modal처럼 앱 전역 UI 상태는 `src/stores`에 둡니다.
- 도메인 원본 상태는 각 feature store에서 관리합니다.

## Route Structure

- 비로그인 영역은 `GuestLayout`
- 로그인 이후 앱 공통 레이아웃은 `AuthLayout`
- `AuthLayout`은 헤더, 타이머 공통 상태, 포커스 모드, BGM 레이어를 조합합니다.

주요 라우트:

- `/main`
- `/dashboard`
- `/dailylog`
- `/retro`
- `/my`

## Domain Notes

### Timer

- 전역 원본 상태는 `useTimerStore`
- 타이머 표시용 파생 상태는 `useTimerSessionView`
- 타이머 행동은 `useTimerSessionController`
- 집중 모드 전용 상호작용은 `useFocusModeController`

### Todo

- 원본 상태는 `useTodoStore`
- 입력/목록 상호작용은 `useTodoList`
- 메인 패널 조합은 `TodoPanel`

### Settings

- 현재는 BGM 플레이어가 중심
- 전역 설정 성격의 기능을 수용하는 도메인

## Documentation Map

- 전체 문서 목차: [docs/index.md](./docs/index.md)
- 설계/도메인 문서: [docs/design-docs/index.md](./docs/design-docs/index.md)
- 계획 문서: [docs/exec-plans/index.md](./docs/exec-plans/index.md)
- 품질 기준: [docs/QUALITY_SCORE.md](./docs/QUALITY_SCORE.md), [docs/RELIABILITY.md](./docs/RELIABILITY.md)
