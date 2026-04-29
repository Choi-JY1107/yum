import type { PhotoProvider, RestaurantSummary } from './types.js';

const NAVER_API_URL = 'https://openapi.naver.com/v1/search/image.json';
const TIMEOUT_MS = 5000;

interface NaverImageItem {
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

export class NaverImagePhotoProvider implements PhotoProvider {
  readonly source = 'naver' as const;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
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
    return payload.items[0]?.link ?? null;
  }
}
