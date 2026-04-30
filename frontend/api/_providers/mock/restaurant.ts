import type { Coordinates } from '../../../src/lib/domain/location.js';
import { response } from '../../_data.js';
import type { RestaurantProvider, SearchOptions, SearchResult } from '../types.js';

export class MockRestaurantProvider implements RestaurantProvider {
  readonly source = 'mock' as const;

  async search(_coords: Coordinates, opts?: SearchOptions): Promise<SearchResult> {
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? response.restaurants.length;
    const start = (page - 1) * limit;
    const slice = response.restaurants.slice(start, start + limit);
    return {
      summaries: slice.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        distanceKm: r.distanceKm,
        signatureMenu: r.signatureMenu,
      })),
      hasMore: start + slice.length < response.restaurants.length,
    };
  }
}
