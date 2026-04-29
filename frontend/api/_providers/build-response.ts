import type { Coordinates } from '../../src/lib/domain/location.js';
import type { Restaurant } from '../../src/lib/domain/restaurant.js';
import { getPhotoProvider, getRestaurantProvider } from './factory.js';
import { MockPhotoProvider } from './mock-photo-provider.js';
import { MockRestaurantProvider } from './mock-restaurant-provider.js';
import type {
  PhotoSource,
  ResponseMeta,
  RestaurantSource,
  RestaurantSummary,
  SearchResult,
} from './types.js';

const DEFAULT_LIMIT = 10;

export interface BuildOptions {
  readonly limit?: number;
  readonly page?: number;
}

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
  opts?: BuildOptions,
): Promise<RestaurantsResponse> {
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const page = opts?.page ?? 1;

  let restaurantProvider = getRestaurantProvider();
  let photoProvider = getPhotoProvider();
  let restaurantSource: RestaurantSource = restaurantProvider.source;
  const photoSource: PhotoSource = photoProvider.source;

  let result: SearchResult;
  try {
    result = await restaurantProvider.search(coords, { limit, page });
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
    result = await restaurantProvider.search(coords, { limit, page });
  }

  const summaries: RestaurantSummary[] = result.summaries;

  const settled = await Promise.allSettled(
    summaries.map((summary) => photoProvider.findPhotoUrl(summary)),
  );
  const photoUrls: (string | null)[] = settled.map((r, i) => {
    if (r.status === 'fulfilled') {
      return r.value;
    }
    console.warn(`[buildResponse] photo lookup failed for "${summaries[i]?.name}":`, r.reason);
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
      hasMore: result.hasMore,
    },
  };
}
