import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'maplibre',
              test: /[\\/]node_modules[\\/]maplibre-gl[\\/]/,
              priority: 30,
            },
            {
              name: 'charts',
              test: /[\\/]node_modules[\\/](recharts|d3|d3-[^\\/]+|chart\.js|echarts)[\\/]/,
              priority: 25,
            },
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 5,
            },
          ],
        },
      },
    },
  },
});
