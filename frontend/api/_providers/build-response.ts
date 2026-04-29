import type { Coordinates } from '../../src/lib/domain/location.js';
import type { Restaurant } from '../../src/lib/domain/restaurant.js';
import { getPhotoProvider, getRestaurantProvider } from './factory.js';
import { MockPhotoProvider } from './mock-photo-provider.js';
import { MockRestaurantProvider } from './mock-restaurant-provider.js';
import type { PhotoSource, ResponseMeta, RestaurantSource, RestaurantSummary } from './types.js';

const DEFAULT_LIMIT = 10;

export interface RestaurantsResponse {
  readonly restaurants: Restaurant[];
  readonly meta: ResponseMeta;
}

// 외부 API 실패 시 자동으로 mock으로 fallback (banner 트리거).
// 식당 provider 실패 → 식당+사진 모두 mock으로 폴백
// 사진 provider만 실패 → 사진만 mock으로 폴백
export async function buildRestaurantsResponse(
  coords: Coordinates,
  limit: number = DEFAULT_LIMIT,
): Promise<RestaurantsResponse> {
  let restaurantProvider = getRestaurantProvider();
  let photoProvider = getPhotoProvider();
  let restaurantSource: RestaurantSource = restaurantProvider.source;
  let photoSource: PhotoSource = photoProvider.source;

  let summaries: RestaurantSummary[];
  try {
    summaries = await restaurantProvider.search(coords, { limit });
  } catch (err) {
    if (restaurantProvider.source === 'mock') {
      throw err; // mock도 실패하면 진짜 버그
    }
    console.error(
      `[buildResponse] restaurant provider (${restaurantProvider.source}) failed, fallback to mock:`,
      err,
    );
    restaurantProvider = new MockRestaurantProvider();
    photoProvider = new MockPhotoProvider();
    restaurantSource = 'mock';
    photoSource = 'mock';
    summaries = await restaurantProvider.search(coords, { limit });
  }

  let photoUrls: (string | null)[];
  try {
    photoUrls = await Promise.all(
      summaries.map((summary) => photoProvider.findPhotoUrl(summary.name)),
    );
  } catch (err) {
    if (photoProvider.source === 'mock') {
      console.error('[buildResponse] mock photo provider failed:', err);
      photoUrls = summaries.map(() => null);
    } else {
      console.error(
        `[buildResponse] photo provider (${photoProvider.source}) failed, fallback to mock:`,
        err,
      );
      photoProvider = new MockPhotoProvider();
      photoSource = 'mock';
      photoUrls = await Promise.all(
        summaries.map((summary) => photoProvider.findPhotoUrl(summary.name)),
      );
    }
  }

  const restaurants: Restaurant[] = summaries.map((summary, i) => ({
    ...summary,
    imageUrl: photoUrls[i] ?? '',
  }));

  return {
    restaurants,
    meta: { restaurantSource, photoSource },
  };
}
