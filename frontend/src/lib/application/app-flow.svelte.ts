import type { Coordinates } from '../domain/location';
import { DEFAULT_COORDINATES } from '../domain/location';
import type { ResponseMeta } from '../infrastructure/restaurant-api';
import { fetchRestaurants } from '../infrastructure/restaurant-api';
import { SwipeDeckStore } from './swipe-deck.svelte';

export type AppPhase = 'consent' | 'loading' | 'ready' | 'error';

export class AppFlowStore {
  phase = $state<AppPhase>('consent');
  errorMessage = $state<string | null>(null);
  deck = $state<SwipeDeckStore | null>(null);
  meta = $state<ResponseMeta | null>(null);

  async grantLocation(coords: Coordinates = DEFAULT_COORDINATES): Promise<void> {
    this.phase = 'loading';
    this.errorMessage = null;
    try {
      const result = await fetchRestaurants(coords);
      this.deck = new SwipeDeckStore(result.restaurants);
      this.meta = result.meta;
      this.phase = 'ready';
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      this.phase = 'error';
    }
  }

  retry(): void {
    void this.grantLocation();
  }
}
