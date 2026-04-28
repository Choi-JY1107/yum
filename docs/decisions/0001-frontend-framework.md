# ADR-0001: 프론트엔드 프레임워크 — SvelteKit vs Svelte + Vite

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

프론트엔드 프레임워크는 **Svelte**로 결정됨.
다만 다음 두 가지 형태 중 하나를 선택해야 한다:
- **SvelteKit** — Svelte 공식 메타프레임워크 (Next.js의 Svelte 버전)
- **Svelte + Vite** — 순수 Svelte를 Vite 위에 직접 구성

추가 전제:
- **백엔드는 분리** (Go 또는 Node.js, 별도 ADR 예정) → 프론트는 SPA/정적 자산 형태로 빌드해 백엔드 API를 호출
- **MVP 스코프:** 스와이프 탐색 화면 1개
- **다음 단계:** 킵 리스트, 월드컵, 랜덤, 친구 매칭 (모두 별도 화면)
- **SSGOI** 사용 예정 (페이지 전환 라이브러리)

## Options

### Option A. SvelteKit (백엔드 분리, `adapter-static` 또는 `adapter-node` 사용)

**장점**
- 📁 **파일 기반 라우팅 내장** — `routes/` 폴더 = URL. 향후 화면 추가 시 비용 낮음
- 🎬 **SSGOI와 자연스러운 궁합** — SSGOI는 라우트 간 전환 라이브러리라, 라우팅이 있을 때 진가 발휘
- 🧱 **레이아웃 시스템** — `+layout.svelte`로 공통 헤더/네비를 한 번에 관리
- 🛠️ **빌드·번들 세팅 완비** — Vite 설정, 환경변수, 정적 파일, 프리로드 다 됨
- 📲 **모바일 웹에 유리한 기본기** — 메타 태그(OG), 프리렌더링, 코드 스플리팅 자동
- 📚 **공식 문서·예제 풍부**, 채용/협업 시에도 표준
- 🔌 **백엔드 분리에도 문제없음** — `adapter-static`으로 정적 SPA 빌드 가능 (Go/Node 서버는 API만 담당)

**단점**
- 한 화면짜리 MVP엔 다소 **오버스펙** 느낌
- `+page.svelte`, `load`, `+layout`, `adapter` 등 **추가 개념 학습** 필요
- 디렉토리 구조가 정형화되어 자유도가 약간 낮음

### Option B. Svelte + Vite (단독)

**장점**
- ⚡ **가장 가볍다** — `npm create vite` → 바로 컴포넌트만 짜면 됨
- 🎯 **학습 곡선 거의 없음** — Svelte 컴포넌트 외 새로운 개념 X
- 🪶 **얇은 번들·빠른 빌드** — 한 화면 MVP에 최적
- 🆓 **자유로운 구조** — 원하는 대로 폴더 구성

**단점**
- 🚧 **라우팅 직접** — 화면 늘어나면 `svelte-routing`, `svelte-spa-router` 같은 외부 라이브러리를 깔거나 직접 구현
- 🎬 **SSGOI 효용 ↓** — SSGOI 핵심 가치(페이지 전환)를 살리려면 어차피 라우터가 필요해짐
- 🧱 레이아웃·메타·코드 스플리팅 등 **편의 기능을 직접** 세팅
- 📈 다음 단계(킵/월드컵/매칭) 확장 시 누적 비용이 SvelteKit을 추월할 가능성

## 비교 요약 (이 프로젝트 기준)

| 기준 | SvelteKit | Svelte + Vite |
| --- | --- | --- |
| 학습 곡선 | 중 | 하 |
| 초기 셋업 비용 | 낮음 (스캐폴드) | 매우 낮음 |
| 라우팅 추가 비용 | 0 (내장) | 매번 발생 |
| SSGOI 적합도 | ✅ 높음 | ⚠️ 라우터 추가 시만 |
| 백엔드 분리 호환성 | ✅ (`adapter-static/node`) | ✅ |
| 다중 화면 확장 | ✅ 매우 쉬움 | ❌ 비용 누적 |
| 1화면 MVP 적합도 | ⚠️ 오버스펙 가능 | ✅ 매우 적합 |
| 6개월 뒤의 자기 자신 | 편함 | 라우터 직접 짠 거 싫어할 가능성 ↑ |

## 추천 (사용자 결정 전 의견)

**SvelteKit** 권장.
이유: ① 기획에 "다음 단계" 화면이 명확히 4개나 더 있음 → 결국 라우팅 필요, ② SSGOI를 쓰기로 한 시점에서 라우터 전제, ③ `adapter-static`을 쓰면 백엔드(Go/Node) 분리에도 문제 없음, ④ 학습 가치도 토이 프로젝트 목적에 부합.

> 단, "정말 한 화면만 만들고 끝낼 수도 있다"면 Svelte + Vite가 더 가볍다.

## Decision

**Svelte 5 + Vite 단독** 채택.

이유:
- MVP가 **단일 화면**이라 라우터·레이아웃·SSR이 당장 필요 없다
- **얇고 빠른 셋업**으로 핵심 가치(스와이프 제스처·애니메이션)에 빠르게 도달 가능
- 백엔드(Go/Node.js)가 분리되므로 프론트는 정적 SPA 산출물이면 충분
- 향후 다중 화면이 정말 필요해지면 **라우터를 그때 추가**하거나 SvelteKit으로 전환 (Svelte 컴포넌트 자체는 마이그레이션 가능)
- **Svelte 5** 채택 — runes(`$state`, `$derived`, `$effect`) 기반 최신 반응성 시스템, 토이 프로젝트 학습 가치 ↑, 의존 라이브러리(svelte-gestures 5.x 등)도 Svelte 5 전제

## Consequences

**긍정적**
- 학습할 신개념 거의 0 — Svelte 컴포넌트 + Vite 표준 흐름만 익히면 됨
- 빠른 개발 사이클 (Vite HMR)
- 의존성·번들 최소

**부정적 / 주의사항**
- **라우팅이 필요해지는 시점**에서 외부 라우터(`svelte-routing`, `svelte-spa-router` 등) 또는 SvelteKit 마이그레이션을 결정해야 한다 → 그 시점에 ADR로 재평가
- **SSGOI(페이지 전환 라이브러리)는 라우팅이 없는 한 효용이 없다** → 라우터 도입 전까지 **SSGOI 도입 보류**, 라우터 도입 시점에 재평가 (별도 ADR로)
- SSR/메타태그/OG는 직접 처리해야 한다 (필요 시점에 결정)

## References

- [Svelte 공식 문서](https://svelte.dev)
- [Vite Svelte 템플릿](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte)
- [SSGOI](https://github.com/meursyphus/ssgoi) — 라우팅 도입 시점에 재검토
