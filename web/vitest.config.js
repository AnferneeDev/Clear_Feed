import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: './src/tests/setup.js',
    // Make vitest's 'expect' and other functions available globally
    globals: true,
    // Use JSDOM to simulate a browser environment for tests
    environment: 'jsdom',
    // Point to a setup file if you have one (optional for now)
    // setupFiles: './src/test/setup.js',
  },
});
