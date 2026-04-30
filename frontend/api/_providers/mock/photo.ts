import { response } from '../../_data.js';
import type { PhotoProvider, RestaurantSummary } from '../types.js';

export class MockPhotoProvider implements PhotoProvider {
  readonly source = 'mock' as const;

  async findPhotoUrl(restaurant: RestaurantSummary): Promise<string | null> {
    const found = response.restaurants.find((r) => r.name === restaurant.name);
    return found?.imageUrl ?? null;
  }
}
