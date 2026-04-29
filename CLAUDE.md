# CLAUDE.md — Yum 프로젝트 작업 규칙

> 이 문서는 Claude가 이 프로젝트에서 작업할 때 항상 따라야 하는 **불변 규칙**을 모은 곳입니다.
> 사용자가 새로운 규칙·요구사항을 주면 즉시 이 문서에 추가하거나 별도 md로 분리해 링크합니다.

---

## 📋 핵심 규칙 (사용자 지시)

### R1. 문서화는 무조건이다
- 모든 작업 규칙·사용자 요구사항은 **이 CLAUDE.md**에 기록한다.
- 의사결정·규칙·컨벤션은 별도 `.md` 파일로 분리해 보존한다 (구조는 아래 참고).
- "기억해서 적용"은 금지. **반드시 문서로 남긴다.**

### R2. 의사결정은 ADR 형식으로 박는다
- 기술 선택, 아키텍처 결정, MVP 스코프 변경 등은 `docs/decisions/NNNN-제목.md`에 기록한다.
- 형식: `Context → Decision → Consequences` (간결한 ADR).

### R3. 클린 아키텍처 + 클린 코드
- 가이드: [`docs/conventions/clean-architecture.md`](./docs/conventions/clean-architecture.md)
- 핵심: **관심사 분리**, 의존성은 안쪽으로만 흐른다, 비즈니스 로직은 프레임워크에 의존하지 않는다.

### R4. 프론트엔드는 BEM 방법론
- 가이드: [`docs/conventions/bem.md`](./docs/conventions/bem.md)
- 형식: `block__element--modifier`.
- Svelte 컴포넌트의 `<style>` 블록 안에서도 BEM 클래스명을 사용한다.

### R5. 협업 원칙
- **기술 스택과 MVP 스코프는 사용자와 함께 결정**한다. 임의 추천·확장 금지.
- 스코프 확장 의심 시 작업 전에 사용자에게 확인한다.

### R6. Lint & Format은 자동 도구에 위임
- 가이드: [`docs/conventions/lint-format.md`](./docs/conventions/lint-format.md)
- 코드 작성 후: `npm run format && npm run lint`
- 스타일 논쟁 금지 — Prettier 결정에 따른다.

### R7. 커밋은 사용자 승인 후에만
- 단계 완료·빌드 통과 시점에도 **자동 커밋 금지**.
- 작업이 끝나면 `git status --short`로 변경사항을 보여주고 **검사 요청** → 사용자 "ok/ㄱㄱ/커밋해" 등 명시 승인 후에만 `git commit` 실행.
- `git push`도 동일.

### R8. dev 서버·장기 실행 서비스는 사용자가 직접 실행
- `npm run dev`, `vercel dev` 등 **절대 자동 실행 금지** (background/foreground 모두).
- 정적 검증(`npm run check / lint / format / build`)만 자동 OK — 종료하는 명령만 실행.
- 동작 확인이 필요하면 사용자에게 "dev 서버 띄워달라"고 요청하고 결과 받기.

---

## 🗂️ 프로젝트 구조

```
yum/
├── CLAUDE.md                      ← 너 (지금 이 파일)
├── prototype.png                  ← UI 프로토타입
├── docs/                          ← 프로젝트 전체 문서
│   ├── README.md                  ← 문서 인덱스
│   ├── decisions/                 ← ADR (의사결정 기록)
│   │   └── NNNN-*.md
│   └── conventions/               ← 코딩·아키텍처 규칙
│       ├── clean-architecture.md
│       └── bem.md
├── frontend/                      ← Svelte 5 + Vite + TS (ADR-0005, Vercel Project Root)
│   ├── api/                       ← Vercel Serverless Functions (ADR-0008)
│   │   ├── restaurants.ts         ← /api/restaurants 핸들러
│   │   ├── _data.ts               ← 장난스러운 mock fallback 데이터
│   │   └── _providers/            ← Adapter 패턴 (ADR-0009)
│   │       ├── types.ts           ← RestaurantProvider, PhotoProvider 인터페이스
│   │       ├── factory.ts         ← env 기반 구현체 선택 (Kakao/Naver/Mock)
│   │       ├── build-response.ts  ← 응답 빌더 + 런타임 fallback 오케스트레이션
│   │       ├── kakao-restaurant-provider.ts
│   │       ├── naver-photo-provider.ts
│   │       ├── mock-restaurant-provider.ts
│   │       └── mock-photo-provider.ts
│   ├── .env.example               ← API 키 템플릿 (.env.local로 복사 후 채움)
│   ├── vite.config.ts             ← dev: mock middleware (build-response.ts 공유)
│   └── src/
│       └── lib/
│           ├── domain/            ← 순수 타입·규칙
│           ├── application/       ← 유스케이스 + 화면 상태머신
│           ├── infrastructure/    ← API 클라이언트 (fetch)
│           ├── styles/            ← global.css (디자인 토큰)
│           └── ui/                ← Svelte 컴포넌트
└── backend/                       ← Go 또는 Node.js (다음 단계)
```

승인된 기획안은 외부 plan 파일에 있음:
- `/Users/JY/.claude/plans/sleepy-weaving-waffle.md`

---

## 🚦 현재 상태 (스냅샷)

- **실데이터 연동 완료** ✅ (Phase 1~4) — 카카오 식당 + 네이버 사진 + Adapter + mock fallback + 배너
- **MVP 1차 구현 완료** ✅ — 위치 동의 → API 호출 → 스와이프 카드 (`cd frontend && npm run dev` → http://localhost:5173)
- **MVP 스코프:** 스와이프 탐색 화면 1개만 (위치 동의 + 로딩 + 에러 + 임시데이터 배너)
- **플랫폼:** 모바일 웹 (반응형)
- **프론트엔드:** **Svelte 5 + Vite + TypeScript** (ADR-0001, 0004 ✅)
- **디렉토리:** **모노레포** `frontend/` + `backend/` (ADR-0005 ✅)
- **스타일링:** **순수 CSS + Svelte `<style>` + BEM** (Tailwind 미사용, ADR-0002 ✅)
- **카드 스와이프 제스처:** **`svelte-gestures` 5.x + Svelte `spring`/`tweened`** (ADR-0003 ✅)
- **페이지 전환(SSGOI):** ⏸️ **보류** — 라우터 도입 시점에 재검토
- **Mock API:** Vite middleware + Vercel function이 같은 모듈(`api/_data.ts`) import (ADR-0006 ✅)
- **외부 API:** 카카오 로컬(식당 텍스트) + 네이버 이미지(음식 사진), **Adapter 패턴**으로 추상화 (ADR-0009 ✅) — 환경변수 없거나 호출 실패 시 자동 mock fallback + 노란 배너
- **백엔드 스택:** **Node.js (TS) on Vercel Serverless** (ADR-0010 ✅) — Go 옵션은 미래 마이그레이션 경로로 보존
- **Lint/Format:** **ESLint 10 + Prettier 3** (Svelte/TS 플러그인, ADR-0007 ✅) — `npm run lint`, `npm run format`
- **배포:** **Vercel + GitHub + Serverless Function** (ADR-0008 ✅)
- **고정 위치 (토이 단계):** 마곡중앙10로 70 (lat 37.5604, lng 126.8345)

> 이 스냅샷은 결정이 바뀔 때마다 갱신한다. 상세 근거는 `docs/decisions/`를 본다.

---

## 🐛 함정·노하우 (실패에서 배운 것들)

### D1. 배포·런타임 에러는 추측 X, 로그부터
- 빌드 로그(Vercel Deployments)와 함수 런타임 로그를 **먼저** 본다.
- "원인일 것 같다" 추측으로 고치고 푸시하면 시간만 낭비된다 — Mock API 배포에서 세 번 헛걸음한 이력 있음.
- 사용자가 500/에러를 알리면 → 즉시 로그 요청.

### D2. Vercel Serverless Function 함정 (TS + api/)
- **모든 의존성은 `api/` 안에 둔다** — 외부 디렉토리는 transpile·번들 X.
- **import 경로에 `.js` 확장자 명시** — NodeNext 리졸션 강제 (소스가 `.ts`여도 `from './foo.js'`).
- **JSON 직접 import 금지** — Node 22 ESM에서 `import attribute` 없이 실패. TS 모듈로 데이터 export.
- **언더스코어(`_`) prefix** = "라우트로 노출하지 않음" (예: `api/_data.ts`).
- 상세: [ADR-0006](./docs/decisions/0006-mock-api-strategy.md), [ADR-0008](./docs/decisions/0008-vercel-deployment.md).

### D3. Mock 데이터 갈아끼움 — 현재 구조
- 단일 진실: `frontend/api/_data.ts` (TS 모듈, `response` export) + `_providers/`.
- dev: `vite.config.ts`의 mock middleware → `buildRestaurantsResponse()`.
- prod: `api/restaurants.ts` (Vercel function) → 동일 함수.
- → 프론트 코드(`infrastructure/restaurant-api.ts`)는 환경 무관 동일.

### D4. 외부 API 활성화 함정 (Kakao 콘솔)
- 카카오 REST API 키만 발급해도 **403 NotAuthorizedError "App disabled OPEN_MAP_AND_LOCAL service"** 떨어진다.
- 해결: developers.kakao.com → 내 애플리케이션 → **제품 설정 → 카카오맵** 활성화 토글 ON.
- 키 발급 ≠ 서비스 활성화. 별도 절차 필요한 카카오 제품들이 있다.

### D5. 외부 API는 서버에서만 호출 — 키 절대 클라이언트 노출 X
- 모든 외부 API 호출은 `frontend/api/` 안 (Vercel Serverless Function 또는 Vite middleware).
- 환경변수(`KAKAO_REST_API_KEY`, `NAVER_CLIENT_ID/SECRET`)는 `process.env`로만 접근 — 브라우저에서는 undefined.
- 브라우저 DevTools Network 탭에 **`dapi.kakao.com`이나 `openapi.naver.com`이 보이면 잘못 짠 것**.
- 정상: `/api/restaurants` 한 줄만 보임.

### D6. 카카오 502 BadGateway는 일시 글리치
- 우리 코드 문제 아님. 카카오 게이트웨이 일시 장애.
- `build-response.ts`의 fallback이 자동으로 mock 전환 → 사용자에겐 배너 + 임시 카드.
- 1~2분 후 새로고침으로 복구. 지속되면 Kakao 데브톡 확인.
