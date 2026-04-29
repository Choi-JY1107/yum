import type { Coordinates } from '../../src/lib/domain/location.js';
import { response } from '../_data.js';
import type { RestaurantProvider, RestaurantSummary, SearchOptions } from './types.js';

export class MockRestaurantProvider implements RestaurantProvider {
  async search(_coords: Coordinates, opts?: SearchOptions): Promise<RestaurantSummary[]> {
    const limit = opts?.limit ?? response.restaurants.length;
    return response.restaurants.slice(0, limit).map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      distanceKm: r.distanceKm,
      signatureMenu: r.signatureMenu,
    }));
  }
}
