# Todo Domain

이 문서는 todo 도메인의 설계 source of truth입니다.

## Summary

- 날짜별 투두 목록 관리, 입력, 체크, 삭제, 이동, 정렬을 담당합니다.
- 현재는 local zustand store 기반으로 동작합니다.
- UI 조합은 `TodoPanel`이 중심이고, 날짜별 order 규칙은 store 액션에서 관리합니다.

## Current Structure

### State

- `useTodoStore.ts`
    - Todo 원본 상태를 zustand로 관리
    - `todos` 배열과 `addTodo`, `updateTodoLabel`, `updateTodoChecked`, `moveTodoDate`, `reorderTodos`, `removeTodo`, `restoreTodo` 액션 제공
    - 날짜별 order 규칙 normalization을 내부 helper로 유지

### View / Interaction

- `useTodoList.ts`
    - 특정 날짜 기준으로 보일 Todo 목록을 계산
    - 입력 제한, 입력값 상태, 추가/삭제/복구 흐름을 묶음
    - 삭제 후 undo toast까지 포함한 UI 친화적 액션을 제공

### UI

- `components/TodoPanel.tsx`
    - Todo 입력, 목록 렌더링, DnD 정렬, 날짜 이동 모달 연결을 담당
    - 현재는 입력/정렬/날짜 이동 책임이 함께 모여 있는 중심 컴포넌트

- `components/TodoItem.tsx`
    - 개별 Todo 항목 렌더링
    - 체크, 라벨 수정, more action, drag handle 표현을 담당

- `components/TodoInput.tsx`
    - Todo 입력 UI

- `components/TodoMoveModal.tsx`
    - 특정 Todo를 다른 날짜로 이동시키는 모달 UI

## Current Flow

1. `TodoPanel`이 `useTodoList`와 `useTodoStore`를 함께 사용한다.
2. `useTodoList`가 현재 날짜 기준 목록과 입력/삭제 관련 액션을 제공한다.
3. `TodoPanel`은 DnD reorder와 날짜 이동 모달 상태를 직접 관리한다.
4. 실제 Todo 원본 상태 변경은 `useTodoStore` 액션으로 처리한다.
5. 삭제 시에는 store에서 제거한 뒤 toast undo를 통해 `restoreTodo`를 호출할 수 있다.

## Data Rules

- Todo는 `assignedDate`별로 그룹화된다.
- 각 날짜 그룹 안에서 `order`로 정렬된다.
- `moveTodoDate`, `reorderTodos`, `restoreTodo`, `removeTodo`는 모두 날짜별 order 규칙과 연결된다.
- 현재 날짜별 order normalization은 `normalizeOrdersForDate` helper가 담당한다.

## Current Concerns

- `TodoPanel`의 입력, 정렬, 날짜 이동 모달 책임이 비교적 크다.
- 날짜별 order 규칙이 store 내부 여러 액션에 분산되어 있다.
- 생성된 Todo API 코드는 존재하지만 현재 feature는 local 상태 중심이다.

## Active Plans

- [Todo 구조 개선 및 API 연동](../exec-plans/active/todo-structure-and-api.md)

## Future Direction

- TodoPanel 책임 분리
- 날짜별 order 규칙 helper 정리
- Todo API 연동 및 optimistic update 기준 확정
