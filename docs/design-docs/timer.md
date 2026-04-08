# Timer Domain

source: [src/features/timer/README.md](../../src/features/timer/README.md)

## Summary

- 타이머 전역 상태, 표시용 파생 상태, 행동, 집중 모드 UI를 담당합니다.
- 현재 표시 상태는 `AuthLayout`에서 공통 `timerSession`으로 조합합니다.

## Main Parts

- `useTimerStore`
- `useTimerSessionView`
- `useTimerSessionController`
- `useFocusModeController`
- `FocusMode`
- `TimerPanel`
- `TimerProgressBar`

## Notes

- 상세 설명은 feature README를 우선 갱신합니다.
- 이후 이 문서를 설계 source of truth로 승격할 수 있습니다.
