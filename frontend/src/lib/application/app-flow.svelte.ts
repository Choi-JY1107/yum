import type { Coordinates } from '../domain/location';
import { DEFAULT_COORDINATES } from '../domain/location';
import { fetchRestaurants } from '../infrastructure/restaurant-api';
import { SwipeDeckStore } from './swipe-deck.svelte';

export type AppPhase = 'consent' | 'loading' | 'ready' | 'error';

export class AppFlowStore {
  phase = $state<AppPhase>('consent');
  errorMessage = $state<string | null>(null);
  deck = $state<SwipeDeckStore | null>(null);

  async grantLocation(coords: Coordinates = DEFAULT_COORDINATES): Promise<void> {
    this.phase = 'loading';
    this.errorMessage = null;
    try {
      const restaurants = await fetchRestaurants(coords);
      this.deck = new SwipeDeckStore(restaurants);
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
