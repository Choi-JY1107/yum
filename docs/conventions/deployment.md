# 배포 가이드

> 결정 근거: [ADR-0008](../decisions/0008-vercel-deployment.md), [ADR-0009](../decisions/0009-external-api-adapter.md)

## TL;DR
GitHub에 푸시하면 Vercel이 자동 배포. 환경변수는 Vercel 대시보드에서.

```
git push
# → Vercel이 자동 빌드 → preview/prod 배포
```

---

## 1. 최초 1회 — Vercel 프로젝트 셋업
이미 셋업했으면 건너뜀.

1. https://vercel.com → 로그인 → "Add New Project" → GitHub 저장소 import
2. **Root Directory**: `frontend` ⚠️ 반드시 설정
3. Framework Preset: `Vite` (자동 감지됨)
4. Build/Output/Install 명령은 자동값 그대로 두기
5. Deploy

---

## 2. 환경변수 등록 (외부 API 키)

**Vercel 대시보드 → 프로젝트 → Settings → Environment Variables**

| 키 이름 | 값 | 환경 |
| --- | --- | --- |
| `KAKAO_REST_API_KEY` | 카카오 REST API 키 | Production + Preview + Development |
| `NAVER_CLIENT_ID` | 네이버 Application Client ID | Production + Preview + Development |
| `NAVER_CLIENT_SECRET` | 네이버 Application Client Secret | Production + Preview + Development |

> ✅ Production / Preview 둘 다 체크. PR마다 만들어지는 preview에서도 실 API 동작.
> ❌ "Sensitive" 토글 켜도 좋음 (값이 대시보드에서 마스킹됨).

**환경변수 추가 후 재배포 필수** — 기존 deployment은 옛 env로 돌고 있음. 대시보드에서 "Redeploy" 또는 새 commit push.

### 활성화 사전 작업 (제공자 콘솔)

#### 카카오
1. https://developers.kakao.com → 내 애플리케이션 → 앱
2. **앱 설정 → 플랫폼** → Web 플랫폼 등록 → 사이트 도메인에 Vercel 배포 URL 추가 (예: `https://yum-xxx.vercel.app`)
3. **제품 설정 → 카카오맵** → 활성화 ON ([D4 함정](../../CLAUDE.md#d4-외부-api-활성화-함정-kakao-콘솔) 참조)

#### 네이버
1. https://developers.naver.com → 애플리케이션 등록
2. 사용 API: **검색** 체크
3. 비로그인 오픈 API 서비스 환경: 사용 도메인에 배포 URL 추가

---

## 3. 배포 흐름
```
[git push origin main]
       ↓
[Vercel 자동 트리거]
       ↓
[npm install → vite build] (frontend/dist/)
       ↓
[api/*.ts → Serverless Function으로 transpile]
       ↓
[Production URL 갱신]
```

PR 푸시는 Preview URL 생성 (Production은 안 건드림).

---

## 4. 배포 후 동작 확인

### 빠른 점검 (curl)
```bash
curl -s "https://YOUR-PROJECT.vercel.app/api/restaurants?lat=37.5604&lng=126.8345" | python3 -m json.tool | tail -5
```

응답에 `"meta": {"restaurantSource": "kakao", "photoSource": "naver"}` 가 보이면 ✅
- `"mock"`이 보이면 → 환경변수 누락 또는 외부 API 실패. Vercel 함수 로그 확인.

### 함수 로그 (디버깅 필수 도구 — [D1 원칙](../../CLAUDE.md#d1-배포-런타임-에러는-추측-x-로그부터))
Vercel 대시보드 → 프로젝트 → Deployments → 최신 deployment → **Logs** 탭 또는 **Functions** 탭. `console.error/warn` 출력 모두 여기서 보인다.

---

## 5. 갈아끼움 (미래 백엔드 도입 시)
ADR-0006의 갈아끼움 패턴이 그대로 살아있다. 진짜 백엔드 서버를 띄울 때:

1. `backend/` 디렉토리에 Go/Node 서버 작성 (ADR-0010의 future migration path)
2. Vercel function `api/restaurants.ts` 제거 또는 proxy로 변경
3. 또는 별도 호스팅(Render/Fly.io)에 백엔드 띄우고 Vercel에서 rewrite/proxy

→ **프론트 코드(`src/`) 변경 0**. Adapter 인터페이스 + 갈아끼움 패턴 덕분.
