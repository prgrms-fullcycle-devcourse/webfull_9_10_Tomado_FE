# Todo Domain

## Summary

- 날짜별 투두 목록 관리, 입력, 체크, 삭제, 이동, 정렬을 담당합니다.

## Main Parts

- `useTodoStore`
- `useTodoList`
- `TodoPanel`
- `TodoItem`
- `TodoMoveModal`

## Current Concerns

- 패널의 입력/정렬/날짜 이동 책임이 비교적 큽니다.
- store의 날짜별 order 규칙은 별도 문서화가 필요합니다.
