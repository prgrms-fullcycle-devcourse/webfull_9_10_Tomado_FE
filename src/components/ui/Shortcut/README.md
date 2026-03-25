# Shortcut

```tsx
import { Shortcut } from '@/components/ui/Shortcut';
```

## Props

```tsx
<Shortcut keys={['T', 'F', '+']} />
```

- `keys`: 순서대로 렌더링할 키 배열
- `size`: `sm | md`

## Example

```tsx
<Shortcut keys={['T', 'F', '+', '-', 'Esc']} />
<Shortcut keys={['Cmd', 'K']} size='sm' />
```

## Note

- Tailwind CSS 기반으로 구현
- 여러 키를 `kbd` 형태로 묶어 보여주는 컴포넌트
- 안내용 시각 표현 컴포넌트이며, 실제 키 이벤트 처리는 포함하지 않음
