# AGENTS

이 파일은 레포 전체 설명서가 아니라, 에이전트와 작업자가 먼저 읽는 짧은 진입점입니다.

## Start Here

1. 프로젝트 소개와 실행 방법은 [README.md](./README.md)를 확인합니다.
2. 코드베이스 구조와 레이어 규칙은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 확인합니다.
3. 상세 내부 문서는 [docs/index.md](./docs/index.md)를 시작점으로 사용합니다.

## Source Of Truth

- 제품/기능 구조: [docs/product-specs/index.md](./docs/product-specs/index.md)
- 설계/도메인 문서: [docs/design-docs/index.md](./docs/design-docs/index.md)
- 진행 중 작업/기술부채: [docs/exec-plans/index.md](./docs/exec-plans/index.md)
- 팀 규칙/참고 문서: [docs/references/index.md](./docs/references/index.md)
- 품질 기준: [docs/QUALITY_SCORE.md](./docs/QUALITY_SCORE.md), [docs/RELIABILITY.md](./docs/RELIABILITY.md)

## Working Rules

- 루트 `README.md`는 외부/프로젝트 소개 문서로 유지합니다.
- 내부 운영 문서는 `docs/`를 source of truth로 사용합니다.
- 문서가 코드와 어긋나면 코드를 기준으로 문서를 함께 수정합니다.
- 하나의 거대한 설명 문서 대신 도메인별 문서로 쪼갭니다.
- 작업 계획은 가능한 한 `docs/plans/active/` 아래 버전 관리합니다.

## Domain Map

- `src/features/auth` 인증
- `src/features/log` 회고/기록
- `src/features/settings` 전역 설정과 BGM
- `src/features/stats` 통계
- `src/features/timer` 타이머와 집중 모드
- `src/features/todo` 투두 관리

## When You Change Code

- 도메인 구조가 바뀌면 대응하는 `docs/domains/*.md`를 업데이트합니다.
- 도메인 구조가 바뀌면 대응하는 `docs/design-docs/*.md`를 업데이트합니다.
- 공통 레이어 규칙이 바뀌면 `ARCHITECTURE.md`를 업데이트합니다.
- 진행 중 리팩터링이면 `docs/exec-plans/active/`에 기록합니다.

## Keep It Small

- 이 파일에는 긴 구현 설명을 넣지 않습니다.
- 자세한 설명은 링크로만 연결합니다.
