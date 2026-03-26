# UI Components

페이지에서 바로 가져다 쓸 수 있도록 `ui` 컴포넌트를 체리픽 기준으로 정리합니다.

import 방식은 아래와 같습니다.

```tsx
import {
    Icon,
    Button,
    ButtonGroup,
    PlayerButton,
    Modal,
    PlayerModal,
    Menu,
    Toast,
    Tag,
    Shortcut,
    Badge,
    Tooltip,
    DailyLogCard,
    RetroCard,
} from '@@/ui';
```

## Icon

아이콘 렌더링 공통 컴포넌트.

```tsx
<Icon name='music_on' size={16} color='color-primary' />
<Icon name='arrow-left' size={24} />
```

핵심 props:

- `name` (필수)
- `size?: number`
- `color?: string`
- `className?: string`

## Button

표준 버튼. 스타일/상태/사이즈 조합용.

```tsx
<Button variant='filled' size='lg'>
    다음
</Button>
<Button icon={<Icon name='music_on' size={16} />} size='md' variant='outline'>
    배경음악
</Button>
```

## PlayerButton

원형 플레이어 전용 버튼.

```tsx
<PlayerButton icon={<Icon name='play' size={20} />} size='md' variant='filled' />
<PlayerButton icon={<Icon name='pause' size={20} />} size='md' variant='outline' />
```

## ButtonGroup

버튼 묶음 정렬 컴포넌트.

```tsx
<ButtonGroup>
    <Button variant='outline'>취소</Button>
    <Button>확인</Button>
</ButtonGroup>
```

## Modal

표준 확인/경고 모달.

```tsx
<Modal open title='다음 단계' description='다음 단계를 진행해 주세요' leftButtonLabel='취소' rightButtonLabel='다음' />
```

## PlayerModal

BGM 플레이어 모달.

```tsx
<PlayerModal open title='배경음악 플레이어' onClose={() => {}} />
<PlayerModal open tone='focusmode' title='배경음악 플레이어' onClose={() => {}} />
```

핵심 props:

- `tone?: 'default' | 'focusmode'`
- `open?: boolean`
- `onClose?: () => void`
- `inline?: boolean`

## Menu

메뉴 액션 모달(날짜 이동/삭제 등).

```tsx
<Menu items={[{ label: '날짜 이동하기' }, { label: '삭제하기', tone: 'danger' }]} open />
```

## Toast

토스트 메시지 컴포넌트.

```tsx
<Toast label='토스트 메시지' />
<Toast icon={<Icon name='notification' size={16} />} label='토스트 메시지' />
<Toast actionLabel='취소' label='토스트 메시지' onActionClick={() => {}} />
```

## Tooltip

정보 툴팁.

```tsx
<Tooltip date='2026년 3월 18일' focusTime='10시간 20분' pomodoroCount={8} />
```

## Badge

상태/카운트 배지.

```tsx
<Badge label='0set' />
<Badge iconName='check' label='1/3' />
```

핵심 props:

- `label: ReactNode` (필수)
- `iconName?: string` (값이 있으면 아이콘 노출)

스타일 스펙:

- `h-5`, `w-fit`, `rounded-full`
- 배경 `bg-neutral-darker`
- 텍스트 `text-xs text-white`
- 아이콘 `12px`, `white`

## Tag

카테고리/라벨 태그.

```tsx
<Tag label='기술' tone='danger' />
<Tag icon={<Icon name='emotion' size={16} />} label='감정' tone='success' />
```

## Shortcut

키보드 숏컷 시각화 컴포넌트.

```tsx
<Shortcut keys={['⌘', 'K']} />
```

## Card

리스트 카드 UI.

```tsx
<DailyLogCard dateLabel='오늘' state='default' title='제목 뭘로 할까?' />
<RetroCard date='2026년 3월 18일 수요일' state='selected' />
```

핵심 상태:

- `DailyLogCard.state`: `default | selected | hover`
- `RetroCard.state`: `default | selected | hover | empty`

## 체리픽 가이드

1. 액션 버튼은 `Button`/`PlayerButton` 우선
2. 피드백 UI는 `Modal`/`Toast`/`Tooltip` 조합
3. 데이터 표시 UI는 `Badge`/`Tag`/`Card` 조합
4. 공통 아이콘은 `Icon`으로 통일
