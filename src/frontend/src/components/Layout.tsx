import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmHost, ToastHost } from './feedback.tsx';
import Icon from './Icon.tsx';
import OfflineIndicator from './OfflineIndicator.tsx';
import PWAInstallPrompt from './PWAInstallPrompt.tsx';
import PWAUpdatePrompt from './PWAUpdatePrompt.tsx';
import { useAnimacoes } from '../utils/anim.ts';

const logo = '/logo-defesa-civil.png';

const titulos: Record<string, string> = {
    '/cadastro': 'Cadastro',
    '/busca': 'Busca',
    '/pessoas': 'Pessoas',
    '/mapa': 'Visualização'
};

const navItems = [
    { to: '/cadastro', icon: 'clipboard' as const, label: 'Cadastro' },
    { to: '/mapa', icon: 'map' as const, label: 'Mapa' },
    { to: '/', icon: 'home' as const, label: 'Home', center: true },
    { to: '/busca', icon: 'search' as const, label: 'Busca' },
    { to: '/pessoas', icon: 'people' as const, label: 'Pessoas' }
];

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const titulo = titulos[location.pathname] ?? 'GeoRisco';
    const [animacoes, alternarAnimacoes] = useAnimacoes();

    return (
        <div className="app-shell">
            {!isHome && (
                <header className="app-header">
                    <button className="brand brand-button" type="button" onClick={() => navigate('/')} aria-label="Ir para início">
                        <img src={logo} alt="Defesa Civil Santo André" />
                    </button>
                    <h1>{titulo}</h1>
                    <div className="header-actions">
                        <button
                            className={`header-icon${animacoes ? ' on' : ''}`}
                            aria-label={animacoes ? 'Desativar animações' : 'Ativar animações'}
                            title={animacoes ? 'Animações ativas (clique para desativar)' : 'Animações desativadas'}
                            onClick={alternarAnimacoes}
                        >
                            <Icon name={animacoes ? 'sparkle' : 'x-circle'} size={18} />
                        </button>
                    </div>
                </header>
            )}

            <main className="app-main">
                <Outlet />
            </main>

            <nav className="bottom-nav">
                {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} className={item.center ? 'bottom-nav-home' : undefined}>
                        <span className="icon"><Icon name={item.icon} size={21} /></span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <OfflineIndicator />
            <PWAInstallPrompt />
            <PWAUpdatePrompt />
            <ToastHost />
            <ConfirmHost />
        </div>
    );
}
