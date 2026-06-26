import { useEffect, useState } from 'react';
import Icon from './Icon.tsx';
import { aoMudarConectividade, estaOnline } from '../utils/connectivity.ts';
import { baixarMapaSantoAndre, contarTiles, mapaOfflineInfo, type ProgressoDownload } from '../utils/offlineMap.ts';
import { toast } from './feedback.tsx';

// Botão para preparar o app para uso em campo: baixa o mapa de Santo André para
// funcionar offline. Deve ser usado COM internet, antes de ir a campo.
export default function OfflineMapButton() {
    const [online, setOnline] = useState(estaOnline());
    const [progresso, setProgresso] = useState<ProgressoDownload | null>(null);
    const [info, setInfo] = useState(mapaOfflineInfo());

    const baixando = progresso !== null;
    const pct = progresso && progresso.total ? Math.round((progresso.baixados / progresso.total) * 100) : 0;

    useEffect(() => aoMudarConectividade(setOnline), []);

    async function baixar() {
        if (baixando) return;
        setProgresso({ baixados: 0, total: contarTiles(), falhas: 0 });
        try {
            const r = await baixarMapaSantoAndre(setProgresso);
            setInfo(mapaOfflineInfo());
            const ok = r.total - r.falhas;
            toast.success(`Mapa salvo para uso offline (${ok}/${r.total} blocos).`);
        } catch {
            toast.error('Não foi possível baixar o mapa agora. Tente com uma conexão melhor.');
        } finally {
            setProgresso(null);
        }
    }

    return (
        <div className="offline-map-prep">
            <button
                type="button"
                className={`offline-map-action${info ? ' ready' : ''}`}
                onClick={baixar}
                disabled={!online || baixando}
            >
                <span className="ic"><Icon name="map" size={19} /></span>
                <span className="lbl">
                    {baixando
                        ? `Baixando mapa… ${pct}%`
                        : info
                            ? 'Atualizar mapa offline'
                            : 'Baixar mapa para uso offline'}
                </span>
            </button>
            {!online && !baixando && (
                <p className="offline-map-hint">Conecte-se à internet para baixar o mapa de Santo André.</p>
            )}
            {online && !baixando && !info && (
                <p className="offline-map-hint">Baixe o mapa antes de ir a campo para marcar a casa sem internet.</p>
            )}
            {info && !baixando && (
                <p className="offline-map-hint">Mapa de Santo André salvo no aparelho.</p>
            )}
        </div>
    );
}
