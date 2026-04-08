# Todo 구조 개선 및 API 연동

## 목표

- 현재 local zustand 기반 Todo 구조를 정리하고 서버 연동 방향을 확정한다.
- TodoPanel 책임을 줄이고 날짜별 order 규칙을 더 명확하게 만든다.
- 목록 조회 / 생성 / 수정 / 체크 / 정렬 / 이동 API 연동 기준을 세운다.

## 범위

- `src/features/todo/components/TodoPanel.tsx`
- `src/features/todo/components/TodoItem.tsx`
- `src/features/todo/useTodoList.ts`
- `src/features/todo/useTodoStore.ts`
- `src/api/generated/todos/todos.ts`

## 현재 상태

- Todo는 현재 local zustand 기반으로 동작한다.
- 생성된 Todo API 코드는 존재하지만 feature와 연결되어 있지 않다.
- `TodoPanel`이 입력, 목록 렌더링, DnD, 날짜 이동 모달, reorder 반영까지 함께 담당한다.
- 날짜별 order 규칙은 store 내부 여러 액션에 분산되어 있다.

## 작업 단계

1. 현재 Todo 상태 구조와 서버 API 스펙을 대조한다.
2. local-first 유지 여부와 optimistic update 기준을 결정한다.
3. `TodoPanel` 책임 분리 지점을 정리한다.
4. 날짜별 order 규칙을 helper 또는 selector 성격 함수로 정리한다.
5. 서버 연동을 붙인 뒤 문서를 최신화한다.

## 주요 결정 포인트

- Todo를 store 중심으로 유지할지, server state 중심으로 재편할지
- reorder와 move 동작을 optimistic update로 처리할지
- 날짜별 order normalization 규칙을 어디에 둘지

## 리스크

- reorder / restore / move 동작이 같은 order 규칙을 공유해서 회귀 위험이 있다.
- 서버 연동 이후 local store와 서버 응답의 동기화 규칙이 흔들릴 수 있다.

## 완료 조건

- TodoPanel의 책임이 줄어든다.
- 날짜별 order 규칙이 한눈에 보이는 구조로 정리된다.
- Todo API 연동 기준과 상태 관리 방식이 문서화된다.
