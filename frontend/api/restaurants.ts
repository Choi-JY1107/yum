import type { VercelRequest, VercelResponse } from '@vercel/node';
import { response } from './_data';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200).json(response);
}
