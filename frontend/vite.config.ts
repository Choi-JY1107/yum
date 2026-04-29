import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { response } from './api/_data.js';

const MOCK_LATENCY_MS = 400;

function mockApi(): Plugin {
  const payload = JSON.stringify(response);
  return {
    name: 'yum:mock-api',
    configureServer(server) {
      server.middlewares.use('/api/restaurants', (_req, res) => {
        setTimeout(() => {
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
