import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.tsx';
import { useAnimacoes } from '../utils/anim.ts';

const logo = '/logo-defesa-civil.png';

const cards = [
    { to: '/cadastro', icon: 'clipboard' as const, label: 'Cadastro', desc: 'Família, moradia e pets' },
    { to: '/busca', icon: 'search' as const, label: 'Busca', desc: 'Famílias e moradias' },
    { to: '/pessoas', icon: 'people' as const, label: 'Pessoas', desc: 'Ativos e histórico' },
    { to: '/mapa', icon: 'map-pin' as const, label: 'Mapa', desc: 'Risco e ocupação' },
    { to: '/historico', icon: 'history' as const, label: 'Histórico', desc: 'Famílias por moradia' }
];

export default function Home() {
    const navigate = useNavigate();
    const [animacoes, alternarAnimacoes] = useAnimacoes();

    return (
        <div>
            <section className="home-hero">
                <img src={logo} alt="Defesa Civil Santo André" />
                <p className="welcome">
                    Bem vindo <span className="agente">Agente.</span>
                </p>
            </section>

            <div className="home-cards">
                {cards.map((card) => (
                    <button
                        key={card.to}
                        className="home-card"
                        onClick={() => navigate(card.to)}
                    >
                        <span className="ic"><Icon name={card.icon} size={24} /></span>
                        <span className="home-card-text">
                            <span className="label">{card.label}</span>
                            <span className="desc">{card.desc}</span>
                        </span>
                        <span className="chev"><Icon name="chevron-right" size={20} /></span>
                    </button>
                ))}
            </div>

            <div className="home-anim">
                <button
                    className={`anim-toggle${animacoes ? ' on' : ''}`}
                    aria-pressed={!animacoes}
                    onClick={alternarAnimacoes}
                >
                    <span className="ic"><Icon name={animacoes ? 'sparkle' : 'x-circle'} size={19} /></span>
                    <span className="lbl">{animacoes ? 'Normal' : 'Modo Leve'}</span>
                </button>
            </div>
        </div>
    );
}
