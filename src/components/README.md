# components

`components`는 애플리케이션 전반에서 재사용되는 UI와 구조를 관리하는 폴더이다.  
이 폴더는 역할에 따라 `ui`, `layout`, `overlays`로 분리된다.

## 구조

```txt
components/
├─ ui/
├─ layout/
└─ overlays/
```

---

## 역할 정의

### ui

재사용 가능한 순수 UI 컴포넌트

- 디자인 시스템 성격
- 비즈니스 로직 없음
- props 기반으로 동작

예시:

- Button
- Input

### layout

페이지의 구조와 배치를 담당하는 컴포넌트

- AppShell (앱 전체 구조)
- Header (전역 상단 바)
- Container (페이지 wrapper)
- SplitLayout (좌/우 레이아웃)
- DashboardLayout (대시보드 전용 구조)

### overlays

화면 위에 덮이는 전역 UI

- 특정 페이지에 종속되지 않음
- AppShell 위에서 렌더링됨

예시:

- FocusMode
- Modal
- Toast

---

## 분류 기준

컴포넌트를 어디에 둘지 고민될 때는 아래 기준을 따른다.

### ui에 넣는 경우

- 여러 페이지에서 재사용 가능한가?
- 단순 표현 컴포넌트인가?

### layout

- 페이지 구조를 결정하는가?
- children을 받아 배치를 하는가?

### overlays

- 화면 전체를 덮는가?
- 특정 페이지가 아니라 전역에서 사용되는가?

---

## 설계 원칙

1. 역할 분리

- UI / Layout / Overlay는 혼합하지 않는다.

2. 단일 책임

- 하나의 컴포넌트는 하나의 역할만 가진다.

3. 재사용성

- ui 컴포넌트는 가능한 범용적으로 설계한다.

4. 의존성 방향

- pages → features → components
- components는 상위 레이어를 참조하지 않는다.

예시:

```tsx
<PageContainer>
    <SplitLayout left={<LogList />} right={<LogEditor />} />
</PageContainer>
```

- PageContainer → layout
- SplitLayout → layout
- LogList / LogEditor → features
