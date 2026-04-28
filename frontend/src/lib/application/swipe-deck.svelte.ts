import type { Restaurant } from '../domain/restaurant';
import type { SwipeDirection, SwipeResult } from '../domain/swipe';

const STACK_VISIBLE_COUNT = 3;

export class SwipeDeckStore {
  private readonly all: Restaurant[];
  private cursor = $state(0);
  private history = $state<SwipeResult[]>([]);

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

  get isFinished(): boolean {
    return this.cursor >= this.all.length;
  }

  get likedIds(): string[] {
    return this.history
      .filter((entry) => entry.direction === 'right')
      .map((entry) => entry.restaurantId);
  }

  swipe(direction: SwipeDirection): void {
    const target = this.all[this.cursor];
    if (!target) return;
    this.history = [...this.history, { restaurantId: target.id, direction, timestamp: Date.now() }];
    this.cursor += 1;
  }

  reset(): void {
    this.cursor = 0;
    this.history = [];
  }
}
