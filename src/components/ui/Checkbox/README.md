# Checkbox

```tsx
import { Checkbox } from '@/components/ui/Checkbox';
```

## Props

```tsx
<Checkbox />
```

- `checked`: 외부 제어 체크 상태
- `defaultChecked`: 초기 체크 상태
- `size`: `sm | md`
- `disabled`: 비활성화 여부
- `ariaLabel`: 접근성 라벨
- `onCheckedChange`: 체크 상태 변경 콜백

## Example

```tsx
<Checkbox />
<Checkbox checked />
<Checkbox defaultChecked />
<Checkbox disabled />
```

## Note

- Tailwind CSS 기반으로 구현
- 내부 상태로 바로 토글되며, `checked` 값이 바뀌면 다시 동기화됨
- `role='checkbox'`, `aria-checked`를 사용해 접근성을 맞춤
