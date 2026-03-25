# Radio

```tsx
import { Radio } from '@/components/ui/Radio';
```

## Props

```tsx
<Radio name='view-mode' value='list' />
```

- `name`: 같은 그룹을 묶는 radio name
- `value`: 현재 radio의 값
- `checked`: 외부 제어 선택 상태
- `defaultChecked`: 초기 선택 상태
- `size`: `sm | md`
- `disabled`: 비활성화 여부
- `ariaLabel`: 접근성 라벨
- `onCheckedChange`: 선택 상태 변경 콜백

## Example

```tsx
<Radio name='view-mode' value='list' />
<Radio checked name='view-mode' value='board' />
<Radio defaultChecked name='view-mode' value='calendar' />
<Radio disabled name='view-mode' value='year' />
```

## Note

- Tailwind CSS 기반으로 구현
- 네이티브 `input type='radio'` 기반이라 같은 `name`끼리 브라우저 기본 그룹 동작을 따름
- 필요하면 `checked`와 `onChange` 또는 `onCheckedChange`로 controlled 방식 제어 가능
