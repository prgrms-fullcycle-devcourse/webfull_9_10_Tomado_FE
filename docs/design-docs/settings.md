# Settings Domain

이 문서는 settings 도메인의 설계 source of truth입니다.

## Summary

- 현재 settings 도메인의 중심 기능은 BGM 플레이어입니다.
- 앱 전역에서 유지되어야 하는 설정 성격 기능을 담당합니다.
- 향후 타이머 기본 시간, 휴식 시간, 투두 관련 전역 설정도 이 도메인에 포함될 수 있습니다.

## Current Scope

현재 구현된 범위는 BGM 플레이어입니다.

- 트랙 카테고리: `lofi`, `rain`, `cafe`
- 현재 선택 트랙 표시
- 재생 / 일시정지 / 재개
- 이전 / 다음 트랙 이동
- 볼륨 조절
- 화면 전환 후에도 재생 유지
- 새로고침 후 마지막 트랙 / 볼륨 / 재생 위치 복원
- 브라우저 autoplay 정책에 막힐 경우 첫 사용자 인터랙션에서 재생 재시도

추가로 My 페이지에서 사용자 설정 저장 흐름이 일부 연결되어 있습니다.

- 집중 시간 / 단기 휴식 / 장기 휴식 설정 저장
- 미완료 Todo 자동 이월 토글 저장
- 설정 저장과 초기화는 settings query cache를 먼저 갱신하는 낙관적 업데이트 기준으로 동작

## Main Parts

### `tracks.ts`

- BGM 트랙 메타데이터 정의 파일
- 카테고리별 제목/설명/카드 이미지 정의
- 실제 플레이어가 소비할 `bgmTracks` 생성
- 모달 카드에 쓰는 `bgmPlayerItems` 생성

### `bgmStorage.ts`

- 새로고침 복원을 위한 storage 유틸
- storage key 정의
- 기본 볼륨 정의
- 마지막 트랙 / 볼륨 / 재생 여부 / 재생 위치 초기값 복원

### `bgmAudioRuntime.ts`

- 실제 오디오 런타임을 담당하는 실행 레이어
- 전역 `Audio` 싱글턴 생성
- 현재 트랙 동기화
- 현재 시간 동기화
- 이전/다음 트랙 계산
- autoplay 실패 시 재시도 유틸

### `useBgmPlayer.ts`

- UI가 직접 사용하는 BGM 훅
- zustand store 구독
- 재생 상태와 현재 트랙 노출
- 볼륨 변경 핸들러
- 재생/일시정지/이전/다음 핸들러
- 카테고리 카드 선택 핸들러
- `stopBgmPlayback()`으로 인증 종료 시 오디오와 persisted 재생 상태를 함께 정리

### `useMySettings.ts`

- `My` 페이지 설정 섹션이 사용하는 settings 전용 훅
- 설정 조회 결과를 로컬 입력 상태로 풀어내고, 저장/초기화/자동 이월 토글 흐름을 담당
- settings query cache를 먼저 갱신하는 낙관적 업데이트와 버튼 block 규칙을 함께 관리
- 타이머 시간 입력은 분 단위 정수만 허용한다
- 타이머 조절 버튼은 5분 단위 step만 사용하고, 1분 단위 세부 조정은 키보드 직접 입력으로만 허용한다
- 버튼 감소는 `5 -> 1`까지 허용하고 그 아래는 disabled 처리한다

### `index.ts`

- settings 도메인 public export 파일
- 외부에서는 `useBgmPlayer`, `useMySettings`, `bgmTracks`, `bgmPlayerItems`를 이 파일을 통해 가져온다

## Current Flow

1. `tracks.ts`가 트랙 메타데이터를 준비한다.
2. `bgmStorage.ts`가 복원할 초기 상태를 읽는다.
3. `bgmAudioRuntime.ts`가 실제 `Audio` 엘리먼트를 제어한다.
4. `useBgmPlayer.ts`가 store와 runtime을 조합해서 UI용 API와 정리 함수를 노출한다.
5. `My` 페이지의 설정 섹션은 `useMySettings.ts`를 통해 사용자 설정 mutation을 조합한다.

## File Rules

- 오디오 파일 자체는 `src/assets/audio/bgm`에 둔다.
- settings 도메인의 핵심은 전역 설정 기능 로직이다.
- 공용 UI는 `src/components/ui`를 재사용한다.
- settings 도메인에는 전역에서 접근 가능하고 페이지를 넘어서 유지되어야 하는 기능을 둔다.

## Asset Rules

현재 BGM 파일 경로 규칙은 아래를 따른다.

```txt
src/assets/audio/bgm/
├─ lofi/
├─ rain/
└─ cafe/
```

새 파일을 추가하면 현재 구조상 트랙 메타데이터와 카테고리 메타가 함께 갱신되어야 한다.

## Future Scope

아직 아래 항목은 실제 구현 전이다.

- 투두 날짜 이동 관련 설정 처리
- settings 전용 store 세분화
