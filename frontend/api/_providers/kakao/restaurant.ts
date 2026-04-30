import type { Coordinates } from '../../../src/lib/domain/location.js';
import type {
  RestaurantProvider,
  RestaurantSummary,
  SearchOptions,
  SearchResult,
} from '../types.js';

const KAKAO_API_URL = 'https://dapi.kakao.com/v2/local/search/category.json';
const FOOD_CATEGORY_CODE = 'FD6'; // 음식점
const DEFAULT_RADIUS_M = 1000;
const TIMEOUT_MS = 5000;

interface KakaoDocument {
  readonly id: string;
  readonly place_name: string;
  readonly category_name: string;
  readonly category_group_code: string;
  readonly category_group_name: string;
  readonly phone: string;
  readonly address_name: string;
  readonly road_address_name: string;
  readonly x: string; // longitude
  readonly y: string; // latitude
  readonly place_url: string;
  readonly distance: string; // meters
}

interface KakaoCategoryResponse {
  readonly documents: KakaoDocument[];
  readonly meta: {
    readonly total_count: number;
    readonly pageable_count: number;
    readonly is_end: boolean;
  };
}

export class KakaoRestaurantProvider implements RestaurantProvider {
  readonly source = 'kakao' as const;
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(coords: Coordinates, opts?: SearchOptions): Promise<SearchResult> {
    const params = new URLSearchParams({
      category_group_code: FOOD_CATEGORY_CODE,
      x: String(coords.lng),
      y: String(coords.lat),
      radius: String(opts?.radiusMeters ?? DEFAULT_RADIUS_M),
      sort: 'distance',
      size: String(opts?.limit ?? 10),
      page: String(opts?.page ?? 1),
    });

    const response = await fetch(`${KAKAO_API_URL}?${params.toString()}`, {
      headers: { Authorization: `KakaoAK ${this.apiKey}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Kakao Local API ${response.status}: ${body.slice(0, 200)}`);
    }

    const payload = (await response.json()) as KakaoCategoryResponse;
    return {
      summaries: payload.documents.map((doc) => this.toSummary(doc)),
      hasMore: !payload.meta.is_end,
    };
  }

  // 카카오 category_name 예: "음식점 > 한식 > 비빔밥"
  // → category="한식" (중간), signatureMenu="비빔밥" (끝)
  private toSummary(doc: KakaoDocument): RestaurantSummary {
    const parts = doc.category_name.split(' > ').filter(Boolean);
    const category = parts[1] ?? doc.category_group_name;
    const signatureMenu = parts.length > 0 ? parts[parts.length - 1] : doc.place_name;
    const distanceKm = Math.round((Number(doc.distance) / 1000) * 10) / 10;
    return {
      id: doc.id,
      name: doc.place_name,
      category: category ?? '음식점',
      distanceKm: Number.isFinite(distanceKm) ? distanceKm : 0,
      signatureMenu: signatureMenu ?? doc.place_name,
    };
  }
}
