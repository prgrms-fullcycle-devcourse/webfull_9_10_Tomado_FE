# Tomado Frontend

Tomado의 프론트엔드 레포지토리입니다.  
Vite + React + TypeScript 기반으로 구성되어 있으며, Todo / Daily Log / Calendar 기능을 중심으로 확장할 예정입니다.

## Tech Stack

- Vite
- React
- TypeScript

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
├─ api          # API 통신 관련 모듈
├─ assets       # 이미지, 아이콘 등 정적 리소스
├─ components   # 재사용 가능한 UI 컴포넌트
├─ layouts      # 공통 레이아웃
├─ pages        # 페이지 단위 컴포넌트
├─ router       # 라우팅 설정
├─ store        # 전역 상태 관리
├─ styles       # 글로벌 스타일 및 디자인 토큰
├─ utils        # 공통 유틸 함수
├─ App.tsx
└─ main.tsx
```

## Branch Strategy

- `main` - 메인 브랜치 (배포 전용)
- `dev` - 개발 브랜치 (기능 개발용)
- `feature/*` - 기능별 브랜치
- `hotfix/*` - 급한 버그 수정용

## Convention

- 공통 코드 스타일은 ESLint / Prettier 기준을 따릅니다.
- 전역 상태 관리는 Zustand 도입을 예정하고 있습니다.
- API base URL 및 환경변수는 추후 .env 파일로 분리 관리합니다.
