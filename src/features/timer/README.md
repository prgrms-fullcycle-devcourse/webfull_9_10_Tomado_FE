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
- `FocusMode`
    - 집중 모드 컴포넌트

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
