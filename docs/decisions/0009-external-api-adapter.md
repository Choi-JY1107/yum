# ADR-0009: 외부 API 통합 + Adapter 패턴

- **Status:** ✅ Accepted
- **Date:** 2026-04-29
- **References:** [research/api-pricing.md](../research/api-pricing.md), ADR-0006 (Mock API 갈아끼움)

## Context

mock 데이터(`api/_data.ts`)에서 실데이터로 전환한다.
사용자 확정 (research/api-pricing.md 기반):
- **식당 텍스트**: 카카오 로컬 (`category_group_code=FD6`)
- **음식 사진**: 네이버 이미지 검색 (식당명 키워드)

또 한 가지 요구:
> "Google 같은 경우에도 좋겠지만 일단 그거는 adapter 패턴으로 나중에 변경 가능하도록 하고."

→ 사진 provider는 추상화해, 미래에 Google Place Photos 등으로 **`api/restaurants.ts` 변경 0**으로 갈아끼울 수 있어야 한다.

## Decision

**두 개의 Provider 인터페이스로 외부 API를 추상화한다.**

### 인터페이스 (계약)
```ts
// frontend/api/_providers/types.ts
import type { Restaurant, Coordinates } from '...';

export interface RestaurantProvider {
  search(coords: Coordinates, opts?: SearchOptions): Promise<RestaurantSummary[]>;
}

export interface PhotoProvider {
  /** 식당명 등 키워드로 음식 사진 한 장. 못 찾으면 null. */
  findPhotoUrl(query: string): Promise<string | null>;
}

export interface SearchOptions {
  readonly radiusMeters?: number;
  readonly limit?: number;
}

/** Restaurant에서 imageUrl을 뺀 형태 — 사진은 PhotoProvider가 채움 */
export type RestaurantSummary = Omit<Restaurant, 'imageUrl'>;
```

### 구현체 매핑 (Phase 2~4에 단계별 도입)

| 인터페이스 | 구현체 | 역할 |
| --- | --- | --- |
| `RestaurantProvider` | `MockRestaurantProvider` | `_data.ts` 그대로 반환 (환경변수 미설정 fallback) |
| `RestaurantProvider` | `KakaoRestaurantProvider` | 카카오 카테고리 검색 호출 |
| `RestaurantProvider` | (미래) `GooglePlacesRestaurantProvider` | Google Places Nearby Search |
| `PhotoProvider` | `NullPhotoProvider` | 항상 null (사진 없는 카드 = 그라데이션 fallback) |
| `PhotoProvider` | `NaverImagePhotoProvider` | 네이버 이미지 검색 첫 결과 |
| `PhotoProvider` | (미래) `GooglePlacePhotoProvider` | Place Photos API |

### Factory (구현체 선택)
- `frontend/api/_providers/factory.ts`가 `process.env`를 읽어 적절한 구현체를 반환
- 환경변수 없으면 자동으로 Mock/Null fallback (ADR-0006 갈아끼움 패턴 그대로)
- `api/restaurants.ts`는 factory만 호출, 구체 서비스 모름

### 기존 자산 활용
- `Restaurant` 타입: `frontend/src/lib/domain/restaurant.ts` 그대로 사용 (도메인은 외부 변화에 무관)
- `Coordinates` 타입: `frontend/src/lib/domain/location.ts` 그대로
- `_data.ts`: 삭제 X — `MockRestaurantProvider`가 import해 fallback로 사용

## Consequences

**긍정적**
- `api/restaurants.ts`는 추상화에만 의존 → 외부 서비스 변경 시 핸들러 코드는 0줄 수정
- Mock fallback이 영구 자산화 → API 키 없는 환경에서도 항상 동작
- 새 provider 추가 시 factory에 한 줄만 — 폐쇄 원칙(OCP) 준수
- 테스트 시 Mock provider를 그대로 주입 가능

**부정적 / 주의**
- 추상화 비용 — 토이 프로젝트에 인터페이스 5개 + factory는 약간의 보일러플레이트
- 인터페이스는 한 번 정해지면 깨기 어려움. `RestaurantProvider.search` 시그니처가 잘못되면 모든 구현체 수정 필요
- 첫 구현체가 Kakao이므로, Kakao 응답 모양에 인터페이스가 부지불식간에 끌려갈 위험 — Google Places로 갈아끼울 때 불일치 발견 가능 (그땐 별도 ADR로 인터페이스 변경)

## Open Questions
- 사진 못 찾을 때 fallback UX: 그라데이션 + 텍스트만 vs 카드 자체 제외
  - 결정 보류 — Phase 4에서 실제 비율 보고 결정
- 카카오 응답에서 메뉴 정보가 없음 → `signatureMenu`는 우선 카카오 카테고리(예: "한식 > 비빔밥")로 채움
  - Phase 3에서 결정
