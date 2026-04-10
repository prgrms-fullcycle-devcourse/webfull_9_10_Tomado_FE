# Frontend

Tomado 프론트엔드의 구조 원칙과 구현 패턴을 정리합니다.

## Goal

- 페이지는 얇게 유지합니다.
- 도메인 상태와 행동은 `features`로 보냅니다.
- 공용 UI와 도메인 UI를 분리합니다.
- 동일한 규칙 계산은 한 곳으로 모읍니다.
- 에이전트와 사람이 함께 작업해도 흐름을 빠르게 파악할 수 있게 유지합니다.

## Layering

```txt
pages -> features -> components/ui, components/layout, hooks, utils
```

- `pages`
    - 라우트 페이지 조합만 담당합니다.
    - 직접 복잡한 상태/행동 로직을 가지지 않습니다.

- `routes`
    - 라우트 레이아웃과 공통 상위 조립을 담당합니다.
    - 여러 페이지가 공유할 상태/행동을 한 번 조합하는 위치입니다.

- `features`
    - 도메인 책임 단위로 상태, 훅, 도메인 UI를 둡니다.

- `components/ui`
    - 도메인 의미가 없는 공용 UI만 둡니다.

- `hooks`
    - 여러 도메인에서 공통으로 쓸 수 있는 훅을 둡니다.

- `utils`
    - 순수 계산과 공용 유틸을 둡니다.

## Feature Design

- 도메인 원본 상태는 store가 관리합니다.
- 화면 표시용 파생 상태는 view 훅에서 계산합니다.
- 도메인 행동은 controller 훅으로 분리합니다.
- 도메인 전용 컴포넌트는 `features/*/components`에 둡니다.
- 공용으로 승격할 가치가 없는 작은 추상화는 과하게 파일 분리하지 않습니다.

## State Rules

- 전역 UI 상태는 `src/stores`에서 관리합니다.
    - 예: toast, modal

- 도메인 원본 상태는 각 feature store에서 관리합니다.
    - 예: `useTimerStore`, `useAuthStore`

- 파생 상태는 가능하면 selector 또는 view 훅에서 계산합니다.
    - 같은 계산이 여러 파일에 반복되면 공통 selector/helper로 통일합니다.

## Shared Composition

- 공통 레이아웃은 공유 상태와 공유 행동을 조립하는 위치입니다.
- 여러 소비처가 같은 표시 상태를 쓴다면 상위 레이아웃에서 한 번 조합해 내려주는 방식을 우선 검토합니다.

예:

- `AuthLayout`
    - `useTimerSessionView()`를 한 번 호출
    - `timerSession`을 `Main`, `FocusMode`, `TimerProgressBar`, 메타데이터 갱신에 공통 사용

이 방식으로 동일한 표시 상태의 중복 조합을 줄입니다.

## Presentational vs Controller

- 렌더링만 담당하는 컴포넌트는 props 중심으로 유지합니다.
- 외부 상태 구독, 키보드 처리, 토스트, 모달, 배경 전환 같은 상호작용은 controller 훅으로 분리합니다.

예:

- `useTimerSessionView`
    - 타이머 표시용 파생 상태

- `useTimerSessionController`
    - 타이머 시작/중단/세션 API 연동

- `useFocusModeController`
    - 집중 모드 배경, 방향키, TODO 토글, 진입 토스트

## UI Boundaries

- 공용 버튼, 인풋, 아이콘, 메뉴는 `components/ui`
- 도메인 의미가 있는 화면 조합은 `features/*/components`
- 공용 레이아웃은 `components/layout`

판단 기준:

- 다른 도메인에서도 같은 의미로 재사용될 수 있으면 공용 UI
- 해당 도메인에서만 의미가 있으면 feature component

## Comments

- 흐름 파악에 도움이 되는 설명 주석은 `// INFO:` 형식을 사용합니다.
- 주석은 구현 나열보다 맥락 설명에 집중합니다.
- 상태 전이, 복구 로직, 외부 제약, 전역 실행기 같은 부분에 우선 사용합니다.

## Documentation

- `README.md`는 프로젝트 소개 문서로 유지합니다.
- 내부 구조와 운영 기준은 `docs/`를 source of truth로 사용합니다.
- 도메인 변경 시 대응하는 `docs/design-docs/*.md`를 함께 갱신합니다.

## Current Examples

- Timer
    - store / view / controller / focus controller 역할이 분리돼 있습니다.
    - `AuthLayout`이 공통 `timerSession` 조립 지점입니다.

- Todo
    - 현재는 `TodoPanel`의 책임이 비교적 커서 다음 리팩터링 후보입니다.
