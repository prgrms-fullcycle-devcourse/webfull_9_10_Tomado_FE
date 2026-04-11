# My 페이지 API 연동

## 목표

- My 페이지의 dummy 기반 설정/프로필 흐름을 실제 API 기준으로 전환한다.
- 프로필 수정, 설정 저장, 계정 삭제 흐름을 정리한다.

## 범위

- `src/pages/My.tsx`
- 관련 profile / settings API 호출부

## 현재 상태

- 아바타 업로드/삭제는 이미 연결되어 있다.
- 닉네임 저장은 `useUpdateMyProfile`로 연결되어 있다.
- 타이머 설정 저장과 자동 이월 토글은 `useUpdateMySettings`로 연결되어 있다.
- 프로필/설정 초기값은 `useGetMyProfile`, `useGetMySettings`로 받아온다.
- 계정 삭제는 `useDeleteMe`로 연결되어 있다.
- 설정 섹션은 `useMySettings`로 분리되어 있다.
- 프로필/계정 액션은 `useMyProfileController`로 분리되어 있다.

## 작업 단계

1. 프로필/설정 섹션의 액션 책임을 feature 훅 기준으로 유지한다.
2. query/store 동기화 규칙을 훅 단위에서 일관되게 관리한다.
3. 필요하면 UI 섹션 컴포넌트 분리 여부를 검토한다.
4. 완료 후 auth/settings 문서를 갱신한다.

## 이번 업데이트 반영 메모

- `My` 페이지는 이제 프로필/설정 조회를 서버 데이터 기준으로 초기화한다.
- 닉네임 저장 시 프로필 캐시와 auth store를 먼저 갱신해 전체 페이지 재초기화를 줄인다.
- 설정 저장과 초기화는 설정 캐시를 먼저 갱신하는 낙관적 업데이트 기준으로 동작한다.
- 설정 저장 중에는 저장/초기화 버튼과 시간 조절 버튼을 block 한다.
- 최소값 이하로 내려갈 수 없는 타이머 설정 버튼은 disabled 처리한다.
- `auto_carry_todo` 토글도 서버 mutation 기준으로 동작한다.
- 아바타 업로드/삭제 성공 시 auth store와 프로필 쿼리를 함께 갱신한다.
- 회원 탈퇴 성공 시 auth store를 로그아웃 상태로 정리하고 랜딩 페이지로 이동한다.
- 프로필 기본 아바타 상태에서는 편집 버튼 클릭 시 바로 파일 업로드를 연다.
- 커스텀 아바타 상태에서는 편집 버튼 클릭 시 `이미지 수정 / 이미지 삭제` 메뉴를 노출한다.
- `useMySettings`는 `timer / todo / meta / actions` 구조로 값을 묶어 반환한다.
- `useMyProfileController`는 `profile / avatar / account` 구조로 액션을 묶어 반환한다.

## 주요 결정 포인트

- 계정 삭제 후 라우팅과 세션 정리는 `useMyProfileController`가 담당한다.
- My 페이지는 UI 조합만 맡고, query/store 동기화와 액션 오케스트레이션은 feature 훅으로 분리한다.

## 리스크

- 프로필 메뉴와 파일 업로드 흐름이 커지면 전용 섹션 컴포넌트 분리가 다시 필요할 수 있다.
- 삭제 이후 세션 정리와 라우팅은 auth 흐름과 계속 맞물린다.

## 남은 작업

- 닉네임/프로필 섹션 컴포넌트 분리 필요성 재검토
- 설정 섹션 컴포넌트 분리 필요성 재검토

## 완료 조건

- My 페이지 주요 액션이 실제 API와 연결된다.
- 계정 삭제 이후 흐름이 명확히 정리된다.
- query/store 동기화 규칙과 controller 훅 경계가 문서화된다.
