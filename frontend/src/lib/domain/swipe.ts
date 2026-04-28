export type SwipeDirection = 'left' | 'right';

export interface SwipeResult {
  readonly restaurantId: string;
  readonly direction: SwipeDirection;
  readonly timestamp: number;
}

export const SWIPE_THRESHOLD_PX = 100;
export const SWIPE_VELOCITY_MIN = 0.3;
