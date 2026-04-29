import type { Coordinates } from '../../src/lib/domain/location.js';
import type { Restaurant } from '../../src/lib/domain/restaurant.js';

// Restaurant에서 imageUrl을 분리 — 사진은 PhotoProvider가 별도로 채운다.
export type RestaurantSummary = Omit<Restaurant, 'imageUrl'>;

export interface SearchOptions {
  readonly radiusMeters?: number;
  readonly limit?: number;
}

export interface RestaurantProvider {
  search(coords: Coordinates, opts?: SearchOptions): Promise<RestaurantSummary[]>;
}

export interface PhotoProvider {
  findPhotoUrl(query: string): Promise<string | null>;
}
