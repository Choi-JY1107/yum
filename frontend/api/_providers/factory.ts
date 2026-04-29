import { KakaoRestaurantProvider } from './kakao-restaurant-provider.js';
import { MockPhotoProvider } from './mock-photo-provider.js';
import { MockRestaurantProvider } from './mock-restaurant-provider.js';
import { NaverImagePhotoProvider } from './naver-photo-provider.js';
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

// NAVER_CLIENT_ID + NAVER_CLIENT_SECRET 둘 다 있으면 네이버, 아니면 mock fallback
export function getPhotoProvider(): PhotoProvider {
  const clientId = process.env.NAVER_CLIENT_ID?.trim();
  const clientSecret = process.env.NAVER_CLIENT_SECRET?.trim();
  if (clientId && clientId.length > 0 && clientSecret && clientSecret.length > 0) {
    return new NaverImagePhotoProvider(clientId, clientSecret);
  }
  return new MockPhotoProvider();
}
