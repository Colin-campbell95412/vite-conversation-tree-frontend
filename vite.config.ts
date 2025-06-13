import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs', // Point to the renamed file
  },
  resolve: {
    alias: {
      'assets': path.resolve(__dirname, 'src/assets'),
      'components': path.resolve(__dirname, 'src/components'),
      'constants': path.resolve(__dirname, 'src/constants'),
      'layouts': path.resolve(__dirname, 'src/layouts'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'navigation': path.resolve(__dirname, 'src/navigation'),
      // 'redux': path.resolve(__dirname, 'src/redux'),
      'ajax': path.resolve(__dirname, 'src/ajax'),
    },
  },
});