# Timer

타이머 도메인 전용 기능을 모아두는 영역입니다.

## 기준

- 타이머 의미가 강한 요소만 `features/timer`에 둡니다.
- 공용으로 쓸 수 있는 요소는 `src/components/ui`를 재사용합니다.
- 작은 도메인 컴포넌트는 과하게 분리하지 않고 단일 파일로 관리합니다.

## 현재 컴포넌트

- `SessionIndicator`
    - 포모도로 세션 진행 칸 UI
    - `tone='default' | 'focusmode'` 지원

## 공용 UI 재사용

- `Button`
- `Badge`
- `SectionHeader`
- `Modal`

위 요소들은 타이머 전용 컴포넌트로 다시 만들지 않고 공용 UI를 사용합니다.

## 타입 정리 기준

- 컴포넌트 전용 props 타입은 컴포넌트 파일 안에 둡니다.
- 여러 컴포넌트/훅에서 같이 쓰는 도메인 타입만 `types` 폴더에 둡니다.

## 메모

- `TimerDisplay` 같은 단순 텍스트 UI는 아직 분리하지 않았습니다.
- 상태 로직이 커지면 `hooks`, `api`, `types`를 같이 확장합니다.
