import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Coordinates } from '../src/lib/domain/location.js';
import type { Restaurant } from '../src/lib/domain/restaurant.js';
import { getPhotoProvider, getRestaurantProvider } from './_providers/factory.js';

const SEARCH_LIMIT = 10;

function parseCoordinates(req: VercelRequest): Coordinates | null {
  const { lat, lng } = req.query;
  const parsedLat = typeof lat === 'string' ? Number(lat) : NaN;
  const parsedLng = typeof lng === 'string' ? Number(lng) : NaN;
  if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
    return { lat: parsedLat, lng: parsedLng };
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const coords = parseCoordinates(req);
  if (!coords) {
    res.status(400).json({ error: 'lat and lng query params are required' });
    return;
  }

  const restaurantProvider = getRestaurantProvider();
  const photoProvider = getPhotoProvider();

  const summaries = await restaurantProvider.search(coords, { limit: SEARCH_LIMIT });
  const photoUrls = await Promise.all(
    summaries.map((summary) => photoProvider.findPhotoUrl(summary.name)),
  );

  const restaurants: Restaurant[] = summaries.map((summary, i) => ({
    ...summary,
    imageUrl: photoUrls[i] ?? '',
  }));

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200).json({ restaurants });
}
