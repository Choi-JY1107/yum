import { MockPhotoProvider } from './mock-photo-provider.js';
import { MockRestaurantProvider } from './mock-restaurant-provider.js';
import type { PhotoProvider, RestaurantProvider } from './types.js';

// Phase 3에서 process.env.KAKAO_REST_API_KEY 분기 추가 → KakaoRestaurantProvider
export function getRestaurantProvider(): RestaurantProvider {
  return new MockRestaurantProvider();
}

// Phase 4에서 process.env.NAVER_CLIENT_ID 분기 추가 → NaverImagePhotoProvider
export function getPhotoProvider(): PhotoProvider {
  return new MockPhotoProvider();
}
