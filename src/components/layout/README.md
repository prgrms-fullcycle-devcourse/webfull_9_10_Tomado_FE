# layout

페이지 구현 전에 공용 골조만 제공하는 레이어입니다.

## Available

- `Container`
    - 본문 공통 폭
    - `max-width: 1200px`
    - 좌우 패딩 `20px`
- `CenteredLayout`
    - 가운데 정렬 + 세로 스택
    - 회원가입, 로그인, 마이페이지용
- `TwoColumnLayout`
    - 반응형 2컬럼
    - 메인 화면처럼 좌우 비슷한 비중일 때 사용
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

## Two Column

```tsx
import { Container } from '@/components/layout/Container';
import { TwoColumnLayout } from '@/components/layout/TwoColumnLayout';

<Container>
    <TwoColumnLayout minColumnWidth='420px' gap='24px'>
        <section>Left</section>
        <section>Right</section>
    </TwoColumnLayout>
</Container>;
```

## Sidebar + Content

```tsx
import { Container } from '@/components/layout/Container';
import { SidebarContentLayout } from '@/components/layout/SidebarContentLayout';

<Container>
    <SidebarContentLayout sidebarWidth='320px' gap='24px'>
        <aside>List</aside>
        <section>Content</section>
    </SidebarContentLayout>
</Container>;
```

## Guide

- 헤더는 full width
- 헤더 아래 본문만 `Container`로 감쌉니다
- 페이지별 세부 배치는 `Container` 안에서 조합합니다
- 반복되는 배치 패턴만 `layout`으로 올립니다
