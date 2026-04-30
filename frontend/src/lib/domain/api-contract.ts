// API 응답 메타 — backend(api/_providers)와 frontend(infrastructure)가 공유.
// 한 곳(이 파일)에서만 정의해 drift 방지.

export type RestaurantSource = 'mock' | 'kakao';
export type PhotoSource = 'mock' | 'naver';

export interface ResponseMeta {
  readonly restaurantSource: RestaurantSource;
  readonly photoSource: PhotoSource;
  readonly hasMore: boolean;
}
