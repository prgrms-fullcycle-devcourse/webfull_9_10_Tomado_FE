# features

`features`는 서비스의 **도메인(기능) 단위로 코드를 묶는 레이어**이다.

UI, 로직, API, 타입을 기능 기준으로 하나의 폴더에 모아  
**관련된 코드를 한 곳에서 관리**할 수 있도록 한다.

---

## 구조

```txt
features/
├─ auth/
│   ├─ api/
│   ├─ components/
│   ├─ hooks/
│   ├─ types/
│   └─ index.ts
├─ timer/
├─ todo/
├─ log/
├─ stats/
└─ settings/
```

- api: 해당 기능과 관련된 API 호출
- components: 해당 기능 전용 UI 컴포넌트
- hooks: 해당 기능 전용 로직 (state + effect)
- types: 타입 정의
- index.ts: 외부 노출용 entry

예시: log feature

```txt
features/log/
├─ api/
│  └─ log.api.ts
├─ components/
│  ├─ LogList.tsx
│  ├─ LogEditor.tsx
│  └─ LogItem.tsx
├─ hooks/
│  ├─ useLog.ts
│  ├─ useAutoSave.ts
│  └─ useLogSearch.ts
├─ types/
│  └─ log.types.ts
└─ index.ts
```

---

## 작성 원칙

1. feature는 하나의 책임을 가진다

- timer, todo, log처럼 명확하게 구분

2. 공용 코드와 섞지 않는다

- 재사용 가능하면 components/hooks로 이동

3. feature 내부에서 최대한 해결한다

- 관련된 로직은 feature 내부에 위치

4. pages는 얇게 유지한다

- 비즈니스 로직을 넣지 않는다
