# Badge

```tsx
import { Badge } from '@/components/ui/Badge';
```

## Props

```tsx
<Badge label='라벨' />
```

- `label`: 뱃지 텍스트 또는 노드
- `iconName`: 왼쪽 아이콘 이름
- `size`: `sm | md`

## Example

```tsx
<Badge label='라벨' />
<Badge iconName='visibility' label='라벨' />
```

## Note

- Tailwind CSS 기반으로 구현
- 채워진 pill 형태의 상태 라벨용 컴포넌트
- 아이콘을 넣으면 왼쪽에 함께 렌더링됨
