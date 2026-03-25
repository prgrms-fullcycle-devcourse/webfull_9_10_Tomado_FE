# SegmentedControl

```tsx
import { SegmentedControl } from '@/components/ui/SegmentedControl';
```

## Props

```tsx
<SegmentedControl
    options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
    ]}
/>
```

- `options`: 세그먼트 목록
- `value`: 외부 제어 값
- `defaultValue`: 초기 선택 값
- `size`: `sm | md | lg`
- `ariaLabel`: 접근성 라벨
- `disabled`: 전체 비활성화 여부
- `onValueChange`: 선택 변경 콜백

## Example

```tsx
<SegmentedControl
    defaultValue='week'
    disabled
    options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
    ]}
/>
```

## Note

- 배경과 선택 상태는 색상 토큰 클래스만 사용
- 내부 상태로 바로 동작하며, `value`가 바뀌면 해당 값으로 다시 동기화됨
- 좌우 방향키와 `Home`, `End` 키로 선택 이동 가능
