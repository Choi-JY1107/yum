# ADR-0006: Mock API 전략 — Vite Middleware + 갈아끼움

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

프론트엔드는 식당 데이터를 **서버에서 받아오는 형태**로 작성한다.
하지만 백엔드는 아직 미정 (ADR-0005에서 backend 결정 보류).
또한 사용자 요구: **"목 데이터든 실데이터든 프론트 입장에서 쉽게 갈아끼울 수 있어야 한다"**.

즉, **프론트 코드 변경 0**으로 mock과 real을 전환할 수 있어야 한다.

## Decision

**Vite middleware + 갈아끼움 패턴**.

### 패턴
- 프론트는 항상 동일한 상대 경로로 호출: `fetch('/api/restaurants?lat=…&lng=…')`
- `vite.config.ts`만 갈아끼워서 mock ↔ real 전환:

| 단계 | vite.config.ts 설정 | 결과 |
| --- | --- | --- |
| **현재** (mock) | 커스텀 plugin이 `/api/*` 가로채서 `mock/restaurants.json` 응답 | 백엔드 없이 동작 |
| **백엔드 도입 시** | plugin 제거 + `server.proxy: { '/api': 'http://localhost:8080' }` | 진짜 Go/Node 서버로 forward |
| **프로덕션** | 정적 빌드 + reverse proxy(nginx 등)가 `/api` forward | 동일한 상대 경로 유지 |

### 디렉토리 구조
```
frontend/
├── mock/
│   └── restaurants.json     # 서버 응답 페이로드 (프론트 번들에 포함 X)
├── src/
│   └── lib/infrastructure/
│       └── restaurant-api.ts # fetch 클라이언트 (도메인 코드 변경 시 여기만)
└── vite.config.ts            # mock plugin 또는 server.proxy 스위치
```

### API 계약 (이번 단계)
- **GET** `/api/restaurants?lat={number}&lng={number}`
- **응답 200**: `{ "restaurants": Restaurant[] }`
- **응답 5xx**: 에러 (프론트는 재시도 버튼 노출)

응답 형태는 백엔드 도입 시 동일하게 유지한다 (계약 고정).

## Consequences

**긍정적**
- 프론트 입장에서 mock/real 구분 불필요 — 항상 같은 fetch
- 백엔드 도입 시 프론트 코드는 **0줄 변경**
- mock 데이터가 `src/` 밖에 있어 프로덕션 번들에 자동 제외
- API 계약을 ADR로 박아 앞으로 백엔드 작성 시 가이드 됨

**부정적**
- mock middleware는 **dev 서버에서만 작동** — `vite build` 결과물엔 없음 (의도된 것)
- vite.config.ts가 약간 복잡해짐 (plugin 함수 1개 추가)
- `vite.config.ts` 변경 시 **dev 서버 재시작 필요** (HMR 안 됨)

## 갈아끼우는 절차 (미래)

진짜 백엔드(Go/Node)가 준비되면:

1. 백엔드 서버를 `http://localhost:8080`에서 실행 (포트는 ADR로 박을 예정)
2. `vite.config.ts` 수정:
   ```ts
   // 제거: mockApi() plugin
   // 추가:
   server: {
     proxy: { '/api': 'http://localhost:8080' }
   }
   ```
3. `mock/restaurants.json` 삭제 또는 보존(테스트용)
4. 프론트 코드: **변경 없음**

## References

- 관련 ADR: ADR-0005 (모노레포 구조)
- Vite Server Options: https://vite.dev/config/server-options.html
