# Icon

```tsx
import { Icon } from '@/components/ui/Icon';
```

## Props

```tsx
<Icon name='play' size={24} color='color-primary' />
```

- `name`: 아이콘 파일명 확장자 제외
- `size`: number 또는 string
- `color`: 단색 아이콘에만 적용
- `label`: 접근성용 텍스트. 없으면 `aria-hidden`

## Example

```tsx
<Icon name='play' size={24} color='color-primary' />
<Icon name='search' size={16} color='color-tomato-400' />
```

## Note

- 일반 아이콘은 `src/components/ui/Icon/*.svg` 에 추가 후 `<Icon name='파일명' />`로 사용
- 일반 아이콘 SVG는 `fill='currentColor'` 또는 `stroke='currentColor'` 기준으로 관리
- `color='color-primary'`처럼 토큰 이름만 넘기면 내부에서 `var(--color-primary)`로 처리

## Fixed Color Icons

- 현재 예외 처리된 아이콘: `avatar`
- 이 아이콘은 `color` prop을 쓰지 않고 원본 색상을 유지
- 다색 아이콘을 추가로 예외 처리하려면 [styles.ts](https://github.com/prgrms-fullcycle-devcourse/webfull_9_10_Tomado_FE/blob/develop/src/components/ui/Icon/styles.ts)의 `fixedColorIconNames`에 이름을 추가

```ts
const fixedColorIconNames = new Set(['avatar', 'example_multicolor']);
```

## Usage

```tsx
import { Icon } from '@/components/ui/Icon';

<Icon name='music_on' size={16} color='color-primary' />
<Icon name='arrow_left' size={24} color='color-neutral' />
```
