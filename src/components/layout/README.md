# layout

페이지 구현 전에 공용 골조만 제공하는 레이어입니다.

## Available

- `Container`
    - 모든 페이지 본문에서 기본으로 사용
    - 바깥: `mx-auto w-full px-5`
    - 안쪽: `w-full max-w-[1200px] mx-auto`
- `Header`
    - 공통 헤더 shell
    - `leftSlot`, `centerSlot`, `rightSlot` 조합
- `GuestHeader`
    - 비로그인 상태 헤더
    - 브랜드센터, 회원가입, 로그인 진입에 사용
- `DefaultHeader`
    - 로그인 후 기본 헤더
    - 네비, 액션 버튼, 프로필 영역 포함
- `CenteredLayout`
    - 가운데 정렬 + 세로 스택
    - 회원가입, 로그인, 마이페이지용
- `DoubleColumnLayout`
    - 좌우 2패널 배치 전용
    - 패널 모양은 페이지에서 직접 그립니다
- `SidebarContentLayout`
    - 좌측 고정폭 + 우측 확장
    - 데일리로그, 회고처럼 리스트/상세 구조일 때 사용

## Basic

```tsx
import { Container } from '@/components/layout/Container';

<Container>
    <h1>Page Title</h1>
</Container>;
```

## Rule

- 본문 레이아웃은 기본적으로 `Container`를 먼저 사용합니다.
- `layout` 컴포넌트는 배치만 담당합니다.
- 카드 모양, 배경, 높이 같은 표현은 각 페이지에서 직접 그립니다.
- 헤더는 full width, 본문은 `Container` 안에서만 조합합니다.

## Header

```tsx
import { GuestHeader } from '@/components/layout/Header';
import { DefaultHeader } from '@/components/layout/Header';

<GuestHeader signupHref='/signup' loginHref='/login' brandHref='/brandcenter' />;

<DefaultHeader
    navItems={[
        { label: '데일리로그', href: '/dailylog', active: true },
        { label: '회고', href: '/retro' },
        { label: '대시보드', href: '/dashboard' },
    ]}
    onMusicClick={() => {}}
    onFocusModeClick={() => {}}
/>;
```

## Centered

```tsx
import { Container } from '@/components/layout/Container';
import { CenteredLayout } from '@/components/layout/CenteredLayout';

<Container>
    <CenteredLayout maxWidth='960px' gap='32px'>
        <section>계정 관리</section>
        <section>설정</section>
    </CenteredLayout>
</Container>;
```

## Double Column

```tsx
import { Container } from '@/components/layout/Container';
import { DoubleColumnLayout } from '@/components/layout/DoubleColumnLayout';

<Container>
    <SectionHeader title='로그' />

    <DoubleColumnLayout>
        <section className='rounded-2xl bg-white px-8 py-6'>Left panel</section>
        <section className='rounded-2xl bg-white px-8 py-6'>Right panel</section>
    </DoubleColumnLayout>
</Container>;
```

## Sidebar + Content

```tsx
import { Container } from '@/components/layout/Container';
import { SidebarContentLayout } from '@/components/layout/SidebarContentLayout';

<Container>
    <SectionHeader title='로그' />
    <SidebarContentLayout sidebarWidth='320px' gap='24px'>
        <aside>List</aside>
        <section>Content</section>
    </SidebarContentLayout>
</Container>;
```

## Guide

- 헤더 아래 본문은 항상 `Container`로 감쌉니다
- 페이지별 세부 배치는 `Container` 안에서 조합합니다
- 반복되는 배치 패턴만 `layout`으로 올립니다
- `DoubleColumnLayout`은 2컬럼 배치만 담당합니다
- `Header`는 shell이고, 실제 로그인/비로그인 조합은 `DefaultHeader`, `GuestHeader`를 사용합니다
