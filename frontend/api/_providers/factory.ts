import { KakaoRestaurantProvider } from './kakao-restaurant-provider.js';
import { MockPhotoProvider } from './mock-photo-provider.js';
import { MockRestaurantProvider } from './mock-restaurant-provider.js';
import type { PhotoProvider, RestaurantProvider } from './types.js';

// KAKAO_REST_API_KEY 있으면 실 카카오, 없으면 mock fallback (ADR-0006)
// 런타임 호출 실패 시 fallback은 build-response.ts 가 처리.
export function getRestaurantProvider(): RestaurantProvider {
  const apiKey = process.env.KAKAO_REST_API_KEY?.trim();
  if (apiKey && apiKey.length > 0) {
    return new KakaoRestaurantProvider(apiKey);
  }
  return new MockRestaurantProvider();
}

// Phase 4에서 NAVER_CLIENT_ID 분기 추가 → NaverImagePhotoProvider
export function getPhotoProvider(): PhotoProvider {
  return new MockPhotoProvider();
}
