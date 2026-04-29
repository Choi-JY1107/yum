import type { PhotoProvider, RestaurantSummary } from './types.js';

const NAVER_API_URL = 'https://openapi.naver.com/v1/search/image.json';
const TIMEOUT_MS = 5000;

export interface NaverImageItem {
  readonly title: string;
  readonly link: string;
  readonly thumbnail: string;
  readonly sizeheight: string;
  readonly sizewidth: string;
}

interface NaverImageSearchResponse {
  readonly total: number;
  readonly items: NaverImageItem[];
}

// 어떤 URL을 카드에 쓸지 결정하는 어댑터 — 나중에 갈아끼움 가능 (Adapter 패턴).
export type NaverImageUrlPicker = (item: NaverImageItem) => string | null;

// Naver CDN(search.pstatic.net)이 직접 호스팅하는 thumbnail 우선.
// 핫링크 차단(블로그·인스타 등 403)을 광범위하게 회피.
export const pickThumbnailFirst: NaverImageUrlPicker = (item) =>
  item.thumbnail || item.link || null;

// 큰 이미지가 필요할 때 (핫링크 위험 감수).
export const pickLinkFirst: NaverImageUrlPicker = (item) => item.link || item.thumbnail || null;

export class NaverImagePhotoProvider implements PhotoProvider {
  readonly source = 'naver' as const;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly urlPicker: NaverImageUrlPicker;

  constructor(
    clientId: string,
    clientSecret: string,
    urlPicker: NaverImageUrlPicker = pickThumbnailFirst,
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.urlPicker = urlPicker;
  }

  async findPhotoUrl(restaurant: RestaurantSummary): Promise<string | null> {
    // 식당명 + 메뉴를 같이 검색해 음식 사진 적중률 ↑
    const query = `${restaurant.name} ${restaurant.signatureMenu}`.trim();
    const params = new URLSearchParams({
      query,
      display: '1',
      sort: 'sim',
    });

    const response = await fetch(`${NAVER_API_URL}?${params.toString()}`, {
      headers: {
        'X-Naver-Client-Id': this.clientId,
        'X-Naver-Client-Secret': this.clientSecret,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Naver Image Search ${response.status}: ${body.slice(0, 200)}`);
    }

    const payload = (await response.json()) as NaverImageSearchResponse;
    const item = payload.items[0];
    return item ? this.urlPicker(item) : null;
  }
}
