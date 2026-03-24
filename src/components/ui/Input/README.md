# Input

```tsx
import { SearchInput, StandardInput, TextArea, TodoInput } from '@/components/ui/Input';
```

## Props

```tsx
<StandardInput helperText='8자리 이상이어야 해요' label='라벨' placeholder='인증번호 입력' state='default' />
```

- `state`: `default | filled | focus | disabled | error`
- `label`: `string`
- `helperText`: `string`
- `shortcutLabel`: `string`
- `actionLabel`: `string`
- `fieldClassName`: input wrapper class
- `inputClassName` / `textareaClassName`: actual input element class

## Example

```tsx
<StandardInput label='라벨' placeholder='인증번호 입력' helperText='8자리 이상이어야 해요' />

<StandardInput
    label='라벨'
    placeholder='인증번호 입력'
    helperText='8자리 이상이어야 해요'
    value='인증번호 입력'
    state='focus'
/>

<SearchInput placeholder='제목 또는 내용으로 검색하세요' shortcutLabel='F' />

<SearchInput placeholder='제목 또는 내용으로 검색하세요' shortcutLabel='Esc' state='focus' value='검색어' />

<TodoInput placeholder='할 일을 추가해보세요' shortcutLabel='T' />

<TodoInput actionLabel='Enter' placeholder='할 일을 추가해보세요' state='filled' value='할 일을 추가해보세요' />

<TextArea label='라벨' placeholder='placeholder' />

<TextArea label='라벨' placeholder='placeholder' state='error' />

<TextArea label='라벨' value='placeholder' />
```

## Note

- 컬러는 `theme.css` 토큰 사용
- `state='disabled'` 또는 `disabled`면 비활성 처리
- `TodoInput`은 `actionLabel`이 있어도 입력값이 있을 때만 우측 액션 버튼이 렌더링됨
- `TodoInput` 기본값은 `shortcutLabel='T'`, `actionLabel='Enter'`
- `SearchInput`, `TodoInput`은 `endAdornment`로 우측 UI를 커스텀 가능
