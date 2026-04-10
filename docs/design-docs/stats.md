# Stats Domain

이 문서는 stats 도메인의 설계 source of truth입니다.

## Summary

- 누적 통계, 달력 배지, 최근 1년 히트맵, 대시보드 요약 패널을 담당합니다.
- 현재는 `Dashboard` 페이지가 stats / daily-log / retro-log 조회를 함께 조합합니다.
- 날짜 선택 상태는 `Dashboard`가 소유하고, 상세 패널과 시각화 컴포넌트가 이를 공유합니다.

## Current Structure

### Data / Interaction

- `src/pages/Dashboard.tsx`
    - 누적 통계, 최근 1년 요약, 날짜별 데일리로그 / 회고 / TodoPanel을 조합
    - `selectedDate`를 기준으로 우측 패널 내용을 동기화

- `src/api/generated/stats/stats.ts`
    - `stats/overview`
    - `stats/calendar`
    - `stats/heatmap`
    - `stats/heatmap-summary`

- `src/api/generated/daily-logs/daily-logs.ts`
    - 선택 날짜 기준 데일리로그 조회

- `src/api/generated/retro-logs/retro-logs.ts`
    - 선택 날짜 기준 회고 목록 조회

### UI

- `components/Calendar.tsx`
    - 월별 날짜 그리드 렌더링
    - badge 데이터는 `DailyFocusStat[]`를 prop으로 받음
    - 월별 badge 조회 중에는 캘린더 스켈레톤을 먼저 렌더링

- `components/HeatMap.tsx`
    - 최근 1년 집중 기록 시각화
    - heatmap 데이터는 `DailyFocusStat[]`를 prop으로 받음
    - heatmap 조회 중에는 셀 스켈레톤을 먼저 렌더링

## Current Flow

1. `Dashboard`가 `selectedDate`를 소유한다.
2. overview / calendar / heatmap / heatmap-summary는 stats API에서 조회한다.
3. 우측 상세 패널의 데일리로그 / 회고 / TodoPanel은 동일한 `selectedDate`를 기준으로 동작한다.
4. `Calendar`, `HeatMap`은 선택 이벤트를 `Dashboard`로 올리고, `Dashboard`가 다시 상세 패널에 반영한다.

## Current Concerns

- `Dashboard`가 아직 조합 책임이 크다.
- 날짜별 데일리로그 404를 empty로 볼지 error로 볼지 기준이 명확히 문서화되진 않았다.
- 초기 로딩 시 stats / daily-log / retro-log 응답 타이밍이 달라 보일 수 있다.
- overview와 heatmap-summary 집계 기준 차이는 백엔드 계약 확인이 필요하다.

## Active Plans

- [Stats 및 Dashboard API 연동](../exec-plans/active/stats-dashboard-api-integration.md)

## Future Direction

- `Dashboard` 데이터 조합 훅 분리
- summary / detail / visualization 로딩 상태 정리
- stats 도메인 문서와 product spec 보강
