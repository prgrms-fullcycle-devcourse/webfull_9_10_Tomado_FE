# Card

```tsx
import { DailyLogCard, RetroCard } from '@/components/ui/Card';
```

## Props

```tsx
<DailyLogCard dateLabel='오늘' state='selected' title='제목 뭘로 할까?' />
```

- `DailyLogCard.state`: `default | selected | hover`
- `RetroCard.state`: `default | selected | hover | empty`
- `deleteButtonProps`: hover 상태에서 보이는 삭제 버튼 props
- `onDeleteClick`: hover 상태 삭제 액션 핸들러

## Example

```tsx
<DailyLogCard title='제목 뭘로 할까?' dateLabel='오늘' state='default' />
<DailyLogCard title='제목 뭘로 할까?' dateLabel='오늘' state='selected' />
<DailyLogCard title='제목 뭘로 할까?' dateLabel='오늘' state='hover' />

<RetroCard date='2026년 3월 18일 수요일' state='default' />
<RetroCard date='2026년 3월 18일 수요일' state='selected' />
<RetroCard date='2026년 3월 18일 수요일' state='hover' />
<RetroCard state='empty' />
```

## Note

- 컬러는 `theme.css` 토큰 사용
- `hover`는 실제 마우스 hover가 아니라 시안용 상태값
- `RetroCard` 카테고리는 전달하지 않으면 `기술/결정/소통/감정` 기본값 사용
