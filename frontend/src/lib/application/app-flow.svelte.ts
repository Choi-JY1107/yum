import type { Category } from '../domain/category';
import type { Coordinates } from '../domain/location';
import { DEFAULT_COORDINATES } from '../domain/location';
import {
  GeolocationError,
  getCurrentLocation,
  type GeolocationFailureReason,
} from '../infrastructure/geolocation';
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

  // 실 위치 못 가져왔을 때 default(마곡)로 fallback했음을 표시
  usedFallbackLocation = $state(false);
  locationFallbackReason = $state<GeolocationFailureReason | null>(null);

  // 빈 배열 = 필터 없음 (전체). consent 페이지에서만 변경 가능.
  selectedCategories = $state<Category[]>([]);

  private coords: Coordinates | null = null;
  private currentPage = 1;

  async grantLocation(): Promise<void> {
    this.phase = 'loading';
    this.errorMessage = null;
    this.usedFallbackLocation = false;
    this.locationFallbackReason = null;
    this.currentPage = 1;

    const coords = await this.resolveCoordinates();
    this.coords = coords;

    try {
      const result = await fetchRestaurants(coords, {
        page: 1,
        categories: this.selectedCategories,
      });
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
      const result = await fetchRestaurants(this.coords, {
        page: nextPage,
        categories: this.selectedCategories,
      });
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

  // consent 페이지에서만 호출됨. 그냥 상태만 갱신, fetch는 grantLocation이 담당.
  toggleCategory(category: Category): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== category);
    } else {
      this.selectedCategories = [...this.selectedCategories, category];
    }
  }

  clearCategories(): void {
    if (this.selectedCategories.length === 0) return;
    this.selectedCategories = [];
  }

  retry(): void {
    void this.grantLocation();
  }

  // 실 geolocation 시도. 실패 시 default 좌표로 fallback (UI 배너로 알림).
  private async resolveCoordinates(): Promise<Coordinates> {
    try {
      return await getCurrentLocation();
    } catch (err) {
      const reason: GeolocationFailureReason =
        err instanceof GeolocationError ? err.reason : 'unavailable';
      console.warn(`[AppFlow] geolocation failed (${reason}), using default:`, err);
      this.usedFallbackLocation = true;
      this.locationFallbackReason = reason;
      return DEFAULT_COORDINATES;
    }
  }
}
