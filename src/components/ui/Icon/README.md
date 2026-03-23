# Icon

```tsx
import { Icon } from '@/components/ui/Icon';
```

## Props

```tsx
<Icon name='play' size={24} color='color-primary' />
```

- `name`: 아이콘 파일명 확장자 제외
- `size`: number 또는 string
- `color`: 단색 아이콘에만 적용
- `label`: 접근성용 텍스트. 없으면 `aria-hidden`

## Example

```tsx
<Icon name='play' size={24} color='color-primary' />
<Icon name='search' size={16} color='color-tomato-400' />
<Icon name='avatar' size={32} color='color-primary-dark' />
```

## Note

- 다색 아이콘은 원본 색상 유지
- 새 아이콘은 `src/components/ui/Icon/*.svg` 에 추가
