import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const MOCK_LATENCY_MS = 400;

function mockApi(): Plugin {
  const mockPath = resolve(__dirname, 'mock/restaurants.json');
  return {
    name: 'yum:mock-api',
    configureServer(server) {
      server.middlewares.use('/api/restaurants', (_req, res) => {
        setTimeout(() => {
          const payload = readFileSync(mockPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(payload);
        }, MOCK_LATENCY_MS);
      });
    },
  };
}

export default defineConfig({
  plugins: [svelte(), mockApi()],
});
