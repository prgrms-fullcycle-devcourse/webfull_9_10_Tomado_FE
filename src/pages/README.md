# pages

`pages`는 라우트(URL) 단위의 화면 진입점을 관리하는 폴더이다.  
각 페이지는 **비즈니스 로직을 직접 구현하는 곳이 아니라**, `layout`, `features`, `components`를 조합하여 하나의 화면 흐름을 구성하는 역할을 가진다.

---

## 역할

`pages`는 아래 역할만 담당한다.

- 라우트 단위 화면 진입
- 페이지 레이아웃 조합
- feature 컴포넌트 배치
- 필요한 전역 상태(selectedDate 등) 연결
- 화면 수준의 흐름 제어

즉, `pages`는 **조립(Composition) 레이어**이다.

---

## 담당하지 않는 것

아래 내용은 `pages`에서 직접 처리하지 않는다.

- 도메인 비즈니스 로직
- API 호출 로직
- 복잡한 상태 관리
- 공용 UI 구현
- 세부 인터랙션 구현

이러한 로직은 각각 아래 위치에서 담당한다.

- 도메인 기능: `features`
- 전역 상태: `app/store`
- 공용 UI: `components/ui`
- 레이아웃: `components/layout`
- 전역 오버레이: `components/overlays`

---

## 작성 원칙

1. 페이지는 얇게 유지한다

- 페이지 파일 안에는 화면을 구성하는 최소한의 조합만 둔다.

2. 기능 구현은 feature에 둔다

- 예를 들어 DailyLog 페이지는 features/log의 컴포넌트를 가져와 조립만 한다.

3. 공용 레이아웃은 layout에서 가져온다

- 페이지 내부에서 반복적인 wrapper나 구조를 새로 만들지 않는다.

4. 전역 상태는 필요한 만큼만 연결한다

- 예: selectedDate, focusMode, auth 상태 등
- 단, 상태 변경 로직 자체는 store/hooks에서 관리한다.

## 예시

### DailyLog 페이지 예시

```tsx
import { PageLayout } from '@/components/layout';
import { LogList, LogForm } from '@/features/log';
import { useSelectedDate } from '@/app/store';

export default function DailyLog() {
    const selectedDate = useSelectedDate();

    return (
        <PageLayout>
            <LogList date={selectedDate} />
            <LogForm date={selectedDate} />
        </PageLayout>
    );
}
```

위 예시처럼 pages는 화면을 조립하는 역할만 수행한다.

## 페이지별 책임 범위

### Main

- 타이머와 오늘의 투두를 중심으로 메인 생산성 화면을 구성한다.

### Dashboard

- 통계 요약, 캘린더/히트맵, 선택 날짜 상세 패널을 구성한다.

### DailyLog

- 데일리로그 목록, 검색, 작성 영역을 조합한다.

### Retro

- 회고 목록, 카테고리 선택, 회고 작성 영역을 조합한다.

### My

- 유저 정보 및 앱 설정 화면을 조합한다.

### Login / Signup

- 인증 전용 폼 화면을 조합한다.

## Focus Mode에 대해

Focus Mode는 별도 page가 아니다.  
어느 화면에서나 진입 가능한 전역 오버레이 UI이므로 pages가 아니라 components/overlays/FocusMode에서 관리한다.
