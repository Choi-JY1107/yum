import type { PhotoSource, RestaurantSource } from '../../src/lib/domain/api-contract.js';
import type { Coordinates } from '../../src/lib/domain/location.js';
import type { Restaurant } from '../../src/lib/domain/restaurant.js';

export type {
  PhotoSource,
  ResponseMeta,
  RestaurantSource,
} from '../../src/lib/domain/api-contract.js';

// Restaurant에서 imageUrl을 분리 — 사진은 PhotoProvider가 별도로 채운다.
export type RestaurantSummary = Omit<Restaurant, 'imageUrl'>;

export interface SearchOptions {
  readonly radiusMeters?: number;
  readonly limit?: number;
  readonly page?: number;
}

export interface SearchResult {
  readonly summaries: RestaurantSummary[];
  readonly hasMore: boolean;
}

export interface RestaurantProvider {
  readonly source: RestaurantSource;
  search(coords: Coordinates, opts?: SearchOptions): Promise<SearchResult>;
}

export interface PhotoProvider {
  readonly source: PhotoSource;
  // restaurant 전체를 받아 provider가 필요한 필드(name, signatureMenu 등)를 조합해 사용
  findPhotoUrl(restaurant: RestaurantSummary): Promise<string | null>;
}
