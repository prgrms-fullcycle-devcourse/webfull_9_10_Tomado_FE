# Timer

타이머 도메인 전용 기능을 모아두는 영역입니다.

## 기준

- 타이머 의미가 강한 상태, 훅, UI만 `features/timer`에 둡니다.
- 전역 원본 상태는 store에서 관리합니다.
- 화면 표시용 파생 상태는 `useTimerSessionView`에서 조합합니다.
- 타이머 실행/중단 같은 행동은 `useTimerSessionController`에서 담당합니다.
- 집중 모드 전용 상호작용은 `useFocusModeController`에서 담당합니다.

## 현재 구조

### 상태

- `useTimerStore.ts`
    - 타이머의 전역 원본 상태를 저장하는 zustand store
    - `sessionType`, `remainingSeconds`, `isRunning`, `lastTickAt`, `activeSessionId` 등을 관리
    - 집중/휴식/장휴식 세션 전환 규칙과 세트 진행 규칙을 관리
    - `toggle`, `tick`, `confirmStop`, `setDurations` 같은 액션을 제공

- `useFocusModeStore.ts`
    - 집중 모드 배경 index를 persist하는 store
    - 마지막 배경 선택값을 유지

### 뷰 상태

- `useTimerSessionView.ts`
    - store를 읽어서 화면에서 바로 쓰기 좋은 타이머 파생 상태를 계산
    - `timerParts`, `timeLabel`, `progress`, `hasStarted`, `visualRemainingSeconds`를 제공
    - 현재는 `AuthLayout`에서 한 번 호출해 `Main`, `FocusMode`, `TimerProgressBar`에 공통 주입

- `useFocusModeBackground.ts`
    - 집중 모드 배경 슬라이드 애니메이션 상태 관리 훅
    - 이전/다음 배경 전환과 각 배경 이미지의 slide class 계산을 담당

### 행동

- `useTimerSessionController.ts`
    - 타이머 재생/중단 관련 행동 담당
    - 세션 시작/종료 API 호출과 active session id 동기화
    - 중단 확인 모달 노출

- `useFocusModeController.ts`
    - 집중 모드 전용 상호작용 담당
    - 배경 전환, 방향키 처리, TODO 접힘/펼침, 진입 토스트를 담당

### UI

- `components/TimerPanel.tsx`
    - 메인 화면 타이머 UI
    - props만 받아 렌더링하는 프리젠테이셔널 컴포넌트

- `components/TimerProgressBar.tsx`
    - 상단 진행 바 UI
    - 공통 `timerSession`을 props로 받아 진행률과 남은 시간을 표시

- `components/FocusMode.tsx`
    - 전역 오버레이 집중 모드 UI
    - 타이머 세션 표시값은 `timerSession`으로 받고, 집중 모드 전용 행동은 `useFocusModeController`로 처리

- `components/FocusModeBackgroundLayer.tsx`
    - 집중 모드 배경 이미지와 오버레이 렌더링 담당

- `components/TimerTicker.tsx`
    - 전역 타이머를 실제로 진행시키는 실행기
    - 앱 루트에서 한 번만 마운트되어 주기적으로 `tick()`을 호출

- `components/SessionIndicator.tsx`
    - 세션 진행 칸 UI
    - `tone='default' | 'focusmode'` 지원

- `components/TomatoVisual.tsx`
    - 토마토 시각화 컴포넌트

## 공통 주입 흐름

현재 타이머 화면 표시 상태는 `AuthLayout`에서 한 번 조합해서 내려줍니다.

1. `AuthLayout`에서 `useTimerSessionView()` 호출
2. 같은 레이아웃에서 `useTimerSessionController()` 호출
3. `timerSession`은:
    - `useTimerMetadata`
    - `TimerProgressBar`
    - `FocusMode`
    - `Outlet context`
      에 공통으로 사용
4. `Main`은 `useOutletContext()`로 `timerSession`과 타이머 컨트롤 핸들러를 받음
5. `FocusMode`는 props로 `timerSession`과 타이머 컨트롤 핸들러를 받음

이 구조를 통해 동일한 타이머 표시 상태를 여러 화면이 공통으로 사용합니다.

## 파일별 역할

- `types.ts`
    - 타이머 도메인 타입 정의
    - `ITimerState`, `ITimerActions`, `ITimerControllerContext`, `IFocusModeProps` 포함

- `useTimerMetadata.ts`
    - 문서 제목과 favicon을 타이머 상태에 맞춰 갱신

- `useTimerNotifications.ts`
    - 세션 완료 시 토스트 알림 처리

- `index.ts`
    - timer 도메인 public export 파일

## 최근 정리 내용

### 타이머 세션 공통 주입

- `useTimerSessionView`를 각 화면에서 따로 호출하지 않고 `AuthLayout`에서 공통으로 생성하도록 정리
- `Main`, `FocusMode`, `TimerProgressBar`, 메타데이터 갱신이 동일한 `timerSession` 기준을 사용하도록 연결

### FocusMode 책임 분리

- 타이머 표시 상태와 집중 모드 전용 상호작용 책임을 분리
- `FocusMode`는 화면 레이어 역할을 유지
- `useFocusModeController`는 배경 전환, 방향키, TODO 토글, 진입 토스트를 담당

### 세션 기준 시간 계산 정리

- 현재 세션 타입 기준 duration 계산 로직을 store selector로 통일
- view/controller/store 사이의 중복 계산을 줄임
