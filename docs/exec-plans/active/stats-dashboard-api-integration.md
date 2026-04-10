# Stats 및 Dashboard API 연동

## 목표

- Dashboard와 Stats 영역의 mock 기반 데이터를 실제 API 기반으로 전환한다.
- 요약 카드, 날짜별 상세 패널, HeatMap의 데이터 소스를 통일한다.

## 범위

- `src/pages/Dashboard.tsx`
- `src/features/stats/components/HeatMap.tsx`
- `src/api/generated/stats/stats.ts`

## 현재 상태

- Dashboard 요약 카드와 우측 상세 패널은 실제 API 기반으로 전환되기 시작했다.
- `HeatMap`은 실제 heatmap API 응답을 prop으로 받아 렌더링하도록 변경되었다.
- `Calendar`는 월별 badge API 응답을 사용한다.
- 날짜별 데일리로그 / 회고 / 투두 패널은 선택된 날짜 기준으로 동기화된다.
- 캘린더 / 히트맵 / 데일리로그 / 회고 / 투두 패널에는 로딩 스켈레톤이 적용되었다.
- 아직 집계 기준 확인과 페이지 내부 책임 분리는 더 정리할 여지가 있다.

## 작업 단계

1. 현재 Dashboard / Stats 화면별 필요한 API 데이터를 정리한다.
2. summary, detail, heatmap 데이터 흐름을 실제 API와 매핑한다.
3. 페이지 내부의 임시 훅 또는 TODO 지점을 분리한다.
4. loading / empty / error 상태를 화면에 맞게 보강한다.
5. stats 도메인 문서를 실제 구조에 맞게 보강한다.

## 주요 결정 포인트

- summary와 detail 조회를 한 화면 훅으로 묶을지 나눌지
- HeatMap 데이터 shape을 프론트에서 매핑할지 API 계약에 맞출지

## 리스크

- 날짜 이동 / 선택 상태가 여러 패널과 동시에 연결되어 있어 회귀 가능성이 있다.
- 데일리로그 404를 empty 상태로 볼지 에러 상태로 볼지 페이지별 기준이 필요하다.
- 요약 카드, 캘린더, 히트맵이 서로 다른 API를 사용해 초기 로딩 타이밍 차이가 날 수 있다.
- `stats/overview`와 `stats/heatmap-summary` 집계 기준 차이는 백엔드 확인이 필요하다.

## 완료 조건

- Dashboard / Stats 주요 화면이 실제 API 데이터를 사용한다.
- HeatMap mock 데이터가 제거된다.
- 날짜별 상세 패널과 요약 카드의 데이터 소스가 명확해진다.

## 진행 상태 메모

- `Dashboard` 요약 카드를 `stats/overview` 기준으로 전환
- `Dashboard` 최근 1년 상단 통계를 `stats/heatmap-summary` 기준으로 전환
- `Dashboard` 우측 상세 패널의 데일리로그 / 회고를 날짜별 조회 API와 연결
- `Calendar`를 월별 badge API 응답과 연결
- `HeatMap` mock 데이터 제거 및 실제 heatmap API 응답 연결
- 캘린더 / 히트맵 / 우측 상세 패널 / 투두 패널 로딩 스켈레톤 적용
