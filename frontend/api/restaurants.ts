import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildRestaurantsResponse } from './_providers/build-response.js';
import { parseRestaurantsQuery } from './_providers/parse-query.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const parsed = parseRestaurantsQuery((key) => {
    const v = req.query[key];
    return typeof v === 'string' ? v : null;
  });

  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  try {
    const result = await buildRestaurantsResponse(parsed.query.coords, {
      page: parsed.query.page,
      categories: parsed.query.categories,
    });
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('[api/restaurants] failed:', err);
    res.status(500).json({ error: message });
  }
}
