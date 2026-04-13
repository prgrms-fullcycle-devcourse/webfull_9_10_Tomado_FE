# Log Domain

회고와 데일리로그 작성/편집/삭제 흐름을 담당하는 도메인입니다.

## Summary

- `DailyLog`와 `Retro` 페이지가 이 도메인의 주요 진입점입니다.
- 현재는 생성/수정/삭제 API가 부분적으로 연결되어 있고, 목록 조회는 아직 테스트용 로컬 배열이 남아 있습니다.
- 카드 선택 상태, 자동저장 표시, 삭제 undo 같은 기록 작성 UX를 함께 다룹니다.

## Main Parts

### `src/pages/DailyLog.tsx`

- 데일리로그 화면의 현재 구현 중심 파일입니다.
- 제목/본문 로컬 상태, 선택 날짜, 선택된 로그, autosave 상태를 함께 관리합니다.
- `useCreateDailyLog`, `useUpdateDailyLog`, `useDeleteDailyLog`를 사용해 생성/수정/삭제 API를 호출합니다.
- 목록 영역은 아직 `testLogArr` 로컬 배열을 사용합니다.
- 삭제는 즉시 서버 삭제하지 않고 토스트 undo 시간을 둔 지연 삭제 패턴을 사용합니다.
- 선택된 로그 카드는 `DailyLogCard`의 `selected` 상태로 시각적으로 강조됩니다.

### `src/pages/Retro.tsx`

- 회고 화면의 현재 구현 중심 파일입니다.
- 카테고리별 content 상태, 선택 날짜, 선택된 회고, autosave 상태를 관리합니다.
- `useCreateRetroLog`, `useUpdateRetroLog`, `useDeleteRetroLog`를 사용해 생성/수정/삭제 API를 호출합니다.
- 목록 영역은 아직 `testRetroArr` 로컬 배열을 사용합니다.
- 삭제는 선택한 템플릿 타입 단위로 지연 삭제 + 토스트 undo 패턴을 사용합니다.
- 선택된 회고 카드는 `RetroCard`의 `selected` 상태로 강조됩니다.

### `src/features/log/components/MdEditor.tsx`

- 데일리로그 본문 편집에 사용하는 마크다운 에디터입니다.

### `src/features/log/components/RetroItem.tsx`

- 선택한 회고 카테고리별 질문/텍스트 영역 렌더링을 담당합니다.

### `src/features/log/retroConstants.ts`

- 회고 카테고리 이름과 질문 폼 메타데이터를 정의합니다.

### `src/components/ui/Card.tsx`

- `DailyLogCard`, `RetroCard` 공용 카드 UI를 제공합니다.
- `default / selected / hover` 상태를 지원합니다.
- hover 시 삭제 액션 버튼을 노출합니다.

## Current Flow

1. 페이지는 선택 날짜와 현재 편집 중인 내용을 로컬 state로 관리합니다.
2. 제목/본문 또는 회고 텍스트가 바뀌면 autosave 상태를 `writing`으로 전환합니다.
3. 일정 시간 뒤 저장 또는 저장 버튼 클릭 시 생성/수정 mutation을 호출합니다.
4. 삭제는 토스트 undo 시간을 둔 뒤 실제 delete mutation을 호출합니다.
5. 선택된 기록은 카드의 `selected` 스타일과 우측 에디터의 내용으로 반영됩니다.

## Current Notes

- 목록 조회와 검색은 아직 실제 API로 전환되지 않았습니다.
- 회고 생성 후에는 목록 재조회가 없어 현재 선택 상태와 목록 동기화가 완전하지 않습니다.
- 데일리로그도 목록/검색 API가 붙기 전까지는 더미 데이터와 실제 mutation이 함께 존재합니다.
- 카드의 `selected` 상태 추가로 현재 선택된 기록을 시각적으로 더 명확히 보여줍니다.

## Follow-up

- 데일리로그 목록 조회 / 검색 API 연결
- 회고 목록 조회 / 검색 API 연결
- 생성/수정/삭제 후 목록 재조회 또는 캐시 동기화 정리
- 페이지 상태와 API 동기화 로직의 controller 훅 분리 검토
