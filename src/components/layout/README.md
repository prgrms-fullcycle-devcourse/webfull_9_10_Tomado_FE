# Layout Components

페이지 골조를 빠르게 조합하기 위한 레이아웃 레이어입니다.

import 방식은 아래와 같습니다.

```tsx
import {
    AppShell,
    Container,
    Header,
    GuestHeader,
    DefaultHeader,
    CenteredLayout,
    DoubleColumnLayout,
    SidebarContentLayout,
    SectionHeader,
} from '@@/layout';
```

## Container

모든 본문 페이지의 시작점입니다. 헤더 아래 컨텐츠를 동일 폭으로 정렬합니다.

```tsx
<Container as='main'>
    <h1>Page Title</h1>
</Container>
```

핵심 규칙:

- 바깥: `mx-auto w-full px-5`
- 안쪽: `max-w-[1200px]`, `min-h-[calc(100vh-60px)]`
- 페이지 본문은 기본적으로 `Container`부터 사용

## AppShell

전역 shell. 헤더 variant를 고르고, 라우트 컨텐츠(`Outlet`)를 렌더링합니다.

```tsx
<AppShell headerVariant='default' />
<AppShell headerVariant='guest' />
```

핵심 props:

- `headerVariant?: 'default' | 'guest'`

## Header

헤더 shell + variant 묶음입니다.
실사용은 대부분 `DefaultHeader`, `GuestHeader`로 시작하면 됩니다.

```tsx
<GuestHeader signupHref='/signup' loginHref='/login' brandHref='/brandcenter' />

<DefaultHeader
    navItems={[
        { label: '데일리로그', href: '/dailylog', active: true },
        { label: '회고', href: '/retro' },
        { label: '대시보드', href: '/dashboard' },
    ]}
    onMusicClick={() => {}}
    onFocusModeClick={() => {}}
/>
```

`Header` 직접 사용 예시:

```tsx
<Header leftSlot={<Logo />} centerSlot={<Nav />} rightSlot={<Actions />} />
```

## CenteredLayout

중앙 정렬 + 세로 스택 레이아웃. 로그인/회원가입/설정처럼 단일 컬럼 화면용.

```tsx
<Container>
    <CenteredLayout gap='32px' maxWidth='960px'>
        <section>계정 관리</section>
        <section>설정</section>
    </CenteredLayout>
</Container>
```

핵심 props:

- `maxWidth?: string`
- `gap?: string`

## DoubleColumnLayout

좌/우 2컬럼 배치 전용 그리드. 패널 스타일(배경/모서리/높이)은 페이지에서 정의.

```tsx
<Container>
    <SectionHeader title='2026. 03. 18' type='main' />
    <DoubleColumnLayout>
        <section className='rounded-2xl bg-white'>Left</section>
        <section className='rounded-2xl bg-white'>Right</section>
    </DoubleColumnLayout>
</Container>
```

## SidebarContentLayout

좌측 고정폭 + 우측 확장 레이아웃. 리스트/상세(데일리로그, 회고) 구조용.

```tsx
<Container>
    <SectionHeader title='데일리로그' type='main' />
    <SidebarContentLayout gap='24px' sidebarWidth='320px'>
        <aside>List</aside>
        <section>Content</section>
    </SidebarContentLayout>
</Container>
```

핵심 props:

- `sidebarWidth?: string`
- `gap?: string`

## SectionHeader

페이지 섹션 제목 + 날짜 이동 UI(옵션) 컴포넌트.

```tsx
<SectionHeader title='2026. 03. 18' type='main' />
<SectionHeader datePicker onNextClick={() => {}} onPreviousClick={() => {}} title='2026년 3월 18일 수요일' type='sub' />
```

## 체리픽 가이드

1. 페이지 루트에 `Container` 먼저 배치
2. 상단 제목은 `SectionHeader`로 통일
3. 본문은 `CenteredLayout` / `DoubleColumnLayout` / `SidebarContentLayout` 중 하나 선택
4. 전역 라우트 엔트리는 `AppShell`에서 헤더 variant만 결정
