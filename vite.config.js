import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function playboxHomepage() {
  return {
    name: 'playbox-homepage',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url === '/' || request.url?.startsWith('/?')) {
          request.url = `/playbox.html${request.url === '/' ? '' : request.url.slice(1)}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [playboxHomepage()],
  build: {
    rollupOptions: {
      input: {
        playbox: resolve(import.meta.dirname, 'playbox.html'),
        player: resolve(import.meta.dirname, 'player.html'),
        snake: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
});
