import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import solid from 'vite-plugin-solid';
import UnoCSS from '@unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    UnoCSS(),
    tanstackStart(),
    TanStackRouterVite({
      target: 'solid',
      autoCodeSplitting: true,
      routesDirectory: 'src/routes',
      generatedRouteTree: 'src/routeTree.gen.ts',
    }),
    solid({ ssr: true }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3001,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('solid-js')) return 'solid-vendor';
          if (id.includes('@tanstack/solid-router')) return 'tanstack-router';
        },
      },
    },
  },
});
