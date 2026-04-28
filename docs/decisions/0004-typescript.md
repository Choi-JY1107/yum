# ADR-0004: TypeScript 사용

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

프론트엔드 언어 선택 — JavaScript vs TypeScript.
프로젝트 전제:
- 클린 아키텍처 + 클린 코드 강제 ([R3](../../CLAUDE.md#r3-클린-아키텍처--클린-코드))
- 도메인 레이어(`Restaurant`, `SwipeAction` 등)에 타입 모델이 핵심
- Svelte 5 + svelte-gestures(타입 정의 동봉)

## Decision

**TypeScript 사용** (`*.ts`, `<script lang="ts">`)

- Vite 템플릿: `svelte-ts`
- `tsconfig.json` 기본 strict 옵션 유지 (`strict: true`, `noImplicitAny`, `strictNullChecks`)
- 도메인 타입은 `src/lib/domain/` 아래에 정의해 다른 레이어가 import

## Consequences

**긍정적**
- 도메인 모델·유스케이스 시그니처가 자동 검증 → 클린 아키텍처 경계 강화
- IDE 자동완성·리팩토링 안정성 ↑
- svelte-gestures, Svelte 5 등 라이브러리의 타입 힌트 활용

**부정적**
- 타입 정의에 약간의 보일러플레이트
- 빌드 시 타입체크 추가 (Vite는 빠르므로 무시할 수준)

## References

- [Svelte 5 + TypeScript 공식 가이드](https://svelte.dev/docs/typescript)
