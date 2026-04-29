export interface Coordinates {
  readonly lat: number;
  readonly lng: number;
}

// 마곡중앙10로 70 (강서구 마곡동) — 토이 단계 고정 좌표
export const DEFAULT_COORDINATES: Coordinates = {
  lat: 37.5604,
  lng: 126.8345,
};
