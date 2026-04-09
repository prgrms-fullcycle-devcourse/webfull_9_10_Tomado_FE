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
- 현재 프론트 Todo shape는 `{ id: number; label; checked; assignedDate; order }` 기준이지만, 서버 Todo는 `title`, `description`, `assigned_date`, `sort_order`, `completed_at` 기준으로 동작한다.

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
- 현재 프론트의 delete + undo UX는 이 제약을 반영해 다시 설계해야 함

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

1. 프론트 Todo 타입을 서버 Todo shape 기준으로 다시 정의한다.
2. 현재 `label / checked / assignedDate / order` 기반 로컬 로직을 `title / completed_at / assigned_date / sort_order` 기준으로 치환한다.
3. local-first 유지 여부와 optimistic update 기준을 결정한다.
4. `TodoPanel` 책임 분리 지점을 정리한다.
5. 날짜별 order 규칙을 helper 또는 selector 성격 함수로 정리한다.
6. 조회 / 생성 / 수정 / 완료 토글 / 삭제 / reorder 순서로 API 연동을 붙인다.
7. 서버 제약을 반영해 삭제 UX와 undo 기준을 재검토한다.
8. 문서와 타입을 최신화한다.

## 내일 바로 시작할 체크리스트

1. `Todo` 타입을 서버 응답 shape 기준으로 새로 정의한다.
2. 프론트 내부 필드명 매핑 전략을 정한다.
    - 완전 서버 shape로 통일할지
    - UI layer에서만 alias를 둘지
3. `useTodoStore`를 계속 원본 상태 store로 둘지, React Query 기반으로 축소할지 결정한다.
4. `reorder`를 index 기반이 아니라 `prev_order / next_order` 기준으로 재설계한다.
5. 완료된 Todo 삭제 불가 제약 때문에 현재 delete + undo UX를 유지할지 수정할지 결정한다.
6. `TodoPanel`에서 DnD / move modal / input 책임 분리 포인트를 먼저 잡는다.

## 주요 결정 포인트

- Todo를 store 중심으로 유지할지, server state 중심으로 재편할지
- reorder와 move 동작을 optimistic update로 처리할지
- 날짜별 order normalization 규칙을 어디에 둘지
- 서버 Todo shape를 feature 전역에서 그대로 쓸지, 프론트 전용 view model을 둘지
- 완료된 Todo 삭제 불가 정책을 UI에서 어떻게 드러낼지

## 리스크

- reorder / restore / move 동작이 같은 order 규칙을 공유해서 회귀 위험이 있다.
- 서버 연동 이후 local store와 서버 응답의 동기화 규칙이 흔들릴 수 있다.
- 현재 delete undo 흐름은 서버 삭제 정책과 정면으로 충돌할 수 있다.
- 현재 reorder 로직은 `sort_order` midpoint 계약과 다르다.

## 완료 조건

- TodoPanel의 책임이 줄어든다.
- 날짜별 order 규칙이 한눈에 보이는 구조로 정리된다.
- Todo API 연동 기준과 상태 관리 방식이 문서화된다.
- 서버 Todo shape와 프론트 타입 매핑 기준이 확정된다.
