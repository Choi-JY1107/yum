import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Coordinates } from '../src/lib/domain/location.js';
import { buildRestaurantsResponse } from './_providers/build-response.js';

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

  try {
    const result = await buildRestaurantsResponse(coords);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('[api/restaurants] failed:', err);
    res.status(500).json({ error: message });
  }
}
