import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Cadastro from './pages/Cadastro.tsx';
import Busca from './pages/Busca.tsx';
import Mapa from './pages/Mapa.tsx';
import Pessoas from './pages/Pessoas.tsx';
import Historico from './pages/Historico.tsx';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/busca" element={<Busca />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
