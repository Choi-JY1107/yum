# Yum 프로젝트 문서

> 이 디렉토리는 프로젝트의 모든 **규칙·결정·컨벤션**을 보관한다.
> "무조건 문서화" 원칙에 따라, 코드만으로는 알 수 없는 모든 의사결정을 여기에 남긴다.

## 구조

### 📐 [conventions/](./conventions) — 코딩·아키텍처 규칙
- [clean-architecture.md](./conventions/clean-architecture.md) — 클린 아키텍처 + 클린 코드 가이드
- [bem.md](./conventions/bem.md) — BEM 명명 규칙
- [lint-format.md](./conventions/lint-format.md) — ESLint + Prettier 사용법
- [deployment.md](./conventions/deployment.md) — Vercel 배포 + 환경변수 가이드

### 🔍 [research/](./research) — 기술 조사·비교 (의사결정 직전 단계)
ADR이 "결정을 박는 곳"이라면 research는 "결정 전에 옵션·근거를 비교한 자료". 결정 후에도 **변천 이력**으로 남긴다.
- [api-pricing.md](./research/api-pricing.md) — 식당 검색 + 음식 사진 API 가격 (카카오/네이버/Google/스톡 사진)
- [backend-stack.md](./research/backend-stack.md) — 백엔드 스택 비교 (Node.js / Go / Rust)

### 🧭 [decisions/](./decisions) — ADR (Architecture Decision Records)
중요한 기술·스코프 결정의 **이유**를 보존한다. 새 결정은 다음 번호로 추가한다.

| 번호 | 제목 | 상태 |
| --- | --- | --- |
| [0001](./decisions/0001-frontend-framework.md) | 프론트엔드 프레임워크 → **Svelte 5 + Vite** | ✅ Accepted |
| [0002](./decisions/0002-styling.md) | 스타일링 → **순수 CSS + BEM** (Tailwind 미사용) | ✅ Accepted |
| [0003](./decisions/0003-card-swipe-gesture.md) | 카드 스와이프 → **svelte-gestures + Svelte spring/tweened** | ✅ Accepted |
| [0004](./decisions/0004-typescript.md) | **TypeScript 사용** | ✅ Accepted |
| [0005](./decisions/0005-monorepo-structure.md) | 디렉토리 구조 → **모노레포 (frontend/, backend/)** | ✅ Accepted |
| [0006](./decisions/0006-mock-api-strategy.md) | Mock API 전략 → **Vite middleware + 갈아끼움 패턴** | ✅ Accepted |
| [0007](./decisions/0007-lint-format.md) | Lint & Format → **ESLint + Prettier (Svelte/TS 플러그인)** | ✅ Accepted |
| [0008](./decisions/0008-vercel-deployment.md) | 배포 → **Vercel + GitHub + Serverless Function** | ✅ Accepted |
| [0009](./decisions/0009-external-api-adapter.md) | 외부 API 통합 → **Adapter 패턴 (RestaurantProvider, PhotoProvider)** | ✅ Accepted |
| [0010](./decisions/0010-backend-stack.md) | 백엔드 스택 → **Node.js (TS) on Vercel** | ✅ Accepted |
| - | SSGOI 도입 (페이지 전환) | ⏸️ 보류 — 라우터 도입 시점에 재검토 |

## 작성 원칙
- **간결하게**: 토이 프로젝트 문서가 100페이지가 되면 안 된다.
- **이유를 남긴다**: "왜"가 빠진 문서는 6개월 뒤 가치가 사라진다.
- **결정이 바뀌면 ADR을 새로 추가**한다 (기존 것은 "Superseded"로 표시).
