# Toggle

```tsx
import { Toggle } from '@/components/ui/Toggle';
```

## Props

```tsx
<Toggle />
```

- `checked`: 외부 제어 on/off 상태
- `defaultChecked`: 초기 on/off 상태
- `size`: `sm | md`
- `disabled`: 비활성화 여부
- `ariaLabel`: 접근성 라벨
- `onCheckedChange`: 상태 변경 콜백

## Example

```tsx
<Toggle />
<Toggle checked />
<Toggle defaultChecked />
<Toggle disabled />
```

## Note

- Tailwind CSS 기반으로 구현
- 내부 상태로 바로 토글되며, `checked` 값이 바뀌면 다시 동기화됨
- `role='switch'`, `aria-checked`를 사용해 접근성을 맞춤
