import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { buildRestaurantsResponse } from './api/_providers/build-response.js';
import { parseRestaurantsQuery } from './api/_providers/parse-query.js';

// .env.local 을 process.env 로 로드 (Node 22+ 내장)
// 프로덕션(Vercel)에선 대시보드 환경변수가 자동 주입되므로 이 파일은 의미 없음.
try {
  process.loadEnvFile('.env.local');
} catch {
  // .env.local 없으면 무시 — factory가 자동으로 mock fallback
}

const MOCK_LATENCY_MS = 400;

function mockApi(): Plugin {
  return {
    name: 'yum:mock-api',
    configureServer(server) {
      server.middlewares.use('/api/restaurants', (req, res) => {
        void (async () => {
          try {
            await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

            const url = new URL(req.url ?? '', 'http://localhost');
            const parsed = parseRestaurantsQuery((key) => url.searchParams.get(key));

            if (!parsed.ok) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: parsed.error }));
              return;
            }

            const result = await buildRestaurantsResponse(parsed.query.coords, {
              page: parsed.query.page,
              categories: parsed.query.categories,
            });
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(result));
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Internal error';
            console.error('[mock-api] /api/restaurants failed:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: message }));
          }
        })();
      });
    },
  };
}

export default defineConfig({
  plugins: [svelte(), mockApi()],
});
