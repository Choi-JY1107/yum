import type { Restaurant } from '../domain/restaurant';
import type { Coordinates } from '../domain/location';

export type RestaurantSource = 'mock' | 'kakao';
export type PhotoSource = 'mock' | 'naver';

export interface ResponseMeta {
  readonly restaurantSource: RestaurantSource;
  readonly photoSource: PhotoSource;
  readonly hasMore: boolean;
}

export interface RestaurantsResponse {
  readonly restaurants: Restaurant[];
  readonly meta: ResponseMeta;
}

export async function fetchRestaurants(
  coords: Coordinates,
  page: number = 1,
): Promise<RestaurantsResponse> {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lng: String(coords.lng),
    page: String(page),
  });

  const response = await fetch(`/api/restaurants?${params}`);

  if (!response.ok) {
    throw new Error(`식당 목록을 불러오지 못했어요 (HTTP ${response.status})`);
  }

  return (await response.json()) as RestaurantsResponse;
}
