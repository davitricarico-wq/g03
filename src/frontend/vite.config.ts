import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // Pages serve sob um subcaminho (ex.: /grupo/projeto/). O job `pages` no
    // .gitlab-ci.yml define VITE_BASE_PATH a partir de $CI_PAGES_URL. Em dev fica '/'.
    base: process.env.VITE_BASE_PATH ?? '/',
    plugins: [
        react(),
        // PWA de verdade: service worker (Workbox) precacheia o app shell para
        // abrir/instalar SEM internet, e runtime-cache para fontes e tiles do mapa.
        // As chamadas a /api ficam de fora do cache de propósito: offline elas
        // falham e o app cai no fluxo de fila local (outbox).
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo-defesa-civil.png'],
            manifest: {
                name: 'GeoRisco - Defesa Civil',
                short_name: 'GeoRisco',
                description: 'Cadastro de famílias em áreas de risco — Defesa Civil de Santo André',
                lang: 'pt-BR',
                start_url: '.',
                scope: '.',
                display: 'standalone',
                orientation: 'portrait',
                background_color: '#ffffff',
                theme_color: '#0a3d62',
                icons: [
                    { src: 'logo-defesa-civil.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: 'logo-defesa-civil.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                    { src: 'logo-defesa-civil.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                navigateFallback: 'index.html',
                // navegações para /api nunca caem no app shell.
                navigateFallbackDenylist: [/^\/api\//],
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) =>
                            url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts',
                            expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    },
                    {
                        // tiles do mapa: cache grande para caber o mapa de Santo André
                        // pré-baixado (pré-download em utils/offlineMap.ts) + navegação.
                        urlPattern: ({ url }) => url.host.endsWith('tile.openstreetmap.org'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'osm-tiles',
                            expiration: { maxEntries: 3000, maxAgeSeconds: 60 * 60 * 24 * 180 },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    // `vite preview` serve o build de produção (onde o service worker roda).
    // Aqui o /api é encaminhado para o backend implantado, evitando CORS no
    // teste local do PWA. (Não afeta o build/deploy.)
    preview: {
        port: 4173,
        proxy: {
            '/api': {
                target: 'https://georisco.vercel.app',
                changeOrigin: true
            }
        }
    }
});
