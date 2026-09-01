import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // the renders are already compressed; don't let Vite inline any of them
    assetsInlineLimit: 0,
  },
});
