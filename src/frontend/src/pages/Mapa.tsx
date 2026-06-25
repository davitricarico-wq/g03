import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { buscarFamilias, detalharMoradia, listarMoradias, listarPrioridades } from '../api.ts';
import { toast } from '../components/feedback.tsx';
import Icon from '../components/Icon.tsx';
import { COR_RISCO } from '../utils/prioridade.ts';
import type { FamiliaBuscaResultado, MoradiaComLocalizacao, MoradiaDetalhe, Prioridade } from '../types.ts';

// Santo André - SP
const CENTRO_PADRAO: [number, number] = [-23.6639, -46.5383];

// Host único (sem {s}) para casar com os tiles pré-baixados para uso offline.
const TILE_CLARO = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ESCURO = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

const iconeRisco = pinIcon(COR_RISCO);
const iconeSemResponsavel = L.divIcon({
    className: '',
    html: `<div class="map-pin map-pin-alert" style="background:${COR_RISCO}"><span>!</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24]
});
const iconeLocalizacaoAtual = L.divIcon({
    className: '',
    html: '<div class="map-current-location-pin"><span></span></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14]
});

function pinIcon(cor: string): L.DivIcon {
    return L.divIcon({
        className: '',
        html: `<div class="map-pin" style="background:${cor}"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22],
        popupAnchor: [0, -20]
    });
}

/* ---------- camada de calor (leaflet.heat carregado sob demanda) ---------- */
let heatPromise: Promise<void> | null = null;
function garantirHeat(): Promise<void> {
    const Lany = L as unknown as { heatLayer?: unknown };
    if (Lany.heatLayer) return Promise.resolve();
    if (heatPromise) return heatPromise;
    (window as unknown as { L: typeof L }).L = L;
    heatPromise = new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Falha ao carregar mapa de calor'));
        document.head.appendChild(s);
    });
    return heatPromise;
}

function CamadaCalor({ pontos }: { pontos: [number, number, number][] }) {
    const map = useMap();
    useEffect(() => {
        let layer: L.Layer | null = null;
        let cancelado = false;
        garantirHeat()
            .then(() => {
                if (cancelado) return;
                const heatFn = (L as unknown as { heatLayer: (p: number[][], o: object) => L.Layer }).heatLayer;
                layer = heatFn(pontos, {
                    radius: 38,
                    blur: 28,
                    maxZoom: 17,
                    minOpacity: 0.5,
                    gradient: { 0.0: '#1E40AF', 0.35: '#06B6D4', 0.6: '#FACC15', 0.8: '#F97316', 1.0: '#EF4444' }
                });
                layer.addTo(map);
            })
            .catch(() => toast.error('Não foi possível carregar o mapa de calor.'));
        return () => {
            cancelado = true;
            if (layer) map.removeLayer(layer);
        };
    }, [map, pontos]);
    return null;
}

function IniciarNaLocalizacaoAtual({ localizacaoAtual }: { localizacaoAtual: [number, number] | null }) {
    const map = useMap();
    const iniciou = useRef(false);

    useEffect(() => {
        if (!localizacaoAtual || iniciou.current) return;
        iniciou.current = true;
        map.setView(localizacaoAtual, Math.max(map.getZoom(), 16), { animate: true });
    }, [localizacaoAtual, map]);

    return null;
}

function normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function familiaTemPrioridade(familia: FamiliaBuscaResultado, prioridade: Prioridade): boolean {
    if (familia.prioridadeCondicoes?.some((condicao) => normalizar(condicao) === normalizar(prioridade.condicao))) return true;
    const chave = normalizar(prioridade.condicao);
    if (chave.includes('idoso')) return familia.grupos.idoso;
    if (chave.includes('crianca')) return familia.grupos.crianca;
    if (chave.includes('lactante')) return false;
    if (chave.includes('gravida') || chave.includes('gestante')) return familia.grupos.gestante;
    if (chave.includes('cronica') || chave.includes('medicacao')) return familia.grupos.doencaCronica;
    return false;
}

function pessoaEhResponsavelAtivo(pessoa: MoradiaDetalhe['familias'][number]['pessoas'][number]): boolean {
    return pessoa.parentesco === 'Responsável' && !pessoa.deletedAt && (pessoa.status ?? 'Ativo') === 'Ativo';
}

function moradiaTemFamiliaSemResponsavel(detalhe?: MoradiaDetalhe): boolean {
    return Boolean(detalhe?.familias.some((item) => item.pessoas.length > 0 && !item.pessoas.some(pessoaEhResponsavelAtivo)));
}

export default function Mapa() {
    const navigate = useNavigate();
    const [moradias, setMoradias] = useState<MoradiaComLocalizacao[]>([]);
    const [familias, setFamilias] = useState<FamiliaBuscaResultado[]>([]);
    const [prioridades, setPrioridades] = useState<Prioridade[]>([]);
    const [detalhesMoradia, setDetalhesMoradia] = useState<Record<number, MoradiaDetalhe>>({});
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [statusOcultos, setStatusOcultos] = useState<Set<string>>(new Set());
    const [prioridadesAtivas, setPrioridadesAtivas] = useState<Set<number>>(new Set());
    const [bairroFiltro, setBairroFiltro] = useState('');
    const [painelAberto, setPainelAberto] = useState(true);
    const [modo, setModo] = useState<'pinos' | 'calor'>('pinos');
    const [carregandoDetalhe, setCarregandoDetalhe] = useState<number | null>(null);
    const [localizacaoAtual, setLocalizacaoAtual] = useState<[number, number] | null>(null);

    useEffect(() => {
        Promise.all([listarMoradias(), buscarFamilias(), listarPrioridades()])
            .then(async ([moradiasCarregadas, familiasCarregadas, prioridadesCarregadas]) => {
                setMoradias(moradiasCarregadas);
                setFamilias(familiasCarregadas);
                setPrioridades(prioridadesCarregadas);

                const detalhes = await Promise.allSettled(
                    moradiasCarregadas.map(async (moradia) => [moradia.id, await detalharMoradia(moradia.id)] as const)
                );
                setDetalhesMoradia(Object.fromEntries(
                    detalhes
                        .filter((resultado): resultado is PromiseFulfilledResult<readonly [number, MoradiaDetalhe]> => resultado.status === 'fulfilled')
                        .map((resultado) => resultado.value)
                ));
            })
            .catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar moradias.'))
            .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setLocalizacaoAtual([position.coords.latitude, position.coords.longitude]);
            },
            () => {
                setLocalizacaoAtual(null);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 10000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const comCoordenadas = useMemo(
        () => moradias.filter((m) => Number.isFinite(m.localizacao?.latitude) && Number.isFinite(m.localizacao?.longitude)),
        [moradias]
    );
    const statusDisponiveis = useMemo(
        () => Array.from(new Set(comCoordenadas.map((m) => m.status))),
        [comCoordenadas]
    );
    const bairrosDisponiveis = useMemo(
        () => Array.from(new Set(comCoordenadas.map((m) => m.localizacao.bairro).filter((b): b is string => !!b))).sort(),
        [comCoordenadas]
    );
    const familiasPorId = useMemo(
        () => new Map(familias.map((familia) => [familia.id, familia])),
        [familias]
    );
    const filtradas = useMemo(
        () =>
            comCoordenadas.filter(
                (m) => {
                    if (statusOcultos.has(m.status)) return false;
                    if (bairroFiltro && m.localizacao.bairro !== bairroFiltro) return false;
                    if (prioridadesAtivas.size === 0) return true;

                    const familiaIds = detalhesMoradia[m.id]?.familias.map((item) => item.familia.id) ?? [];
                    return familiaIds.some((idFamilia) => {
                        const familia = familiasPorId.get(idFamilia);
                        if (!familia) return false;
                        return Array.from(prioridadesAtivas).every((idPrioridade) => {
                            const prioridade = prioridades.find((item) => item.id === idPrioridade);
                            return prioridade ? familiaTemPrioridade(familia, prioridade) : false;
                        });
                    });
                }
            ),
        [comCoordenadas, statusOcultos, bairroFiltro, prioridadesAtivas, detalhesMoradia, familiasPorId, prioridades]
    );

    const pontosCalor = useMemo<[number, number, number][]>(
        () => filtradas.map((m) => [m.localizacao.latitude, m.localizacao.longitude, 1]),
        [filtradas]
    );

    const centro: [number, number] = localizacaoAtual ?? (filtradas.length > 0
        ? [filtradas[0].localizacao.latitude, filtradas[0].localizacao.longitude]
        : CENTRO_PADRAO);

    const filtrosAtivos = statusOcultos.size + prioridadesAtivas.size + (bairroFiltro ? 1 : 0);
    const moradiasVisiveisSemResponsavel = useMemo(
        () => filtradas.filter((moradia) => moradiaTemFamiliaSemResponsavel(detalhesMoradia[moradia.id])).length,
        [filtradas, detalhesMoradia]
    );

    function toggleStatus(status: string) {
        setStatusOcultos((prev) => {
            const next = new Set(prev);
            if (next.has(status)) next.delete(status);
            else next.add(status);
            return next;
        });
    }

    function limparFiltros() {
        setStatusOcultos(new Set());
        setPrioridadesAtivas(new Set());
        setBairroFiltro('');
    }

    function togglePrioridade(id: number) {
        setPrioridadesAtivas((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    async function abrirDetalheMoradia(idMoradia: number) {
        setCarregandoDetalhe(idMoradia);
        try {
            const detalhe = detalhesMoradia[idMoradia] ?? await detalharMoradia(idMoradia);
            setDetalhesMoradia((prev) => ({ ...prev, [idMoradia]: detalhe }));
            const familia = detalhe.familias[0]?.familia;
            if (!familia) {
                navigate(`/cadastro?moradiaId=${idMoradia}`);
                return;
            }
            navigate(`/busca?familiaId=${familia.id}`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao carregar detalhes da moradia.');
        } finally {
            setCarregandoDetalhe(null);
        }
    }

    return (
        <div className="mapa-wrap">
            <div className={`filtros-panel${painelAberto ? '' : ' collapsed'}`}>
                <div className="filtros-head">
                    <span>
                        FILTROS
                        {filtrosAtivos > 0 && <span className="filtros-count">{filtrosAtivos}</span>}
                    </span>
                    <button onClick={() => setPainelAberto((v) => !v)} style={{ color: 'var(--azul)', fontWeight: 700 }}>
                        {painelAberto ? '‹' : '›'}
                    </button>
                </div>
                <div className="filtros-body">
                    {statusDisponiveis.length === 0 && <p style={{ fontSize: '0.78rem', color: 'var(--cinza)' }}>Sem dados.</p>}

                    {bairrosDisponiveis.length > 0 && (
                        <select className="filtros-select" value={bairroFiltro} onChange={(e) => setBairroFiltro(e.target.value)}>
                            <option value="">Todos os bairros</option>
                            {bairrosDisponiveis.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    )}

                    {statusDisponiveis.map((s) => (
                        <label key={s} className="filtro-item">
                            <input type="checkbox" checked={!statusOcultos.has(s)} onChange={() => toggleStatus(s)} />
                            <span>{s}</span>
                        </label>
                    ))}

                    {prioridades.length > 0 && (
                        <>
                            <p className="map-filter-title">Prioridades</p>
                            <div className="map-priority-chips">
                                {prioridades.map((prioridade) => (
                                    <button
                                        type="button"
                                        key={prioridade.id}
                                        className={prioridadesAtivas.has(prioridade.id) ? 'active' : ''}
                                        onClick={() => togglePrioridade(prioridade.id)}
                                    >
                                        {prioridade.condicao}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {filtrosAtivos > 0 && (
                        <button onClick={limparFiltros} style={{ color: 'var(--laranja)', fontWeight: 700, fontSize: '0.78rem', marginTop: 8 }}>
                            Limpar filtros
                        </button>
                    )}
                </div>
                <div className="filtros-resumo">
                    <strong>Moradias visíveis:</strong> {filtradas.length}
                    {moradiasVisiveisSemResponsavel > 0 && (
                        <span className="map-responsible-warning">
                            {moradiasVisiveisSemResponsavel} sem responsável ativo
                        </span>
                    )}
                </div>
            </div>

            <div className="map-mode-toggle">
                <button className={modo === 'pinos' ? 'active' : ''} onClick={() => setModo('pinos')}><Icon name="map-pin" size={16} /> Pinos</button>
                <button className={modo === 'calor' ? 'active' : ''} onClick={() => setModo('calor')}><Icon name="flame" size={16} /> Calor</button>
            </div>

            {erro && <div className="map-erro card error-msg">{erro}</div>}

            {carregando && (
                <div className="map-loading" role="status" aria-live="polite">
                    <span className="map-loading-spinner" aria-hidden="true" />
                    <strong>Carregando mapa</strong>
                    <p>Buscando moradias, famílias e filtros...</p>
                </div>
            )}

            {!carregando && (
                <MapContainer center={centro} zoom={localizacaoAtual ? 16 : 13} zoomControl={false}>
                    <IniciarNaLocalizacaoAtual localizacaoAtual={localizacaoAtual} />
                    <ZoomControl position="bottomleft" />
                    <TileLayer
                        attribution={modo === 'calor' ? '&copy; OpenStreetMap &copy; CARTO' : '&copy; OpenStreetMap'}
                        url={modo === 'calor' ? TILE_ESCURO : TILE_CLARO}
                    />
                    {modo === 'calor'
                        ? <CamadaCalor pontos={pontosCalor} />
                        : filtradas.map((m) => {
                            const detalhe = detalhesMoradia[m.id];
                            const ocupada = (detalhe?.familias.length ?? 0) > 0;
                            const semResponsavel = moradiaTemFamiliaSemResponsavel(detalhe);
                            return (
                                <Marker key={m.id} position={[m.localizacao.latitude, m.localizacao.longitude]} icon={semResponsavel ? iconeSemResponsavel : iconeRisco}>
                                    <Popup>
                                        <strong>Moradia #{m.id}</strong><br />
                                        {m.localizacao.logradouro ?? 'Endereço n/d'}{m.localizacao.numero ? `, ${m.localizacao.numero}` : ''}<br />
                                        {m.localizacao.bairro ?? ''}<br />
                                        <span className={`popup-status${m.status === 'Ativa' ? ' status-ativa' : ''}`} style={m.status === 'Ativa' ? undefined : { background: COR_RISCO }}>{m.status}</span><br />
                                        <span className={`map-popup-occupancy${ocupada ? ' occupied' : ''}`}>
                                            {ocupada ? 'Ocupada' : 'Sem família ativa'}
                                        </span><br />
                                        {semResponsavel && (
                                            <>
                                                <span className="map-popup-responsible-alert">Família sem responsável ativo</span><br />
                                            </>
                                        )}
                                        <em style={{ color: '#5e5e5e' }}>{m.tipoConstrucao}</em>
                                        <button
                                            type="button"
                                            className="map-popup-detail"
                                            disabled={carregandoDetalhe === m.id}
                                            onClick={() => void abrirDetalheMoradia(m.id)}
                                        >
                                            {carregandoDetalhe === m.id ? 'Carregando...' : 'Detalhar moradia'}
                                        </button>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    {localizacaoAtual && (
                        <Marker position={localizacaoAtual} icon={iconeLocalizacaoAtual} zIndexOffset={1000}>
                            <Popup>Sua localização atual</Popup>
                        </Marker>
                    )}
                </MapContainer>
            )}

            <div className="map-legend">
                <div className="legend-row"><span className="legend-dot" style={{ background: COR_RISCO }} />Moradia em área de risco</div>
                <div className="legend-row"><span className="legend-dot legend-dot-alert">!</span>Moradia com família sem responsável ativo</div>
                {localizacaoAtual && <div className="legend-row"><span className="legend-dot" style={{ background: '#0ea5e9' }} />Sua localização atual</div>}
            </div>
        </div>
    );
}
