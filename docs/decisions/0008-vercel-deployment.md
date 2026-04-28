# ADR-0008: 배포 — Vercel + Serverless Function (Mock API)

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

MVP를 인터넷에 띄워서 모바일 실기기로 테스트·공유하고 싶다.
요구사항:
- 1인 운영, 무료 티어
- GitHub push → 자동 배포 (CI/CD 부담 0)
- ADR-0006의 "갈아끼움" 패턴 유지 — 프론트는 항상 `/api/restaurants` 호출
- 백엔드(Go/Node)는 아직 미정 — mock 응답을 prod에서도 서빙해야 함

## Decision

**Vercel + GitHub 연동 + Vercel Serverless Function**

### 구조
```
yum/                            # GitHub repo
└── frontend/                   # Vercel Project Root Directory
    ├── api/
    │   └── restaurants.ts      # → /api/restaurants (Vercel serverless)
    ├── mock/
    │   └── restaurants.json    # function이 import해서 응답
    ├── src/                    # Svelte 앱
    └── dist/                   # vite build 결과 (정적 호스팅)
```

### 환경별 `/api/restaurants` 처리
| 환경 | 누가 처리하나 | 코드 |
| --- | --- | --- |
| 로컬 dev (`npm run dev`) | Vite middleware (ADR-0006) | `vite.config.ts` |
| Vercel preview/prod | Serverless function | `api/restaurants.ts` |
| 미래 (진짜 백엔드) | proxy → Go/Node 서버 | `vite.config.ts` 수정 |

→ **프론트 코드(`infrastructure/restaurant-api.ts`)는 어떤 환경에서도 동일** (갈아끼움 패턴 유지).

### Vercel 프로젝트 설정
- **Root Directory**: `frontend` (모노레포 대응)
- **Framework Preset**: Vite (자동 감지)
- **Build Command**: `npm run build` (자동)
- **Output Directory**: `dist` (자동)
- **Install Command**: `npm install` (자동)
- 커스텀 `vercel.json` **없음** — 기본값으로 충분

### Serverless Function 동작
- `frontend/api/restaurants.ts`가 `mock/restaurants.json`을 정적으로 import해서 그대로 응답
- 동작은 Vite middleware와 동일 (쿼리 파라미터는 일단 무시)
- 향후 lat/lng 필터링 같은 로직 추가 시 같은 파일에서 처리 가능

## Consequences

**긍정적**
- GitHub push → 자동 배포 (PR마다 preview URL)
- Mock JSON 한 군데, 두 환경(dev/prod)에서 공유
- "진짜 백엔드" 도입 시 함수만 옮기면 됨 — 단계적 전환 용이
- 무료 티어 충분 (토이 프로젝트 트래픽)

**부정적 / 주의사항**
- Vercel 프로젝트 생성 시 **Root Directory=`frontend`** 수동 설정 필수 (자동 안 됨)
- Vercel 외 호스팅으로 옮길 때 serverless function은 호환성 깨질 수 있음 (Vercel 전용 API)
- 서버리스 cold start (~수백 ms) — 토이 단계에선 무시 가능

## Open Questions
- 커스텀 도메인은 필요해지면 ADR로
- 환경 변수는 등장하면 ADR로 (현재 없음)

## References
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Monorepo](https://vercel.com/docs/monorepos)
- 관련 ADR: ADR-0005 (모노레포), ADR-0006 (Mock API 갈아끼움)
