# Button

```tsx
import { Button, ButtonGroup } from '@@/ui/Button';
```

## Props

```tsx
<Button variant='filled' state='default' size='lg'>
    다음
</Button>
```

- `kind`: `standard | player`
- `variant`: `filled | outline | ghost`
- `state`: `default | hover | disabled`
- `size`: `lg | md | sm`
- `fullWidth`: 부모 너비 기준 확장
- `icon`: 커스텀 아이콘 노드
- `iconOnly`: 아이콘만 표시

## Example

```tsx
<Button>다음</Button>

<Button variant='outline' size='md'>
    취소
</Button>

<Button iconOnly aria-label='다음으로 이동' />

<Button kind='player' aria-label='재생' />

<ButtonGroup>
    <Button variant='outline'>취소</Button>
    <Button>다음</Button>
</ButtonGroup>
```

## Note

- 컬러는 `theme.css` 토큰 사용
- `state='disabled'` 또는 `disabled`면 비활성 처리
- `iconOnly`, `player`는 내부에 `sr-only` 텍스트 유지
