import { response } from '../_data.js';
import type { PhotoProvider } from './types.js';

export class MockPhotoProvider implements PhotoProvider {
  readonly source = 'mock' as const;

  async findPhotoUrl(query: string): Promise<string | null> {
    const found = response.restaurants.find((r) => r.name === query);
    return found?.imageUrl ?? null;
  }
}
