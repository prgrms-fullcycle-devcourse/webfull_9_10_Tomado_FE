# Todo Domain

이 문서는 todo 도메인의 설계 source of truth입니다.

## Summary

- 날짜별 투두 목록 관리, 입력, 체크, 삭제, 이동, 정렬을 담당합니다.
- 현재는 Todo API와 React Query invalidate 기반으로 동작합니다.
- UI 조합은 `TodoPanel`이 중심이고, 날짜별 `sort_order` 규칙은 서버 계약을 기준으로 관리합니다.

## Current Structure

### Data / Interaction

- `useTodoList.ts`
    - 특정 날짜 기준 Todo 목록 조회
    - 입력 제한, 생성, 수정, 체크, 삭제, 날짜 이동, reorder mutation 흐름을 묶음
    - mutation 성공 후 Todo query를 invalidate 해 화면을 다시 동기화

- `types.ts`
    - 서버 Todo DTO를 프론트 Todo view model로 정규화
    - `assigned_date`, `sort_order`, `completed_at`를 프론트 표현으로 매핑

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

1. `TodoPanel`이 `useTodoList`를 사용한다.
2. `useTodoList`가 현재 날짜 기준 목록과 입력/변형 액션을 제공한다.
3. `TodoPanel`은 DnD reorder와 날짜 이동 모달 상태를 직접 관리한다.
4. 실제 Todo 변경은 Todo API mutation으로 반영한다.
5. mutation 성공 이후 Todo query를 invalidate 해서 목록을 다시 동기화한다.

## Data Rules

- Todo는 `assignedDate`별로 그룹화된다.
- 각 날짜 그룹 안에서는 `sortOrder`로 정렬된다.
- 서버 원본 필드는 `assigned_date`, `sort_order`, `completed_at`이다.
- reorder는 index가 아니라 `prev_order`, `next_order` 기준 midpoint 계산을 전제로 한다.
- 완료된 Todo는 삭제할 수 없다.
- 미완료 Todo 삭제는 toast 노출 시간 동안 지연 처리된다.

## Current Concerns

- `TodoPanel`의 입력, 정렬, 날짜 이동 모달 책임이 비교적 크다.
- 날짜 이동과 reorder 계산 로직을 더 분리할 여지가 있다.
- soft delete나 archive 정책이 없어서 delete undo가 프론트 지연 삭제에 의존한다.

## Active Plans

- [Todo 구조 개선 및 API 연동](../exec-plans/active/todo-structure-and-api.md)

## Future Direction

- TodoPanel 책임 분리
- 날짜별 order 규칙 helper 정리
- Todo API 연동 및 optimistic update 기준 정리
- soft delete 지원 여부에 따라 delete UX 단순화 검토
