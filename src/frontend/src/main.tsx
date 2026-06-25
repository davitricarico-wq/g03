import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import 'leaflet/dist/leaflet.css';
import App from './App.tsx';
import { iniciarAnimacoes } from './utils/anim.ts';
import './styles/theme.css';

// Registra o service worker (PWA). autoUpdate troca por uma versão nova assim
// que ela estiver pronta. Sem isto o app não abre offline.
registerSW({ immediate: true });

iniciarAnimacoes();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
