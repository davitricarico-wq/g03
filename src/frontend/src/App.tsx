import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Cadastro from './pages/Cadastro.tsx';
import Busca from './pages/Busca.tsx';
import Mapa from './pages/Mapa.tsx';
import Pessoas from './pages/Pessoas.tsx';
import { aoMudarConectividade, estaOnline } from './utils/connectivity.ts';
import { sincronizar } from './utils/outbox.ts';

export default function App() {
    // Offline-first (A1): tenta esvaziar a fila ao abrir o app (se online) e
    // sempre que a conexão voltar.
    useEffect(() => {
        if (estaOnline()) void sincronizar();
        return aoMudarConectividade((online) => {
            if (online) void sincronizar();
        });
    }, []);

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/busca" element={<Busca />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
