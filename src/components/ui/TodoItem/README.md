# TodoItem

```tsx
import { TodoItem } from '@/components/ui/TodoItem';
```

## Props

```tsx
<TodoItem label='할일 작성' state='filled' />
```

- `state`: `default | filled | focus | empty`
- `checked`: `boolean`
- `defaultChecked`: uncontrolled 기본 체크 상태
- `label`: 할 일 텍스트
- `emptyText`: empty 상태 문구

## Example

```tsx
<TodoItem state='default' checked={false} label='할일 작성' />
<TodoItem state='default' checked label='할일 작성' />
<TodoItem state='filled' checked={false} label='할일 작성' />
<TodoItem state='filled' checked label='할일 작성' />
<TodoItem state='focus' checked={false} label='할일 작성' />
<TodoItem state='focus' checked label='할일 작성' />
<TodoItem state='empty' />
```

## Note

- 컬러는 `theme.css` 토큰 사용
- `focus`는 시안용 상태값이며 그림자 표현 포함
- 체크박스는 내부 상태로 토글되며, `checked` 값이 변경되면 그 값으로 다시 동기화됨
