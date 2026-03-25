# Tag

```tsx
import { Tag } from '@/components/ui/Tag';
```

## Props

```tsx
<Tag label='태그' />
```

- `label`: 태그 텍스트 또는 노드
- `iconName`: 왼쪽 아이콘 이름
- `size`: `sm | md`

## Example

```tsx
<Tag label='태그' />
<Tag iconName='visibility' label='태그' />
```

## Note

- Tailwind CSS 기반으로 구현
- outline pill 형태의 분류용 컴포넌트
- 아이콘을 넣으면 왼쪽에 함께 렌더링됨
