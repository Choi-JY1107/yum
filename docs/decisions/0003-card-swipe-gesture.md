# ADR-0003: 카드 스와이프 제스처 솔루션

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

MVP의 핵심 인터랙션은 **카드 좌/우 스와이프**(❌ 패스 / ❤️ 킵).
서비스 가치 명제 중 하나가 **"쫀득한 손맛"** — 즉, 제스처와 애니메이션의 품질이 핵심.

먼저 결정한 [SSGOI](https://github.com/meursyphus/ssgoi)는 **페이지(라우트) 간 전환** 라이브러리이므로, **카드 자체의 좌우 스와이프 제스처는 별도 솔루션**이 필요하다.

## Options

| 후보 | 장점 | 단점 |
| --- | --- | --- |
| **A. 제스처 라이브러리 + 직접 애니메이션** (`svelte-gestures` / `@use-gesture/svelte` 등) | 제스처 인식은 검증된 라이브러리에 위임, 애니메이션은 자유롭게 커스텀 | 약간의 학습, 라이브러리 의존성 |
| **B. Svelte `use:action`으로 직접 구현** | 의존성 0, 자유도 최고, 학습 가치 ↑ | 손이 많이 감, 엣지 케이스(velocity, fling) 직접 처리 |
| **C. 버튼만 (스와이프 없음)** | 빠른 MVP 완성 | "쫀득한 손맛" 가치 명제 위배 |

## Decision

**Option A — `svelte-gestures` + Svelte 빌트인 애니메이션**

- 제스처 인식: **`svelte-gestures` 5.x** (Svelte 5 전용). `usePan`으로 드래그 추적 + `useSwipe`로 방향·속도 임계값 판정.
  - 채택 이유: Svelte 5 공식 호환, action 스타일 API가 BEM 마크업과 어울림, pan/swipe/tap 등 필요한 제스처를 단일 라이브러리로 커버
  - 대안 검토 결과: `@use-gesture/svelte`는 유지보수가 활발하지 않고 Svelte 5 호환이 명확치 않음 → 기각
- 애니메이션: Svelte 빌트인 `tweened` / `spring` (`svelte/motion`) — 스프링 물리로 자연스러운 모션
- 임계값 기반 결정: 스와이프 거리 또는 속도가 임계값(`SWIPE_THRESHOLD_PX`, `SWIPE_VELOCITY`) 이상이면 카드를 화면 밖으로 날림(fling), 미만이면 원위치 복귀
- 버튼(❌/❤️)도 함께 제공 — 스와이프 안 되는 환경(데스크탑 클릭, 접근성)을 위한 폴백

## Consequences

**긍정적**
- 검증된 제스처 인식으로 엣지 케이스(멀티터치, 드래그 시작 임계값 등) 회피
- 애니메이션은 Svelte 표준(`spring`/`tweened`)으로 의존성 추가 없이 자연스러운 모션
- 키보드/접근성 폴백 가능 (버튼 병행)

**부정적**
- 제스처 라이브러리 의존성 1개 추가
- spring 파라미터 튜닝(`stiffness`, `damping`)은 직접 시행착오 필요

## Open Questions

- 카드 회전 효과(드래그 거리에 따른 tilt) 적용 여부 — 프로토타입 작업 중 결정
- spring 파라미터(`stiffness`, `damping`) 튜닝 — 실제 디바이스 테스트로 결정
