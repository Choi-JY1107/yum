import type { VercelRequest, VercelResponse } from '@vercel/node';
import data from '../mock/restaurants.json';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200).json(data);
}
