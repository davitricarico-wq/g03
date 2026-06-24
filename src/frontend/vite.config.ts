import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // Pages serve sob um subcaminho (ex.: /grupo/projeto/). O job `pages` no
    // .gitlab-ci.yml define VITE_BASE_PATH a partir de $CI_PAGES_URL. Em dev fica '/'.
    base: process.env.VITE_BASE_PATH ?? '/',
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});
