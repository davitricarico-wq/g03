import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const localApiTarget = process.env.VITE_PREVIEW_API_TARGET ?? 'http://localhost:3000';

export default defineConfig({
    // Pages serve sob um subcaminho (ex.: /grupo/projeto/). O job `pages` no
    // .gitlab-ci.yml define VITE_BASE_PATH a partir de $CI_PAGES_URL. Em dev fica '/'.
    base: process.env.VITE_BASE_PATH ?? '/',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                id: '.',
                name: 'GeoRisco - Defesa Civil',
                short_name: 'GeoRisco',
                description: 'Cadastro de familias em areas de risco com uso em campo, mapa e suporte offline.',
                lang: 'pt-BR',
                start_url: '.',
                scope: '.',
                display: 'standalone',
                orientation: 'portrait',
                background_color: '#ffffff',
                theme_color: '#0a3d62',
                categories: ['productivity', 'utilities', 'navigation'],
                icons: [
                    { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                    { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ],
                shortcuts: [
                    {
                        name: 'Novo cadastro',
                        short_name: 'Cadastro',
                        description: 'Abrir o cadastro de familia e moradia',
                        url: './cadastro',
                        icons: [{ src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' }]
                    },
                    {
                        name: 'Mapa de risco',
                        short_name: 'Mapa',
                        description: 'Abrir o mapa de moradias',
                        url: './mapa',
                        icons: [{ src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' }]
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                navigateFallback: 'index.html',
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                // Navegacoes para /api nunca caem no app shell.
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
                        urlPattern: ({ request }) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'static-images',
                            expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 90 },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    },
                    {
                        // Tiles do mapa: cache grande para caber o mapa de Santo Andre
                        // pre-baixado em utils/offlineMap.ts.
                        urlPattern: ({ url }) => url.host.endsWith('tile.openstreetmap.org'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'osm-tiles',
                            expiration: { maxEntries: 3000, maxAgeSeconds: 60 * 60 * 24 * 180 },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    },
                    {
                        // GET seguro e quase estatico: permite abrir o cadastro offline
                        // com prioridades ja vistas, sem cachear cadastros ou dados sensiveis.
                        urlPattern: ({ url, request }) =>
                            request.method === 'GET' && url.pathname.endsWith('/api/prioridades'),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-prioridades',
                            networkTimeoutSeconds: 4,
                            expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 7 },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime'],
        force: true
    },
    server: {
        port: 5173,
        host: 'localhost',
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            clientPort: 5173
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    // `vite preview` serve o build de producao (onde o service worker roda).
    // Para teste local, o /api aponta para o backend local, igual ao `npm run dev`.
    // Em deploy real, use VITE_API_BASE_URL no build.
    preview: {
        port: 4173,
        proxy: {
            '/api': {
                target: localApiTarget,
                changeOrigin: true
            }
        }
    }
});
