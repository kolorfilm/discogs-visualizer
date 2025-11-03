import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'next-env.d.ts',
        'next.config.mjs',
        '.next/**',
        '**/node_modules/**',
        '**/libs/**',
        'coverage/**',
        '**/*.config.*',
        '**/setupTests.ts',
      ],
    },
    exclude: ['**/node_modules/**', '**/.next/**', '**/coverage/**'],
  },
  resolve: {
    alias: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  },
});
