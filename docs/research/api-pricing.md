# 외부 API 가격 조사 — 식당 검색 + 음식 사진

> **조사 일자**: 2026-04-29
> **목적**: Yum의 mock 데이터를 실데이터로 갈아끼우기 위한 외부 API 선택 근거 보존
> **결과 요약**: ✅ 카카오 로컬 (텍스트) + 네이버 이미지 검색 (사진) 채택. Google Places는 미래 옵션으로 보존.

---

## 🚨 절대 제약

> **사진은 반드시 "그 식당의 진짜 음식 사진"** 이어야 한다.
>
> Yum의 가치 명제는 "사진이 곧 서비스" (카드 90% 이상이 사진). 따라서 카테고리 기반 매칭 스톡 사진(Pexels, Unsplash, Pixabay 등)은 **검토 대상에서 일괄 제외**한다.

---

## 1. 식당 검색 API (텍스트 데이터)

| API | 무료 한도 | 한도 초과 가격 | 사진 응답 | 인증 | 한국 식당 데이터 |
| --- | --- | --- | --- | --- | --- |
| **카카오 로컬** ✅ | 키워드 100,000/일 + 카테고리 100,000/일, 월 통합 3,000,000 | 0.5–2 KRW/req | ❌ 없음 | `Authorization: KakaoAK ${REST_API_KEY}` | ⭐⭐⭐ 가장 풍부 |
| 네이버 지역 검색 | 검색 API 통합 25,000/일 | 무료, 한도 초과 시 차단 | ❌ 없음 | `X-Naver-Client-Id`, `X-Naver-Client-Secret` | ⭐⭐⭐ |
| Google Places (Pro) | 5,000 호출/월/SKU | Nearby Search Pro **$32/1k**, Place Details $17/1k, **Photos $7/1k** | ✅ `place_photos` (별도 호출) | API Key + 결제 카드 등록 | ⭐⭐ |

### 카카오 로컬 응답 필드 (사진 없음 직접 확인)
키워드 검색 / 카테고리 검색 응답의 `documents` 배열 한 항목:
```
id, place_name, category_name, category_group_code, category_group_name,
phone, address_name, road_address_name, x, y, place_url, distance
```
사진 URL이나 이미지 필드는 응답에 **포함되지 않음**.

### 출처
- 카카오 로컬 가이드: https://developers.kakao.com/docs/ko/local/dev-guide
- 카카오 쿼터 정책: https://developers.kakao.com/docs/ko/getting-started/quota
- 네이버 검색 오픈 API 목록: https://naver.github.io/naver-openapi-guide/apilist.html
- Google Maps Platform 가격: https://mapsplatform.google.com/pricing/
- Google Places 단가표: https://developers.google.com/maps/billing-and-pricing/pricing

---

## 2. "실제 식당 음식 사진" 확보 경로

위 1번에서 **카카오·네이버 텍스트 API는 사진 미제공**이므로, 사진은 별도 경로 필요.

| 경로 | 무료 한도 | 가격 | 실제 식당 사진? | 저작권 | 비고 |
| --- | --- | --- | --- | --- | --- |
| **네이버 이미지 검색** ✅ | 25,000/일 (검색 API 통합) | 무료 | ⚠️ 식당명 키워드 → 보통 그 식당 사진, 가끔 다른 가게/외관/간판 섞임 | ⚠️ 블로그·뉴스 무단 사용 → ToS 회색지대 | 토이·개인용은 실용적, 공개 배포 시 리스크 |
| Google Place Photos (미래 옵션) | 5,000/월 | $7/1k | ✅ 정식 (식당주·이용자 업로드) | ✅ Maps Platform ToS 내 안전 | 진입 장벽: 결제 카드 등록 |

### 검토에서 제외된 옵션 (이유 명시)
- **Pexels API** (200/시간, 20,000/월 무료): ❌ 스톡 사진. 그 식당의 사진이 아님. 제약 위배.
- **Unsplash API** (Demo 50/시간, Production 5,000/시간 무료): ❌ 스톡 사진. 동일 사유.
- **Google Custom Search JSON API**: 100/일 무료, $5/1k. 신규 가입 불가, 2027-01-01 단종 예정. 권장 X.

### 출처
- 네이버 이미지 검색 (오픈 API 목록 안에): https://naver.github.io/naver-openapi-guide/apilist.html
- Google Custom Search 단종 공지: https://developers.google.com/custom-search/v1/overview

---

## 3. Google Places 비용 시뮬레이션 (미래 비교용)

만약 나중에 사진 정확도/저작권을 위해 Google Places로 갈아끼운다면:
- 검색 1회 = Nearby Search 1회 + 사진 10장 (식당 10개, 각 1장 사용 가정)
- 단가: $0.032 + 10 × $0.007 = **약 $0.10/검색** (~140 KRW)
- 무료 5,000 호출/월 ÷ 검색당 ~11 호출 ≈ **월 ~450회 검색까지 무료**
- 신규 가입 $300 trial credit (90일)

토이 사용 (월 100~200회 검색)에선 무료 한도 안에서 충분.

---

## 4. 결정 (사용자 확정)

### 채택
- **식당 텍스트 데이터**: 카카오 로컬 (`category_group_code=FD6` 음식점)
  - 이유: 무료 한도가 가장 넉넉, 한국 식당 데이터 가장 풍부
- **사진**: 네이버 이미지 검색 (식당명 키워드)
  - 이유: 무료 + "그 식당의 진짜 사진" 요구를 만족하는 무료 옵션은 사실상 이것뿐
  - 한계: 첫 결과가 항상 그 식당 음식이라는 보장 X, 저작권 회색지대 → 토이·학습 단계라 수용

### Adapter 패턴 명시
사진 provider는 **인터페이스로 추상화**하여 나중에 갈아끼울 수 있게 한다:
- 인터페이스 예: `PhotoProvider.findPhotoUrl(query: string): Promise<string | null>`
- 구현체: `NaverImagePhotoProvider` (지금) → `GooglePlacePhotoProvider` (미래)
- 식당 검색도 동일 패턴: `RestaurantProvider.search(coords): Promise<Restaurant[]>`

> Adapter 인터페이스 정의·구현은 ADR-0009 + 실제 구현 단계에서.

---

## 5. 사용자 손 작업 (구현 단계 진입 시)

1. **카카오 디벨로퍼스** 가입 → 앱 등록 → REST API 키 발급
   - https://developers.kakao.com → 앱 만들기 → "내 애플리케이션" → 앱 키 → REST API 키
2. **네이버 개발자 센터** 가입 → 앱 등록 → Client ID/Secret 발급, 검색 API 사용 권한 신청
   - https://developers.naver.com → "애플리케이션 등록" → 사용 API: `검색`
3. 발급된 키를 **Vercel 프로젝트 → Settings → Environment Variables**에 등록 (Production + Preview):
   - `KAKAO_REST_API_KEY`
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
4. 로컬 `frontend/.env.local`에도 동일 키 (개발용, `.gitignore` 처리)

---

## 6. 변경 이력
- **2026-04-29 초안**: 카카오 + 네이버 이미지 채택. 스톡 사진(Pexels/Unsplash) 검토 X.
