# Tooltip

날짜와 요약 정보를 보여주는 정적 툴팁 컴포넌트입니다.

## Props

- `date`
- `pomodoroValue`
- `focusTimeValue`

## Example

```tsx
<Tooltip date='2026년 3월 18일' pomodoroValue='8세션' focusTimeValue='10시간 20분' />
```

## Note

- 현재는 날짜 + 2줄 메트릭 UI만 지원합니다.
- 아이콘은 내부에서 고정으로 사용합니다.
