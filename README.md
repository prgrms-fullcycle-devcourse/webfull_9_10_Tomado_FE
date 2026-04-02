# Tomado Frontend

Tomado의 프론트엔드 레포지토리입니다.  
Vite + React + TypeScript 기반으로 구성되어 있으며, Todo / Daily Log / Calendar 기능을 중심으로 확장할 예정입니다.

## Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=react,ts,vite,git,github" />
</p>

## Getting Started

```bash
npm install      # 패키지 설치
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run format   # 코드 포맷팅
```

## Project Structure

```
src
├─ api          # 공통 API client
├─ assets       # 이미지, 아이콘 등 정적 리소스
├─ components   # 공용 UI / 배치 컴포넌트
├─ features     # 도메인별 기능 모듈 (auth, timer, todo ...)
├─ hooks        # 공용 커스텀 훅
├─ pages        # 페이지 단위 컴포넌트
├─ routes       # 라우트 정의와 라우트 전용 레이아웃
├─ stores       # 전역 UI 상태 (toast, modal 등)
├─ styles       # 글로벌 스타일 및 디자인 토큰
├─ utils        # 공통 유틸 함수
├─ App.tsx      # 앱 전역 조합과 RouterProvider
└─ main.tsx     # 앱 엔트리 포인트
```

## App Flow

- `main.tsx`는 엔트리만 담당합니다.
- `App.tsx`는 전역 컴포넌트와 `RouterProvider`를 조합합니다.
- `src/routes/routes.tsx`는 route tree를 정의합니다.
- `AuthLayout` / `GuestLayout`은 라우트 전용 레이아웃입니다.
- `features/*` 안의 store는 도메인 상태를 담당하고, `stores/*`는 toast / modal 같은 전역 UI 상태를 담당합니다.

## Branch Strategy

- `main` - 메인 브랜치 (배포 전용)
- `dev` - 개발 브랜치 (기능 개발용)
- `feature/*` - 기능별 브랜치
- `hotfix/*` - 급한 버그 수정용

## Convention

- 공통 코드 스타일은 ESLint / Prettier 기준을 따릅니다.
- 전역 상태 관리는 Zustand 도입을 예정하고 있습니다.
- API base URL 및 환경변수는 추후 .env 파일로 분리 관리합니다.
