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
  loadingMore = $state(false);

  private coords: Coordinates | null = null;
  private currentPage = 1;

  async grantLocation(coords: Coordinates = DEFAULT_COORDINATES): Promise<void> {
    this.phase = 'loading';
    this.errorMessage = null;
    this.coords = coords;
    this.currentPage = 1;
    try {
      const result = await fetchRestaurants(coords, 1);
      this.deck = new SwipeDeckStore(result.restaurants);
      this.meta = result.meta;
      this.phase = 'ready';
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      this.phase = 'error';
    }
  }

  async loadMore(): Promise<void> {
    if (!this.coords || !this.deck) return;
    if (!this.meta?.hasMore) return;
    if (this.loadingMore) return;

    this.loadingMore = true;
    try {
      const nextPage = this.currentPage + 1;
      const result = await fetchRestaurants(this.coords, nextPage);
      this.deck.append(result.restaurants);
      this.meta = result.meta;
      this.currentPage = nextPage;
    } catch (err) {
      console.error('[AppFlow] loadMore failed:', err);
      // loadMore 실패는 silent — 다음 swipe 시점에 재시도 trigger됨
    } finally {
      this.loadingMore = false;
    }
  }

  retry(): void {
    void this.grantLocation();
  }
}
