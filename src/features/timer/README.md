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
- `TomatoVisual`
    - 토마토 시각화 컴포넌트
- `TimerPanel`
    - 메인 화면 타이머 UI
    - 시간 문자열, 진행률, 재생/정지 액션을 props로 받아 렌더링만 담당
- `FocusMode`
    - 집중 모드 컴포넌트

## 파일별 역할

- `useTimerStore.ts`
    - 타이머의 전역 원본 상태를 저장하는 zustand store
    - `sessionType`, `remainingSeconds`, `isRunning`, `stopConfirmOpen`, `lastTickAt`, `activeSessionId`를 관리
    - 집중/휴식/장휴식 세션 상태머신과 4세션 1세트 규칙을 관리
    - 시작/일시정지/토글/tick/중단 확인 관련 액션을 제공
- `useTimerSession.ts`
    - store를 읽어서 화면에서 바로 쓰기 좋은 값으로 조합하는 도메인 훅
    - `timerParts`, `progress`, `hasStarted`, `sessionLabel` 같은 파생값을 계산
    - UI에서 쓰는 액션 이름으로 store 액션을 다시 노출
- `components/TimerTicker.tsx`
    - 전역 타이머를 실제로 진행시키는 실행기
    - 앱 루트에서 한 번만 마운트되어 1초마다 `tick()`을 호출
    - 여러 화면이 같은 타이머를 봐도 interval이 중복 생성되지 않게 함
- `components/TimerPanel.tsx`
    - 타이머 UI 전용 프리젠테이셔널 컴포넌트
    - store를 직접 읽지 않고 props만 받아 렌더링
- `components/FocusMode.tsx`
    - 전역 오버레이 집중 모드 UI
    - 배경 슬라이더, 좌우 배경 전환, TODO 접힘/펼침을 담당
    - 타이머는 `useTimerSession`을 통해 메인 화면과 같은 세션 상태를 공유
- `useFocusModeBackground.ts`
    - 집중 모드 배경 슬라이드 애니메이션 상태 관리 훅
    - 이전/다음 배경 전환과 각 배경 이미지의 slide class 계산을 담당
- `useFocusModeStore.ts`
    - 집중 모드 배경 index를 persist하는 store
    - 앱을 다시 열어도 마지막 배경 선택값을 유지

## 최근 작업 로그

### 집중 모드 구조/성능 개선

- `FocusMode` 내부의 TODO 렌더링을 `TodoPanel` 재사용 구조로 정리
    - 헤더/토글은 `FocusMode`에서 렌더링
    - 목록 본문은 `TodoPanel tone='focus'`로 렌더링
- 키보드 동작 콜백을 `useCallback`으로 안정화
    - `Esc` 종료 핸들러
    - 방향키(좌/우 배경 전환, 상/하 TODO 접힘/펼침) 핸들러

### 배경 레이어 분리

- 배경 슬라이더 애니메이션 전용 컴포넌트 `FocusModeBackgroundLayer` 추가
    - 배경 이미지(`z-0`)와 오버레이(`z-10`)를 별도 컴포넌트로 분리
    - 본문 인터랙션 레이어(`z-20`)와 분리해 배경 페인팅 책임을 명확히 함
- 기존 absolute 레이아웃 및 z-index 계층은 유지
    - 기존 배치 깨짐 없이 구조만 분리

### 배경 훅 개선 (`useFocusModeBackground`)

- 슬라이드 클래스 계산 결과를 `backgroundSlideClassNames`로 메모이징해서 반환
- 배경 전환 핸들러를 `useCallback`으로 안정화
    - `handlePrevBackground`, `handleNextBackground`
