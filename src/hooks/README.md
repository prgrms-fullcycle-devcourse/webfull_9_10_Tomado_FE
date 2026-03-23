# hooks

`hooks`는 React 컴포넌트에서 반복적으로 사용하는 **상태 기반 로직**과 **이벤트 흐름**을 재사용하기 위해 관리하는 폴더이다.

이 폴더는 단순 유틸리티 함수 모음이 아니라,  
**React의 상태(state), 효과(effect), 전역 store, 이벤트 처리**를 조합한 로직을 담는다.

---

## 역할

`hooks`는 아래와 같은 역할을 담당한다.

- 전역 상태(store) 사용 로직 캡슐화
- 반복되는 UI 동작 추상화
- 이벤트 처리 로직 재사용
- 상태 + 로직 + 액션 조합 제공

---

## utils와의 차이

| 구분                    | hooks               | utils              |
| ----------------------- | ------------------- | ------------------ |
| React 의존성            | 있음                | 없음               |
| state 사용              | 가능                | 불가               |
| useEffect/useState 사용 | 가능                | 불가               |
| 역할                    | 상태 기반 로직      | 순수 함수/계산     |
| 사용 위치               | React 컴포넌트 내부 | 어디서든 사용 가능 |

---

## store와의 차이

| 구분 | hooks                         | store                         |
| ---- | ----------------------------- | ----------------------------- |
| 역할 | 상태를 사용하는 로직          | 상태를 저장하는 공간          |
| 책임 | 조작/흐름/조합                | 값 보관                       |
| 예시 | `useTimer`, `useSelectedDate` | `selectedDate`, `timerStatus` |

---

## hook 예시

### useSelectedDate

- 선택 날짜 조회
- 이전/다음 날짜 이동
- 오늘 날짜 이동

### useFocusMode

- 포커스모드 진입/종료
- ESC 종료 처리
- 전역 오버레이 제어

### useTimer

- 타이머 시작/일시정지/종료
- 남은 시간 계산
- 진행률(progress) 계산

### usePlayback

- 배경음악 재생/일시정지
- 트랙 전환
- 볼륨 조절

### useDebounce

- 자동 저장
- 검색 입력 지연 처리

### useKeyboardShortcut

- 단축키 등록
- F 키 검색 포커스
- ESC 키 포커스모드 종료

---

## 작성 원칙

1. React 종속 로직만 넣는다

- useState, useEffect, 전역 store 접근 등
- React와 연결된 로직만 hooks에 둔다.

2. 순수 계산은 utils로 분리한다

- 날짜 계산, 문자열 포맷, progress stage 계산 등은 utils로 분리한다.

3. UI 렌더링은 포함하지 않는다

- hook은 상태와 로직만 반환하고, UI는 컴포넌트가 담당한다.

4. 하나의 hook은 하나의 책임을 가진다

- 예: useTimer 안에 배경음악 로직까지 넣지 않는다.

5. 공용 hook만 루트에 둔다

- 여러 도메인에서 재사용 가능한 hook만 src/hooks에 둔다.
- 특정 도메인에 강하게 묶이는 hook은 추후 features/.../hooks로 분리한다.

---

## 사용 예시

```tsx
const { selectedDate, goPrevDate, goNextDate } = useSelectedDate();
const { isFocusMode, openFocusMode, closeFocusMode } = useFocusMode();
const { progress, startTimer, pauseTimer } = useTimer();

// 컴포넌트는 hook을 통해 필요한 상태와 동작만 받아서 렌더링한다.
```
