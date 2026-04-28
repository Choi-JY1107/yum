# Yum 프로젝트 문서

> 이 디렉토리는 프로젝트의 모든 **규칙·결정·컨벤션**을 보관한다.
> "무조건 문서화" 원칙에 따라, 코드만으로는 알 수 없는 모든 의사결정을 여기에 남긴다.

## 구조

### 📐 [conventions/](./conventions) — 코딩·아키텍처 규칙
- [clean-architecture.md](./conventions/clean-architecture.md) — 클린 아키텍처 + 클린 코드 가이드
- [bem.md](./conventions/bem.md) — BEM 명명 규칙
- [lint-format.md](./conventions/lint-format.md) — ESLint + Prettier 사용법

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
| - | SSGOI 도입 (페이지 전환) | ⏸️ 보류 — 라우터 도입 시점에 재검토 |
| - | 백엔드 (Go vs Node.js) | 🟡 미정 — ADR-0006 패턴 따라 도입 시 자연 흡수 |

## 작성 원칙
- **간결하게**: 토이 프로젝트 문서가 100페이지가 되면 안 된다.
- **이유를 남긴다**: "왜"가 빠진 문서는 6개월 뒤 가치가 사라진다.
- **결정이 바뀌면 ADR을 새로 추가**한다 (기존 것은 "Superseded"로 표시).
