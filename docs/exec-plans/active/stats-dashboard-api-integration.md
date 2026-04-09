# Stats 및 Dashboard API 연동

## 목표

- Dashboard와 Stats 영역의 mock 기반 데이터를 실제 API 기반으로 전환한다.
- 요약 카드, 날짜별 상세 패널, HeatMap의 데이터 소스를 통일한다.

## 범위

- `src/pages/Dashboard.tsx`
- `src/features/stats/components/HeatMap.tsx`
- `src/api/generated/stats/stats.ts`

## 현재 상태

- Dashboard는 mock 데이터와 뷰 조합이 함께 섞여 있다.
- `HeatMap`은 실제 API 대신 임시 데이터에 의존한다.
- 날짜별 상세 흐름과 요약 카드 흐름이 페이지 내부에 함께 얽혀 있다.

## 작업 단계

1. 현재 Dashboard / Stats 화면별 필요한 API 데이터를 정리한다.
2. summary, detail, heatmap 데이터 흐름을 실제 API와 매핑한다.
3. 페이지 내부의 임시 훅 또는 TODO 지점을 분리한다.
4. mock 데이터를 제거하고 실제 응답 기준으로 상태를 맞춘다.
5. stats 도메인 문서를 실제 구조에 맞게 보강한다.

## 주요 결정 포인트

- summary와 detail 조회를 한 화면 훅으로 묶을지 나눌지
- HeatMap 데이터 shape을 프론트에서 매핑할지 API 계약에 맞출지

## 리스크

- mock 제거 과정에서 대시보드 UI의 기대 shape가 달라질 수 있다.
- 날짜 이동 / 선택 상태가 여러 패널과 동시에 연결되어 있어 회귀 가능성이 있다.

## 완료 조건

- Dashboard / Stats 주요 화면이 실제 API 데이터를 사용한다.
- HeatMap mock 데이터가 제거된다.
- 날짜별 상세 패널과 요약 카드의 데이터 소스가 명확해진다.
