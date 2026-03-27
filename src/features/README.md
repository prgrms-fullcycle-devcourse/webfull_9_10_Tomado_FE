# features

`features`는 서비스의 도메인 단위로 코드를 묶는 레이어다.

- 공용 UI가 아닌, 기능 의미가 있는 코드만 둔다
- 페이지는 조합만 하고, 도메인 상태와 동작은 `features`로 보낸다

## 기준

### `components`

- 해당 도메인에서만 의미가 있는 UI
- 예: `timer/SessionIndicator`, `timer/FocusMode`

### 도메인 루트의 `useSomething.ts`

- 아직 개수가 많지 않은 도메인 훅
- `hooks/` 폴더를 미리 만들기보다 루트에 둔다
- 훅이 많아질 때만 `hooks/`로 승격한다

### 도메인 루트의 `useSomethingStore.ts`

- `zustand` 같은 전역 상태
- 훅과 마찬가지로 아직 적으면 루트에 둔다
- store가 많아질 때만 `stores/`로 분리한다

### `api`

- 도메인별 API 호출
- 실제로 생길 때 추가해도 된다
- 비어 있는 폴더를 미리 과하게 늘릴 필요는 없다

### `types`

- 여러 파일에서 공유하는 도메인 타입만 둔다
- 컴포넌트 전용 props 타입은 컴포넌트 파일 안에 둔다

## 현재 방향

예: `timer`

```txt
features/timer/
├─ api/
├─ components/
│  ├─ FocusMode.tsx
│  ├─ SessionIndicator.tsx
│  └─ TomatoVisual.tsx
├─ useFocusModeBackground.ts
├─ useFocusModeBackgroundStore.ts
├─ README.md
└─ index.ts
```

이 구조는 다음 기준을 따른다.

- 컴포넌트는 도메인 의미가 있을 때만 `components`에 둔다
- 훅/store가 아직 적으면 도메인 루트에 둔다
- 공용으로 쓸 수 있는 것은 `src/components/ui`를 재사용한다

## 작성 원칙

1. feature는 하나의 도메인 책임만 가진다
2. 공용 UI와 도메인 UI를 섞지 않는다
3. 페이지는 얇게 유지하고, 상태와 동작은 feature로 보낸다
4. 구조는 처음부터 과하게 나누지 말고, 커질 때 승격한다
