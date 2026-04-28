import type { Restaurant } from '../domain/restaurant';
import type { Coordinates } from '../domain/location';

interface RestaurantsResponse {
  restaurants: Restaurant[];
}

export async function fetchRestaurants(coords: Coordinates): Promise<Restaurant[]> {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lng: String(coords.lng),
  });

  const response = await fetch(`/api/restaurants?${params}`);

  if (!response.ok) {
    throw new Error(`식당 목록을 불러오지 못했어요 (HTTP ${response.status})`);
  }

  const body = (await response.json()) as RestaurantsResponse;
  return body.restaurants;
}
