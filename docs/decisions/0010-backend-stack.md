# ADR-0010: 백엔드 스택 = Node.js (TypeScript) on Vercel Serverless

- **Status:** ✅ Accepted
- **Date:** 2026-04-29
- **References:** [research/backend-stack.md](../research/backend-stack.md), ADR-0008 (Vercel 배포)

## Context

ADR-0009에서 외부 API 호출을 백엔드(Vercel Serverless Function)에서 한다고 결정.
이제 어느 언어로 작성할지 결정해야 한다. 검토한 후보: **Node.js / Go / Rust** (research/backend-stack.md 참조).

## Decision

**Node.js (TypeScript), 현 Vercel Serverless 인프라 그대로.**

### 선택 이유
- **Frontend(Svelte+TS)와 같은 언어** → 컨텍스트 스위치 0, 도메인 타입(`Restaurant`, `Coordinates`) 직접 import 가능
- **Vercel `@vercel/node` 1급 시민** → ADR-0008 인프라 변경 0
- **fetch + Promise.all로 병렬 호출** 자연스러움 — Adapter 패턴(ADR-0009)의 핵심인 "식당 N개 → 사진 N개 병렬 fetch"가 한 줄
- **JSON 처리 무료** — Go의 struct 보일러플레이트 없음, prototype 단계에 적합

### 인정한 트레이드오프
- 사용자 입장 **학습 가치는 거의 0**. Go였다면 백엔드 + 동시성 새 패러다임 학습 가능했음
- Go는 토이 프로젝트의 가장 큰 학습 ROI였지만, **이번 단계 목표는 "실데이터 빠르게 연결"** → Node를 의식적으로 선택
- 추후 백엔드 학습 욕구가 생기면 같은 ADR-0009 인터페이스를 그대로 둔 채 Go로 별도 서버 띄우고 vite proxy로 갈아끼우면 됨 (ADR-0006 패턴 활용)

### 기각 사유 요약
- **Go**: 매력적이나 이번 단계엔 학습 곡선·struct 보일러플레이트가 빠른 완성에 부담
- **Rust**: Vercel 직접 미지원 → 호스팅 갈아엎어야 함. 토이 백엔드 게이트웨이엔 과스펙

## Consequences

**긍정적**
- 백엔드 코드를 작성하면서 frontend 도메인 타입을 직접 import 가능 → 스키마 drift 위험 0
- Vercel 인프라 (env vars, 함수 라우팅, 배포) 그대로
- `@vercel/node` 타입(`VercelRequest`, `VercelResponse`)이 이미 설치돼 있음 (Phase 0에서 도입)

**부정적**
- 콜드스타트 ~200~500ms (체감 미미, 토이 단계 무관)
- 학습 가치 0 → 사용자가 "나중에 Go로 다시 짤 수 있다"는 옵션을 의식적으로 보존 (Adapter 인터페이스가 그 다리)

## Future Migration Path (참고)
Go로 옮길 의사가 생기면:
1. `backend/` 디렉토리에 Go 서버 작성 (모노레포 구조 — ADR-0005)
2. ADR-0009의 RestaurantProvider/PhotoProvider 인터페이스를 Go로 다시 정의 (스키마 drift 주의)
3. `vite.config.ts`의 mock plugin 제거 + `server.proxy: { '/api': 'http://localhost:8080' }` (ADR-0006 갈아끼움)
4. Vercel은 정적 호스팅만, 백엔드는 별도 (Render/Fly.io/Railway 등) — 새 ADR로 호스팅 결정

→ **Frontend 코드는 0줄 변경**. Adapter + 갈아끼움 패턴이 이 가능성을 보존한다.
