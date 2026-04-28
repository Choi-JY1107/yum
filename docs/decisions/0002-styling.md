# ADR-0002: 스타일링 전략

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

프론트엔드 스타일링 방식을 결정해야 한다. 전제 조건:
- **BEM 방법론은 강제** ([R4](../../CLAUDE.md#r4-프론트엔드는-bem-방법론), [bem.md](../conventions/bem.md))
- **Svelte 컴포넌트** 사용
- 토이 프로젝트 — 의존성 최소화 선호

## Options

| 후보 | 장점 | 단점 |
| --- | --- | --- |
| Tailwind CSS | 빠른 프로토타이핑, 유틸 풍부 | 마크업이 클래스로 길어짐, BEM과 철학 충돌 |
| 순수 CSS + Svelte `<style>` | BEM과 1:1 매칭, 의존성 0 | 유틸 클래스 직접 작성 필요, 반복 코드 ↑ |
| CSS-in-JS / styled-components | 동적 스타일 편함 | Svelte와 어색, 번들 크기 증가 |

## Decision

**순수 CSS + Svelte `<style>` 블록 + BEM 클래스명**

- Tailwind 등 유틸리티 프레임워크는 **사용하지 않는다**.
- 모든 클래스는 BEM 규칙(`block__element--modifier`)을 따른다.
- Svelte `<style>` 블록은 컴포넌트 스코프지만, 클래스명은 BEM 그대로 작성해 마크업의 가독성을 유지한다.
- 반복되는 디자인 토큰(색상, 간격, 폰트)은 **CSS Custom Properties**(`--space-md`, `--color-primary`)로 전역 정의한다.

## Consequences

**긍정적**
- BEM 일관성 유지 — 클래스명만 봐도 컴포넌트 구조 파악
- 외부 의존성 0 — 빌드 사이즈, 학습 곡선 최소
- 디자인 토큰을 CSS 변수로 직접 설계 → 학습 가치
- 향후 글로벌 스타일/디자인 시스템으로 확장 쉬움

**부정적**
- 유틸리티 클래스 부재 → 반복 스타일은 직접 추출해야 함
- 빠른 프로토타이핑 속도는 Tailwind 대비 느림 (의도된 트레이드오프)

**메모**
- 글로벌 스타일은 `src/lib/styles/global.css` 같은 곳에 모은다 (정확한 경로는 ADR-0001 결정 후).
- 브레이크포인트, 컬러, 간격 토큰은 CSS Custom Properties로 통일.
