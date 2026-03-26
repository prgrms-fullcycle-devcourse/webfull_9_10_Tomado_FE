# router

`router`는 애플리케이션의 페이지 이동과 접근 제어를 담당하는 모듈이다.  
라우트 정의, 인증 가드, AppShell 적용 범위를 관리한다.

---

## 라우팅 구조

본 프로젝트는 다음 기준으로 라우트를 분리한다.

1. AppShell을 사용하는 페이지
2. 인증 전용 페이지 (AppShell 미사용)

---

## 경로 정의

| 경로         | 역할                   | AppShell |
| ------------ | ---------------------- | -------- |
| `/`          | 메인 (타이머/투두)     | 포함     |
| `/dashboard` | 통계 (캘린더 / 히트맵) | 포함     |
| `/dailylog`  | 데일리 로그            | 포함     |
| `/retro`     | 회고                   | 포함     |
| `/my`        | 마이페이지             | 포함     |
| `/login`     | 로그인                 | 제외     |
| `/signup`    | 회원가입               | 제외     |

---

## 구조

```txt
app/
└─ router/
   ├─ index.tsx
   ├─ routes.tsx
   └─ ProtectedRoute.tsx
```

---

## 구성 요소

### routes.tsx

전체 라우트 정의

- route object 기반으로 구성
- AppShell 포함/제외 구분
- 페이지 매핑

### index.tsx

RouterProvider 연결

- createBrowserRouter 사용
- routes를 기반으로 라우터 생성

### ProtectedRoute.tsx

인증이 필요한 페이지 보호

- 인증 상태 확인
- 미인증 시 /login으로 리다이렉트

---

## AppShell 적용 방식

AppShell은 공통 레이아웃을 담당하며,  
라우트 정의에서 children 구조로 적용된다.

```typescript
{
  element: <AppShell />,
  children: [
    { path: '/', element: <Main /> },
    { path: '/dashboard', element: <Dashboard /> },
  ]
}
```

---

## FocusMode 처리 방식

FocusMode는 라우트가 아닌 전역 Overlay UI로 처리한다.

- 특정 URL에 종속되지 않음
- 어느 페이지에서든 진입 가능
- 기존 화면 위에 렌더링됨

---

## 설계 원칙

1. AppShell과 라우트 분리
    - 공통 레이아웃은 AppShell에서 처리
    - 라우터는 페이지 매핑에 집중
2. 인증 분기 명확화
    - 인증 필요 페이지는 ProtectedRoute로 감싼다
    - 로그인/회원가입은 별도 라우트로 분리
3. URL은 화면 단위로만 사용
    - 모달, FocusMode 등은 라우트로 만들지 않는다
    - URL은 페이지 전환에만 사용한다
4. 단순하고 예측 가능한 구조
    - 중첩 라우팅 최소화
    - 경로는 직관적으로 유지
