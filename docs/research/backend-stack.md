# 백엔드 기술 스택 비교 — Node.js / Go / Rust

> **조사 일자**: 2026-04-29
> **목적**: Yum의 외부 API(카카오·네이버) 호출 + Adapter 패턴 구현을 어느 언어로 할지 결정
> **결정**: 🟡 **사용자가 이 문서를 보고 결정**. 추천은 마지막 섹션.

---

## Context

### 백엔드가 할 일 (Yum 기준)
1. 프론트가 `/api/restaurants?lat=…&lng=…`을 호출
2. 카카오 로컬 API에 좌표·반경 던지고 식당 N개 받기
3. 각 식당 이름으로 **네이버 이미지 검색을 N번 병렬 호출** (이게 요체 — 동시성 부담)
4. 카카오 결과 + 네이버 사진 URL을 합쳐 우리 `Restaurant` 타입으로 매핑
5. JSON 응답

→ 실제로는 **아주 단순한 API 게이트웨이**. 무거운 비즈니스 로직 없음. 외부 호출 + JSON 매핑이 전부.

### 호스팅 컨텍스트
현재 Vercel Serverless Function 사용 중 (ADR-0008). 백엔드 스택 선택은 호스팅 호환성과 직결:
- Vercel은 **Node.js, Python, Go, Ruby**를 1급 지원
- **Rust는 직접 미지원** — Edge에 WASM으로만 가능, 제약 큼

---

## 평가 축

| 축 | 의미 |
| --- | --- |
| **학습 곡선** | 처음부터 익히는 비용 (사용자 기준) |
| **외부 API 호출** | HTTP 클라이언트, 재시도, 타임아웃 처리 |
| **JSON 처리** | 카카오/네이버 응답 파싱 + 우리 타입으로 매핑 편의성 |
| **동시성 / 병렬** | 네이버 이미지 검색 N번 병렬 호출 (10~20 동시 fetch) |
| **호스팅 호환성** | 현재 Vercel 인프라 그대로 가능한가 |
| **생태계** | 라이브러리, 자료, 비공식 SDK |
| **콜드스타트** | Serverless 첫 요청 응답 시간 |
| **토이 프로젝트 적합도** | 빠른 완성 vs 학습 가치 |

---

## 1. Node.js (TypeScript)

> 한 줄 평: **"그대로 가면 가장 빠르다 — 하지만 학습 가치는 0"**

### 장점
- 🟢 **현재 스택 그대로** — frontend(Svelte+TS)와 같은 언어 → 컨텍스트 스위치 0
- 🟢 **타입 공유 가능** — `Restaurant` 같은 도메인 타입을 frontend/backend가 한 곳에서 import
- 🟢 **Vercel 1급 시민** — `@vercel/node` 그대로, 추가 설정 0
- 🟢 **fetch + Promise.all** 자연스러움 — 병렬 호출 한 줄로
- 🟢 **JSON 무료** — `JSON.parse` / spread 연산자로 매핑 부담 없음
- 🟢 **npm 생태계 풍부** — 카카오/네이버 비공식 SDK, 검증된 HTTP 클라이언트

### 단점
- 🔴 **콜드스타트 ~200~500ms** — Node 런타임 부팅 시간
- 🔴 **런타임 타입 안전성 약함** — TS는 컴파일 타임만, 외부 응답은 결국 `any`로 들어옴 (zod 같은 검증 라이브러리 별도)
- 🔴 **새로 배울 게 없음** — 사용자에게 학습 가치 X

### 코드 감각 (병렬 fetch)
```ts
const photos = await Promise.all(
  restaurants.map(r => naverImageSearch(r.name))
);
```

---

## 2. Go

> 한 줄 평: **"백엔드 학습 + Vercel 그대로 + 충분히 빠르다 — 균형"**

### 장점
- 🟢 **빠른 콜드스타트 ~10~50ms** — 단일 정적 바이너리, 메모리 사용량 ↓
- 🟢 **고루틴**으로 병렬 fetch 자연스러움 — `sync.WaitGroup` / `golang.org/x/sync/errgroup`
- 🟢 **Vercel `@vercel/go` 공식 지원** — 인프라 그대로 유지
- 🟢 **표준 라이브러리만으로 충분** — `net/http`, `encoding/json`. 외부 의존성 최소
- 🟢 **학습 곡선 완만** — Java/JS 개발자에게 친숙. 한 주면 익숙해짐
- 🟢 **타입 안정성** — 컴파일 타임 + 런타임 모두 강함 (struct 기반)
- 🟢 **단일 바이너리** — 배포·운영 단순

### 단점
- 🔴 **JSON 파싱은 struct 정의 필요** — 카카오 응답 필드 12개를 struct로 모두 선언해야 함 (보일러플레이트)
- 🔴 **frontend(TS) 타입 공유 불가** — 같은 도메인 타입을 두 언어로 두 번 정의 (스키마 drift 위험)
- 🔴 **에러 핸들링 verbose** — `if err != nil { ... }` 반복

### 코드 감각 (병렬 fetch)
```go
g, ctx := errgroup.WithContext(ctx)
photos := make([]string, len(restaurants))
for i, r := range restaurants {
    i, r := i, r
    g.Go(func() error {
        url, err := naverImageSearch(ctx, r.Name)
        photos[i] = url
        return err
    })
}
if err := g.Wait(); err != nil { return err }
```

---

## 3. Rust

> 한 줄 평: **"토이 백엔드엔 과스펙 + 호스팅 다시 잡아야 — 권장 X"**

### 장점
- 🟢 **성능·메모리 안전성 최고** — 가비지 컬렉터 없이 메모리 안전
- 🟢 **타입 시스템 가장 강력** — `Result<T, E>` `Option<T>` 같은 명시적 에러/null 처리
- 🟢 **WASM 컴파일** — Cloudflare Workers 등 엣지 컴퓨팅 가능
- 🟢 **학습 가치 가장 높음** — 소유권·라이프타임 패러다임 학습

### 단점
- 🔴 **Vercel 직접 미지원** — Edge에 WASM으로만 가능, 표준 함수 못 씀 → **호스팅 갈아엎어야 함** (Cloudflare Workers, Fly.io, Render 등)
- 🔴 **학습 곡선 가파름** — 소유권/라이프타임/borrow checker 적응에 시간
- 🔴 **빌드 시간 김** — `cargo build` 첫 빌드 수 분, CI/CD 사이클 ↑
- 🔴 **단순 API 게이트웨이엔 과도한 도구** — 우리가 하는 일은 외부 호출 + JSON 매핑. 안전성·성능 이점이 살지 않음
- 🔴 **JSON 파싱은 serde 의존** — 보일러플레이트는 Go보다 적지만 학습 부담 ↑

### 코드 감각 (병렬 fetch)
```rust
let photos: Vec<_> = futures::future::join_all(
    restaurants.iter().map(|r| naver_image_search(&r.name))
).await;
```

---

## 비교 표 (한눈에)

| 축 | Node.js (TS) | Go | Rust |
| --- | --- | --- | --- |
| 학습 곡선 | 🟢 (현재 스택) | 🟡 (1주) | 🔴 (수개월) |
| 외부 API 호출 | 🟢 fetch | 🟢 net/http | 🟢 reqwest |
| JSON 처리 | 🟢 무료 | 🟡 struct 선언 필요 | 🟡 serde 필요 |
| 동시성 / 병렬 | 🟢 Promise.all | 🟢 goroutine | 🟢 tokio |
| 호스팅 (Vercel) | 🟢 1급 | 🟢 1급 | 🔴 미지원 |
| 생태계 | 🟢 npm | 🟢 표준 라이브러리 강함 | 🟡 점점 풍부 |
| 콜드스타트 | 🟡 200~500ms | 🟢 10~50ms | 🟢 빠름 |
| Frontend와 타입 공유 | 🟢 가능 | 🔴 불가 | 🔴 불가 |
| 학습 가치 (사용자) | 🔴 거의 0 | 🟢 백엔드·동시성 새 패러다임 | 🟢 매우 높음 |
| 토이 프로젝트 ROI | 🟢 가장 높음 | 🟢 균형 | 🔴 낮음 |

---

## 추천 (의사결정 가이드)

### A. "빠르게 끝내고 다음 기능으로" → **Node.js (TS)**
- 현재 스택 그대로, frontend 타입을 그대로 import
- 새로 배울 거 없음 — 학습이 아닌 기능 완성이 목적이면 최선
- ADR-0008(Vercel) 인프라 0 변경

### B. "백엔드도 새로 배우고 싶다 + Vercel은 그대로" → **Go** ← 토이 프로젝트의 가장 큰 학습 ROI
- 콜드스타트·동시성·정적 타입 모두 좋음
- Vercel `@vercel/go`로 프론트와 같은 인프라
- LG CNS 환경 기준으로도 흔히 노출되는 언어 → 실무 가치도 ↑
- 단점은 frontend와 타입 공유 불가 — 스키마는 두 번 정의해야 함

### C. "장기 학습 프로젝트 + 인프라도 갈아엎을 의향" → Rust
- 단, Vercel 포기 + 호스팅 다시 결정 필요 (Cloudflare Workers / Fly.io 등)
- 토이 단계에선 권장 X. 별도의 학습 프로젝트로 분리 추천

### 핵심 트레이드오프
> **빠른 완성 vs 학습 가치**.
> Yum이 토이 프로젝트라는 점에서 어느 쪽에 비중을 두는지가 결정의 80%.

---

## 변경 이력
- **2026-04-29 초안**: Node/Go/Rust 비교. 사용자 결정 대기 중.
