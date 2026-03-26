# Form Components

입력 관련 컴포넌트 모음입니다.

import 방식은 아래와 같습니다.

```tsx
import { Input, SearchInput, TodoInput, TextArea, CheckBox, Radio, SegmentedControl, Toggle } from '@@/form';
```

## Input

일반 텍스트 입력 필드. `label`, `helperText`, `state`를 지원합니다.

```tsx
<Input label='아이디' placeholder='아이디를 입력해 주세요' />
<Input helperText='필수 입력입니다.' state='error' />
<Input disabled value='disabled value' />
```

핵심 props:

- `state`: `default | filled | error`
- `label?: string`
- `helperText?: string`
- `fieldClassName?`, `inputClassName?`: 내부 wrapper/input만 부분 커스터마이즈

## SearchInput

검색 전용 입력 필드. 왼쪽 `search` 아이콘이 고정되고 우측에 `shortcutLabel` 또는 `endAdornment`를 표시합니다.

```tsx
<SearchInput placeholder='제목 또는 내용으로 검색하세요' shortcutLabel='F' />
<SearchInput endAdornment={<span>⌘K</span>} />
<SearchInput disabled placeholder='검색' />
```

핵심 props:

- `state`: `default | filled | error`
- `shortcutLabel?: string`
- `endAdornment?: ReactNode` (`endAdornment`가 있으면 `shortcutLabel`보다 우선)

## TodoInput

할 일 입력용 필드. 기본적으로 오른쪽 단축키 배지를 보이고, 값이 생기면 액션 버튼으로 전환됩니다.

```tsx
<TodoInput placeholder='할 일을 추가해보세요' />
<TodoInput actionLabel='추가' onActionClick={() => console.log('add')} />
<TodoInput value={value} onChange={(e) => setValue(e.target.value)} />
```

핵심 props:

- `state`: `default | filled | error`
- `shortcutLabel?: string` (기본값: `T`)
- `actionLabel?: string` (기본값: `Enter`)
- `onActionClick?`
- `actionButtonProps?`
- `endAdornment?: ReactNode` (액션 버튼이 보이지 않는 상태에서만 표시)

## TextArea

멀티라인 입력 필드. `Input`과 동일한 패턴으로 `label/helperText/state`를 지원합니다.

```tsx
<TextArea label='내용' placeholder='내용을 입력해 주세요' />
<TextArea state='error' helperText='최소 10자 이상 입력해 주세요.' />
<TextArea rows={10} />
```

핵심 props:

- `state`: `default | filled | error`
- `label?: string`
- `helperText?: string`
- `rows?: number` (기본값: `7`)
- `fieldClassName?`, `textareaClassName?`

## CheckBox

체크박스 버튼 컴포넌트. 제어/비제어 모두 지원합니다.

```tsx
<CheckBox defaultChecked />
<CheckBox size='sm' />
<CheckBox checked={checked} onCheckedChange={setChecked} />
```

핵심 props:

- `size`: `sm | md`
- `checked?`, `defaultChecked?`
- `onCheckedChange?: (checked: boolean) => void`
- `ariaLabel?`

## Radio

라디오 선택 컴포넌트. 동일 `name` 그룹에서 단일 선택으로 사용합니다.

```tsx
<Radio name='period' value='day' defaultChecked />
<Radio name='period' value='week' />
<Radio name='period' value='month' disabled />
```

핵심 props:

- `size`: `sm | md`
- `name` (필수)
- `value` (필수)
- `checked?`, `defaultChecked?`
- `onCheckedChange?: (checked: boolean) => void`

## SegmentedControl

옵션 배열 기반 분할 선택 컨트롤. 키보드 이동(Arrow/Home/End) 지원.

```tsx
<SegmentedControl
    ariaLabel='기록 타입'
    options={[
        { value: 'daily', label: '데일리로그' },
        { value: 'retro', label: '회고' },
    ]}
    defaultValue='daily'
/>
```

핵심 props:

- `options: { value: string; label: ReactNode; disabled?: boolean }[]` (필수)
- `size`: `sm | md | lg`
- `value?`, `defaultValue?`
- `onValueChange?: (value: string) => void`
- `disabled?`

## Toggle

on/off 스위치 컴포넌트. 제어/비제어 모두 지원합니다.

```tsx
<Toggle defaultChecked />
<Toggle size='sm' />
<Toggle checked={enabled} onCheckedChange={setEnabled} />
```

핵심 props:

- `size`: `sm | md`
- `checked?`, `defaultChecked?`
- `onCheckedChange?: (checked: boolean) => void`
- `ariaLabel?`

## 빠른 체리픽 순서

페이지에 새 입력 UI를 빠르게 붙일 때 권장 순서:

1. `Input` 또는 `TextArea`로 기본 필드 먼저 배치
2. 검색/할일 영역은 `SearchInput`, `TodoInput`으로 교체
3. 선택 UI는 `CheckBox`, `Radio`, `SegmentedControl`, `Toggle` 중 목적에 맞게 추가
4. 공통 스타일 미세 조정은 `className`, `fieldClassName`, `inputClassName` 계열로 최소 범위만 수정
