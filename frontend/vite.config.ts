import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { getPhotoProvider, getRestaurantProvider } from './api/_providers/factory.js';

const MOCK_LATENCY_MS = 400;
const SEARCH_LIMIT = 10;

function mockApi(): Plugin {
  return {
    name: 'yum:mock-api',
    configureServer(server) {
      server.middlewares.use('/api/restaurants', (req, res) => {
        void (async () => {
          await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

          const url = new URL(req.url ?? '', 'http://localhost');
          const latStr = url.searchParams.get('lat');
          const lngStr = url.searchParams.get('lng');
          const lat = latStr !== null ? Number(latStr) : NaN;
          const lng = lngStr !== null ? Number(lngStr) : NaN;

          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'lat and lng query params are required' }));
            return;
          }

          const restaurantProvider = getRestaurantProvider();
          const photoProvider = getPhotoProvider();

          const summaries = await restaurantProvider.search({ lat, lng }, { limit: SEARCH_LIMIT });
          const photoUrls = await Promise.all(
            summaries.map((summary) => photoProvider.findPhotoUrl(summary.name)),
          );

          const restaurants = summaries.map((summary, i) => ({
            ...summary,
            imageUrl: photoUrls[i] ?? '',
          }));

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ restaurants }));
        })();
      });
    },
  };
}

export default defineConfig({
  plugins: [svelte(), mockApi()],
});
