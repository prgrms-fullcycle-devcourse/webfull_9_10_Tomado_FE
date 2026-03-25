# SectionHeader

페이지 상단 섹션 제목용 컴포넌트입니다.

## Props

- `title`
- `type?: 'main' | 'sub'`
- `datePicker?: boolean`
- `text?: string`
- `showText?: boolean`
- `textSlotWidth?: CSSProperties['width']`
- `onPreviousClick?`
- `onNextClick?`
- `previousDisabled?`
- `nextDisabled?`

## Example

```tsx
<SectionHeader title='2026. 03. 18' type='main' />

<SectionHeader datePicker title='title' type='sub' />

<SectionHeader
  datePicker
  title='title'
  type='sub'
  text='제목을 입력해 주세요'
  showText
/>
```

## Note

- `datePicker`가 `true`일 때만 좌우 화살표가 렌더됩니다.
- 타이틀을 감싸는 hover 효과도 `datePicker`가 `true`일 때만 적용됩니다.
- `text`는 슬롯 폭은 유지하고, `showText`로 내용만 보이거나 숨길 수 있습니다.
