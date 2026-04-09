# Tomado Frontend

Tomado는 포모도로 타이머, 집중 모드, Todo, Daily Log, Dashboard를 하나의 흐름으로 연결한 생산성 웹 애플리케이션입니다.  
이 저장소는 Tomado 프론트엔드 구현을 담고 있으며, 사용자에게는 "집중 시작부터 기록 회고까지 이어지는 루틴 경험"을 제공하고, 개발 관점에서는 도메인 중심 구조와 상태 분리를 바탕으로 확장 가능한 프론트엔드 아키텍처를 목표로 했습니다.

## Links

- 서비스: [tomado-dev.vercel.app](https://tomado-dev.vercel.app/)
- Swagger UI: [webfull-9-10-tomado-be.onrender.com/api-docs](https://webfull-9-10-tomado-be.onrender.com/api-docs/)
- 백엔드 레포지토리: [webfull_9_10_Tomado_BE](https://github.com/prgrms-fullcycle-devcourse/webfull_9_10_Tomado_BE)

## What We Built

- 포모도로 타이머와 세션 전환 흐름
- 전체 화면 기반 Focus Mode
- 날짜 기반 Todo 입력, 정렬, 이동
- Daily Log 작성 및 회고 흐름
- Dashboard / Stats 시각화 기반 기록 확인
- BGM 플레이어와 설정 기반 사용자 경험 확장

## Frontend Highlights

- `React 19 + TypeScript + Vite` 기반으로 빠른 개발 경험과 타입 안정성을 확보했습니다.
- `Zustand`로 도메인 원본 상태를 관리하고, view/controller 훅 분리로 화면 파생 상태와 행동 로직을 나눴습니다.
- `React Router`의 layout 구조를 활용해 인증 흐름과 공통 상태 조합을 관리했습니다.
- `React Query`와 생성 API 클라이언트(`orval`)를 기반으로 서버 연동 구조를 준비했습니다.
- `dnd-kit`으로 Todo 정렬 경험을 구현했습니다.
- `Supabase Storage`를 활용해 BGM / 이미지 에셋 로딩 구조를 확장했습니다.
- `Tailwind CSS v4` 기반으로 디자인 토큰과 컴포넌트 스타일을 구성했습니다.

## Engineering Focus

이 프로젝트는 단순 페이지 조합보다, 도메인 단위로 책임을 분리하는 데 초점을 맞췄습니다.

- `features/*` 중심 구조
    - 인증, 타이머, 투두, 설정, 통계 등 도메인별로 상태와 UI를 분리
- store / view / controller 분리
    - 예: 타이머는 원본 상태(`useTimerStore`), 표시 파생 상태(`useTimerSessionView`), 행동(`useTimerSessionController`)으로 분리
- shared composition
    - 공통 레이아웃(`AuthLayout`)에서 공유 상태를 한 번 조합하고 여러 화면에 주입
- 문서화
    - `docs/` 아래에 설계 문서, 제품 스펙, 실행 계획 문서를 구조화

## Core Screens

- `Landing / Login / Signup`
    - 인증 진입과 사용자 온보딩
- `Main`
    - 오늘의 타이머 흐름과 Todo를 함께 다루는 메인 집중 화면
- `Focus Mode`
    - 타이머와 TODO를 최소 UI로 유지하는 전용 몰입 화면
- `Daily Log / Retro`
    - 하루 기록과 회고 작성
- `Dashboard / My`
    - 기록 요약, 설정, 사용자 프로필 관리

## Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,git,github" alt="React TypeScript Vite Tailwind Git GitHub" />
</p>

### Main Libraries

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Zustand
- TanStack Query
- React Router
- dnd-kit
- Supabase
- Orval

## Project Structure

```txt
src
├─ api          # API client, generated clients, request layer
├─ assets       # 이미지, 오디오, 아이콘 등 정적 리소스
├─ components   # 공용 UI / layout 컴포넌트
├─ features     # 도메인별 기능 모듈
├─ hooks        # 공용 커스텀 훅
├─ pages        # 라우트 페이지 조합
├─ routes       # route tree와 layout
├─ stores       # toast, modal 등 전역 UI 상태
├─ styles       # 글로벌 스타일과 토큰
├─ utils        # 공용 유틸 함수
└─ main.tsx     # 앱 엔트리
```

## Team

### Frontend

- <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="16" /> [@nogglee](https://github.com/nogglee)
- <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="16" /> [@TeemoGB](https://github.com/TeemoGB)

### Backend

- <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="16" /> [@taesongxxxx](https://github.com/taesongxxxx)
- <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="16" /> [@sandricks0592](https://github.com/sandricks0592)
- <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="16" /> [@chocofanta01](https://github.com/chocofanta01)

## Local Development

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Documentation

- 구조 개요: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 프론트엔드 원칙: [docs/FRONTEND.md](./docs/FRONTEND.md)
- 설계 문서: [docs/design-docs/index.md](./docs/design-docs/index.md)
- 제품 스펙: [docs/product-specs/index.md](./docs/product-specs/index.md)
