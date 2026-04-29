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

// 외부 API 실패 시 자동 fallback 정책:
// - 식당 provider 실패 → 식당+사진 모두 mock으로 (banner 트리거)
// - 사진 provider 실패 (개별) → 해당 사진만 null (카드는 그대로, 빈 imageUrl)
// - 사진 provider 전체 실패라도 식당이 real이면 banner는 안 띄움 (식당 정보는 살아있으니)
export async function buildRestaurantsResponse(
  coords: Coordinates,
  limit: number = DEFAULT_LIMIT,
): Promise<RestaurantsResponse> {
  let restaurantProvider = getRestaurantProvider();
  let photoProvider = getPhotoProvider();
  let restaurantSource: RestaurantSource = restaurantProvider.source;
  const photoSource: PhotoSource = photoProvider.source;

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
    summaries = await restaurantProvider.search(coords, { limit });
  }

  const settled = await Promise.allSettled(
    summaries.map((summary) => photoProvider.findPhotoUrl(summary)),
  );
  const photoUrls: (string | null)[] = settled.map((result, i) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    console.warn(`[buildResponse] photo lookup failed for "${summaries[i]?.name}":`, result.reason);
    return null;
  });

  const restaurants: Restaurant[] = summaries.map((summary, i) => ({
    ...summary,
    imageUrl: photoUrls[i] ?? '',
  }));

  return {
    restaurants,
    meta: {
      restaurantSource,
      photoSource: restaurantSource === 'mock' ? 'mock' : photoSource,
    },
  };
}
