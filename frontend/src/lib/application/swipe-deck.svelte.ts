import type { Restaurant } from '../domain/restaurant';
import type { SwipeDirection, SwipeResult } from '../domain/swipe';

const STACK_VISIBLE_COUNT = 3;

export class SwipeDeckStore {
  private all = $state<Restaurant[]>([]);
  private cursor = $state(0);
  private history = $state<SwipeResult[]>([]);
  private stopped = $state(false);

  constructor(restaurants: Restaurant[]) {
    this.all = restaurants;
  }

  get current(): Restaurant | null {
    return this.all[this.cursor] ?? null;
  }

  get visibleStack(): Restaurant[] {
    return this.all.slice(this.cursor, this.cursor + STACK_VISIBLE_COUNT);
  }

  get remaining(): number {
    return this.all.length - this.cursor;
  }

  // 사용자가 카드 다 봤거나 명시적으로 그만하기 누른 상태 — 둘 다 KeptList로
  get isFinished(): boolean {
    return this.stopped || this.cursor >= this.all.length;
  }

  // 사용자가 명시적으로 그만한 경우 — prefetch trigger 차단용
  get isStopped(): boolean {
    return this.stopped;
  }

  get likedIds(): string[] {
    return this.history
      .filter((entry) => entry.direction === 'right')
      .map((entry) => entry.restaurantId);
  }

  get likedRestaurants(): Restaurant[] {
    const liked = this.likedIds;
    return this.all.filter((r) => liked.includes(r.id));
  }

  swipe(direction: SwipeDirection): void {
    const target = this.all[this.cursor];
    if (!target) return;
    this.history = [...this.history, { restaurantId: target.id, direction, timestamp: Date.now() }];
    this.cursor += 1;
  }

  append(more: Restaurant[]): void {
    if (more.length === 0) return;
    this.all = [...this.all, ...more];
  }

  // 사용자가 "그만하기" → stopped 플래그만 set. cursor 건드리면 prefetch가
  // remaining=0을 보고 다음 페이지를 자동 로드해버려서 안 멈춤.
  finishEarly(): void {
    this.stopped = true;
  }

  // 킵 리스트에서 식당 한 곳 삭제 (history의 right 엔트리 제거)
  unkeep(restaurantId: string): void {
    this.history = this.history.filter(
      (entry) => !(entry.direction === 'right' && entry.restaurantId === restaurantId),
    );
  }

  reset(): void {
    this.cursor = 0;
    this.history = [];
    this.stopped = false;
  }
}
