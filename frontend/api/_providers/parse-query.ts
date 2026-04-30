import type { Coordinates } from '../../src/lib/domain/location.js';

export interface ParsedRestaurantsQuery {
  readonly coords: Coordinates;
  readonly page: number;
  readonly categories: string[];
}

export type QueryGetter = (key: string) => string | null;

export type ParseResult =
  | { readonly ok: true; readonly query: ParsedRestaurantsQuery }
  | { readonly ok: false; readonly error: string };

// /api/restaurants 의 lat/lng/page/categories 를 단일 로직으로 파싱.
// Vercel function (req.query 객체) 와 Vite middleware (URLSearchParams) 양쪽이 공유.
export function parseRestaurantsQuery(get: QueryGetter): ParseResult {
  const latStr = get('lat');
  const lngStr = get('lng');
  const lat = latStr !== null ? Number(latStr) : NaN;
  const lng = lngStr !== null ? Number(lngStr) : NaN;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, error: 'lat and lng query params are required' };
  }

  const pageStr = get('page');
  const pageNum = pageStr !== null ? Number(pageStr) : 1;
  const page = Number.isFinite(pageNum) && pageNum >= 1 ? Math.floor(pageNum) : 1;

  const categoriesStr = get('categories');
  const categories =
    categoriesStr && categoriesStr.length > 0
      ? categoriesStr
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

  return {
    ok: true,
    query: { coords: { lat, lng }, page, categories },
  };
}
