# Todo 구조 개선 및 API 연동

## 목표

- 현재 local zustand 기반 Todo 구조를 정리하고 서버 연동 방향을 확정한다.
- TodoPanel 책임을 줄이고 날짜별 order 규칙을 더 명확하게 만든다.
- 목록 조회 / 생성 / 수정 / 체크 / 정렬 / 이동 API 연동 기준을 세운다.

## 범위

- `src/features/todo/components/TodoPanel.tsx`
- `src/features/todo/components/TodoItem.tsx`
- `src/features/todo/useTodoList.ts`
- `src/features/todo/types.ts`
- `src/api/generated/todos/todos.ts`

## 현재 상태

- Todo 조회/생성/수정/완료 토글/삭제/reorder는 생성된 Todo API와 연결되기 시작했다.
- `TodoPanel`이 입력, 목록 렌더링, DnD, 날짜 이동 모달, reorder 반영까지 함께 담당한다.
- 현재 프론트 Todo shape는 서버 Todo를 view model로 정규화해서 사용한다.
- 날짜 이동과 reorder 계산은 아직 더 정리할 여지가 있다.
- 삭제는 toast undo를 위해 지연 삭제로 처리하고 있다.

## API 계약 메모

기준 문서:

- [Swagger UI](https://webfull-9-10-tomado-be.onrender.com/api-docs/)

### 조회

- `GET /api/v1/todos?date=YYYY-MM-DD`
- 특정 날짜의 Todo 목록 조회
- 응답은 `sort_order` 오름차순 기준
- 과거 날짜 조회 시 완료 Todo도 함께 포함될 수 있음

### 생성

- `POST /api/v1/todos`
- body
    - `title` required
    - `assigned_date` required
    - `description` optional
- 서버가 `sort_order`를 기존 마지막 값 + `1.0`으로 계산

### 수정

- `PATCH /api/v1/todos/{id}`
- 변경할 필드만 전송
- 수정 가능한 필드
    - `title`
    - `description`
    - `assigned_date`

### 완료 토글

- `PATCH /api/v1/todos/{id}/complete`
- body
    - `completed: boolean`
- `completed: true`면 `completed_at`이 현재 시각으로 설정
- `completed: false`면 `completed_at`이 `null`로 복구

### 삭제

- `DELETE /api/v1/todos/{id}`
- **미완료 Todo만 삭제 가능**
- 완료된 Todo는 삭제 불가
- 현재 프론트는 toast 노출 시간 동안 실제 삭제를 지연해 undo UX를 맞춘다.

### 순서 변경

- `PATCH /api/v1/todos/{id}/reorder`
- body
    - `prev_order?: number`
    - `next_order?: number`
- 서버는 midpoint 방식으로 `sort_order`를 재계산
- `prev_order >= next_order`면 validation error
- 현재 프론트의 index 기반 reorder 로직을 `sort_order` 기반으로 변경해야 함

### 서버 Todo shape

- `id: string`
- `title: string`
- `description: string | null`
- `assigned_date: string`
- `sort_order: number`
- `completed_at: string | null`
- `created_at`, `updated_at` 포함

## 작업 단계

1. `TodoPanel` 책임 분리 지점을 정리한다.
2. 날짜 이동과 reorder 계산을 helper 또는 controller 성격 함수로 정리한다.
3. optimistic update 기준을 결정한다.
4. 서버 제약을 반영해 삭제 UX와 undo 기준을 유지하고, soft delete 필요 여부를 판단한다.
5. 문서와 타입을 최신화한다.

## 내일 바로 시작할 체크리스트

1. `reorder`를 `prev_order / next_order` 기준으로 더 안전하게 정리한다.
2. 완료된 Todo 삭제 불가 제약 때문에 현재 지연 삭제 UX를 유지할지 검토한다.
3. `TodoPanel`에서 DnD / move modal / input 책임 분리 포인트를 먼저 잡는다.
4. optimistic update 적용 여부를 결정한다.

## 주요 결정 포인트

- reorder와 move 동작을 optimistic update로 처리할지
- 서버 Todo shape를 feature 전역에서 그대로 쓸지, 프론트 전용 view model을 둘지
- 완료된 Todo 삭제 불가 정책을 UI에서 어떻게 드러낼지
- soft delete나 archive 정책이 필요한지

## 리스크

- reorder / move 동작이 같은 `sort_order` 규칙을 공유해서 회귀 위험이 있다.
- soft delete가 없는 한 delete undo는 프론트 지연 삭제 구현에 의존한다.
- 현재 reorder 로직은 midpoint 계약을 따르지만 계산 책임을 더 분리할 필요가 있다.

## 완료 조건

- TodoPanel의 책임이 줄어든다.
- 날짜별 `sort_order` 규칙이 한눈에 보이는 구조로 정리된다.
- Todo API 연동 기준과 상태 관리 방식이 문서화된다.
- 서버 Todo shape와 프론트 타입 매핑 기준이 확정된다.

## 진행 상태 메모

- 서버 Todo shape 정규화 타입 추가
- `Main` Todo 카운트 API 조회 기준으로 전환
- `useTodoList`를 Todo API + React Query invalidate 기반으로 전환
- local zustand Todo store 제거
- 삭제 시 toast undo를 위한 지연 삭제 적용

## 후속 작업 메모

- 백엔드 soft delete 또는 archive 정책이 생기면 delete undo를 서버 상태 기반으로 단순화할 수 있다.
