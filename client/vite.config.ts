import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/material/Unstable_Grid2'],
  },
  server: {
    proxy: {
      '/transactions': 'http://localhost:5000',
      // опционально для авторизации, если понадобится:
      '/auth': 'http://localhost:5000',
    },
  },
});
