# Toast

라벨, 아이콘, 텍스트 버튼 조합을 지원하는 토스트 컴포넌트입니다.

## Props

- `label`
- `icon?: boolean`
- `textButton?: boolean`
- `textButtonLabel?: ReactNode`
- `onTextButtonClick?: () => void`

## Example

```tsx
<Toast label='토스트 메시지' />

<Toast icon label='토스트 메시지' />

<Toast
  label='토스트 메시지'
  textButton
  textButtonLabel='취소'
  onTextButtonClick={() => {}}
/>
```

## Note

- 텍스트 버튼은 underline 대신 wrapper `div`에 `border-b`를 사용합니다.
- 아이콘은 `noti_on`을 고정으로 사용합니다.
