# Components

`components`는 화면 구현 시 재사용 가능한 조각을 모아둔 레이어입니다.  
현재 구조는 `ui`, `form`, `layout` 3개로 분리합니다.

## 폴더 구조

```txt
components/
├─ ui/      # 버튼, 배지, 모달, 토스트 등 표시 중심 컴포넌트
├─ form/    # 입력/선택/토글 등 폼 중심 컴포넌트
└─ layout/  # 페이지 골조, 헤더, 컨테이너
```

## 분류 기준

## ui

이런 경우 `ui`:

- 데이터 입력보다 "표현/동작"이 중심
- 여러 페이지에서 그대로 재사용 가능
- 예: `Button`, `Badge`, `Tag`, `Tooltip`, `Toast`, `Modal`

## form

이런 경우 `form`:

- 값 입력/선택/변경이 중심
- 상태(`value`, `checked`, `error`)를 받는 필드류
- 예: `Input`, `SearchInput`, `TodoInput`, `TextArea`, `CheckBox`, `Radio`, `SegmentedControl`, `Toggle`

## layout

이런 경우 `layout`:

- 페이지 배치/골조를 결정
- children/slot을 조합하는 역할
- 예: `AppShell`, `Header`, `Container`, `CenteredLayout`, `DoubleColumnLayout`, `SidebarContentLayout`, `SectionHeader`

## Import 규칙

권장:

```tsx
import { Button, Modal, Toast } from '@/components/ui';
import { Input, SearchInput, Toggle } from '@/components/form';
import { Container, AppShell, SectionHeader } from '@/components/layout';
```

하위 폴더 경로 import는 레거시 호환 외에는 새 코드에서 지양.

## 설계 원칙

1. 레이어 혼합 금지

- `ui`에서 페이지 구조(`layout`) 책임을 갖지 않음
- `layout`에서 비즈니스 폼 로직(`form`)을 직접 구현하지 않음

2. 단일 책임

- 컴포넌트 하나는 하나의 목적만 담당

3. 체리픽 가능성 우선

- 페이지에서 바로 복붙 가능한 API/props 유지
- 기본값을 충분히 제공하고, `className` 확장 포인트 제공

4. 의존성 방향

- `pages -> features -> components`
- `components`는 상위 레이어를 참조하지 않음
