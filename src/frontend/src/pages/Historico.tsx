import { useState } from 'react';
import { historicoFamiliasMoradia, historicoMoradiasFamilia } from '../api.ts';
import { toast } from '../components/feedback.tsx';
import Icon from '../components/Icon.tsx';
import type { FamiliaMoradiaHistorico, MoradiaFamiliaHistorico } from '../types.ts';

type AbaHistorico = 'familia' | 'moradia';

function dataCurta(value: string | null): string {
    if (!value) return 'Atual';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toLocaleDateString('pt-BR');
}

function periodo(entrada: string, saida: string | null): string {
    return `${dataCurta(entrada)} até ${dataCurta(saida)}`;
}

export default function Historico() {
    const [aba, setAba] = useState<AbaHistorico>('familia');
    const [idFamilia, setIdFamilia] = useState('');
    const [idMoradia, setIdMoradia] = useState('');
    const [historicoFamilia, setHistoricoFamilia] = useState<FamiliaMoradiaHistorico[]>([]);
    const [historicoMoradia, setHistoricoMoradia] = useState<MoradiaFamiliaHistorico[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [consultado, setConsultado] = useState(false);

    async function consultarFamilia(event: React.FormEvent) {
        event.preventDefault();
        const id = Number(idFamilia);
        if (!Number.isInteger(id) || id <= 0) {
            toast.error('Informe um ID de família válido.');
            return;
        }
        setCarregando(true);
        setConsultado(true);
        try {
            setHistoricoFamilia(await historicoMoradiasFamilia(id));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao buscar histórico da família.');
            setHistoricoFamilia([]);
        } finally {
            setCarregando(false);
        }
    }

    async function consultarMoradia(event: React.FormEvent) {
        event.preventDefault();
        const id = Number(idMoradia);
        if (!Number.isInteger(id) || id <= 0) {
            toast.error('Informe um ID de moradia válido.');
            return;
        }
        setCarregando(true);
        setConsultado(true);
        try {
            setHistoricoMoradia(await historicoFamiliasMoradia(id));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao buscar histórico da moradia.');
            setHistoricoMoradia([]);
        } finally {
            setCarregando(false);
        }
    }

    function trocarAba(next: AbaHistorico) {
        setAba(next);
        setConsultado(false);
    }

    return (
        <div>
            <div className="pill-tabs" style={{ marginBottom: 14 }}>
                <button className={`pill-tab${aba === 'familia' ? ' active' : ''}`} onClick={() => trocarAba('familia')}>
                    Por família
                </button>
                <button className={`pill-tab${aba === 'moradia' ? ' active' : ''}`} onClick={() => trocarAba('moradia')}>
                    Por moradia
                </button>
            </div>

            {aba === 'familia' ? (
                <>
                    <form onSubmit={consultarFamilia} className="history-search card">
                        <div className="field">
                            <label>ID da família</label>
                            <input value={idFamilia} onChange={(e) => setIdFamilia(e.target.value)} inputMode="numeric" placeholder="Ex.: 12" />
                        </div>
                        <button className="btn btn-azul" type="submit"><Icon name="search" size={18} /> Buscar histórico</button>
                    </form>

                    {carregando && <p className="state-msg">Buscando histórico...</p>}
                    {!carregando && consultado && historicoFamilia.length === 0 && <p className="state-msg">Nenhum vínculo de moradia encontrado.</p>}
                    <div className="history-list">
                        {historicoFamilia.map((item) => (
                            <article key={`${item.vinculo.idMoradia}-${item.vinculo.dataEntrada}`} className={`history-card${item.ativo ? ' active' : ''}`}>
                                <div className="history-line-icon"><Icon name="home" size={18} /></div>
                                <div>
                                    <div className="history-card-head">
                                        <strong>Moradia #{item.vinculo.idMoradia}</strong>
                                        <span>{item.ativo ? 'Ativo' : 'Encerrado'}</span>
                                    </div>
                                    <p>{periodo(item.vinculo.dataEntrada, item.vinculo.dataSaida)}</p>
                                    <p>{item.moradia.tipoConstrucao} · {item.moradia.usoImovel} · {item.moradia.status}</p>
                                    {item.vinculo.status && <p>Status do vínculo: {item.vinculo.status}</p>}
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <form onSubmit={consultarMoradia} className="history-search card">
                        <div className="field">
                            <label>ID da moradia</label>
                            <input value={idMoradia} onChange={(e) => setIdMoradia(e.target.value)} inputMode="numeric" placeholder="Ex.: 4" />
                        </div>
                        <button className="btn btn-azul" type="submit"><Icon name="search" size={18} /> Buscar histórico</button>
                    </form>

                    {carregando && <p className="state-msg">Buscando histórico...</p>}
                    {!carregando && consultado && historicoMoradia.length === 0 && <p className="state-msg">Nenhuma família encontrada para esta moradia.</p>}
                    <div className="history-list">
                        {historicoMoradia.map((item) => (
                            <article key={`${item.vinculo.idFamilia}-${item.vinculo.dataEntrada}`} className={`history-card${item.ativo ? ' active' : ''}`}>
                                <div className="history-line-icon"><Icon name="people" size={18} /></div>
                                <div>
                                    <div className="history-card-head">
                                        <strong>Família #{item.vinculo.idFamilia}</strong>
                                        <span>{item.ativo ? 'Ativo' : 'Encerrado'}</span>
                                    </div>
                                    <p>{periodo(item.vinculo.dataEntrada, item.vinculo.dataSaida)}</p>
                                    {item.vinculo.status && <p>Status do vínculo: {item.vinculo.status}</p>}
                                    {item.familia.deletedAt && <p>Família removida em {dataCurta(item.familia.deletedAt)}</p>}
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
