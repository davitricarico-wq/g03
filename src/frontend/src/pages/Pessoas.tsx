import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarStatusPessoa, buscarPessoas } from '../api.ts';
import { confirmDialog, toast } from '../components/feedback.tsx';
import Icon from '../components/Icon.tsx';
import type { EscopoPessoa, PessoaBuscaResultado } from '../types.ts';

const ESCOPOS: { id: EscopoPessoa; label: string }[] = [
    { id: 'ativas', label: 'Ativos' },
    { id: 'inativas', label: 'Inativos' },
    { id: 'todas', label: 'Todos' }
];

function ehInativo(p: PessoaBuscaResultado): boolean {
    return p.deletedAt !== null || (p.status ?? '').toLowerCase() !== 'ativo';
}

function idade(dataIso: string | null): number | null {
    if (!dataIso) return null;
    const d = new Date(dataIso);
    if (Number.isNaN(d.getTime())) return null;
    const hoje = new Date();
    let a = hoje.getFullYear() - d.getFullYear();
    const m = hoje.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) a--;
    return a;
}

export default function Pessoas() {
    const navigate = useNavigate();
    const [termo, setTermo] = useState('');
    const [escopo, setEscopo] = useState<EscopoPessoa>('ativas');
    const [resultados, setResultados] = useState<PessoaBuscaResultado[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [jaBuscou, setJaBuscou] = useState(false);
    const [salvandoId, setSalvandoId] = useState<number | null>(null);
    const [aberto, setAberto] = useState<number | null>(null);

    async function carregar(escopoAtual: EscopoPessoa, termoAtual: string) {
        setCarregando(true);
        setErro(null);
        const limpo = termoAtual.trim();
        const apenasDigitos = limpo.replace(/\D/g, '');
        const ehCpf = limpo.length > 0 && apenasDigitos.length >= 3 && apenasDigitos.length / limpo.length > 0.6;
        try {
            setResultados(
                await buscarPessoas({
                    escopo: escopoAtual,
                    nome: !ehCpf && limpo ? limpo : undefined,
                    cpf: ehCpf ? apenasDigitos : undefined
                })
            );
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao buscar pessoas.');
        } finally {
            setCarregando(false);
            setJaBuscou(true);
        }
    }

    useEffect(() => {
        void carregar(escopo, termo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escopo]);

    function pesquisar(e: React.FormEvent) {
        e.preventDefault();
        void carregar(escopo, termo);
    }

    async function alterarStatus(p: PessoaBuscaResultado, novoStatus: 'Ativo' | 'Inativo' | 'Obito') {
        const reativando = novoStatus === 'Ativo';
        const statusLabel = novoStatus === 'Obito' ? 'Óbito' : novoStatus;
        const ok = await confirmDialog({
            title: reativando ? 'Reativar pessoa' : novoStatus === 'Obito' ? 'Registrar óbito' : 'Inativar pessoa',
            message: reativando
                ? `Deseja reativar "${p.nome}"? O status passará para "Ativo".`
                : `Deseja alterar "${p.nome}" para "${statusLabel}"?`,
            okLabel: reativando ? 'Reativar' : statusLabel,
            danger: !reativando
        });
        if (!ok) return;
        setSalvandoId(p.id);
        try {
            const atualizada = await atualizarStatusPessoa(p.id, novoStatus);
            setResultados((prev) =>
                prev
                    .map((x) => (x.id === p.id ? { ...x, status: atualizada.status ?? novoStatus, deletedAt: atualizada.deletedAt ?? x.deletedAt } : x))
                    .filter((x) => {
                        if (escopo === 'todas' || x.id !== p.id) return true;
                        return escopo === 'ativas' ? !ehInativo(x) : ehInativo(x);
                    })
            );
            toast.success(`Status atualizado para "${statusLabel}".`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao atualizar status.');
        } finally {
            setSalvandoId(null);
        }
    }

    return (
        <div>
            <form onSubmit={pesquisar}>
                <div className="search-row">
                    <div className="search-input">
                        <input placeholder="Buscar por nome ou CPF" value={termo} onChange={(e) => setTermo(e.target.value)} />
                        <button type="submit" aria-label="Buscar" style={{ color: 'var(--cinza-escuro)' }}><Icon name="search" size={20} /></button>
                    </div>
                </div>
                <div className="segmented" role="tablist" aria-label="Escopo">
                    {ESCOPOS.map((s) => (
                        <button
                            type="button"
                            key={s.id}
                            className={`segmented-item${escopo === s.id ? ' active' : ''}`}
                            onClick={() => setEscopo(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </form>

            <div className="resultados-head">
                <h2>Pessoas:</h2>
                {jaBuscou && !erro && <span className="count-pill">{resultados.length} encontrada(s)</span>}
            </div>

            {erro && <p className="error-msg">{erro}</p>}
            {carregando && <p className="state-msg">Buscando...</p>}
            {!carregando && !erro && jaBuscou && resultados.length === 0 && (
                <p className="state-msg">Nenhuma pessoa encontrada.</p>
            )}

            {resultados.map((p) => {
                const inativo = ehInativo(p);
                const anos = idade(p.dataDeNascimento);
                return (
                    <div key={p.id} className={`familia-card anim-fade${inativo ? ' is-inativo' : ''}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="nome">
                                    {p.nome}
                                    {p.responsavel && <span className="tag tag-resp">RESPONSÁVEL</span>}
                                </div>
                                <div className="cpf">{p.cpf ?? 'CPF não informado'}</div>
                                <div className="familia-meta">
                                    {p.parentesco && <span><Icon name="people" size={14} /> {p.parentesco}</span>}
                                    {anos !== null && <span><Icon name="activity" size={14} /> {anos} ano(s)</span>}
                                    {p.telefone && <span>{p.telefone}</span>}
                                </div>
                            </div>
                            <div className="card-actions" style={{ alignItems: 'flex-end' }}>
                                <span className={`status-badge ${inativo ? 'status-inativo' : 'status-ativo'}`}>
                                    {inativo ? p.status ?? 'Inativo' : 'Ativo'}
                                </span>
                                <button className="btn-editar" onClick={() => setAberto((id) => id === p.id ? null : p.id)}>
                                    {aberto === p.id ? 'Ocultar' : 'Detalhes'}
                                </button>
                                <button className="btn-editar" onClick={() => navigate(`/cadastro?pessoaId=${p.id}`)}>
                                    Editar
                                </button>
                                {p.responsavel ? (
                                    <button
                                        className="btn-status inativar"
                                        disabled
                                        title="Responsável familiar não pode ter status alterado por esta tela."
                                    >
                                        Responsável
                                    </button>
                                ) : inativo ? (
                                    <button
                                        className="btn-status reativar"
                                        disabled={salvandoId === p.id}
                                        onClick={() => alterarStatus(p, 'Ativo')}
                                    >
                                        {salvandoId === p.id ? '...' : 'Reativar'}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn-status inativar"
                                            disabled={salvandoId === p.id}
                                            onClick={() => alterarStatus(p, 'Inativo')}
                                        >
                                            {salvandoId === p.id ? '...' : 'Inativar'}
                                        </button>
                                        <button
                                            className="btn-status inativar"
                                            disabled={salvandoId === p.id}
                                            onClick={() => alterarStatus(p, 'Obito')}
                                        >
                                            Óbito
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {aberto === p.id && (
                            <div className="detalhe-panel">
                                <section className="detail-section">
                                    <h3>Dados pessoais</h3>
                                    <div className="detail-list detail-grid">
                                        <p><strong>Nome social:</strong> {p.nomeSocial || 'Não informado'}</p>
                                        <p><strong>CPF:</strong> {p.cpf || 'Não informado'}</p>
                                        <p><strong>Nascimento:</strong> {p.dataDeNascimento ? p.dataDeNascimento.slice(0, 10) : 'Não informado'}</p>
                                        <p><strong>Idade:</strong> {anos !== null ? `${anos} ano(s)` : 'Não informado'}</p>
                                        <p><strong>Parentesco:</strong> {p.parentesco || 'Não informado'}</p>
                                        <p><strong>Ocupação:</strong> {p.situacaoOcupacional || 'Não informado'}</p>
                                        <p><strong>Escolaridade:</strong> {p.escolaridade || 'Não informado'}</p>
                                        <p><strong>Status:</strong> {p.status || 'Não informado'}</p>
                                    </div>
                                </section>
                                <section className="detail-section">
                                    <h3>Contato e saúde</h3>
                                    <div className="detail-list detail-grid">
                                        <p><strong>E-mail:</strong> {p.email || 'Não informado'}</p>
                                        <p><strong>Telefone:</strong> {p.telefone || 'Não informado'}</p>
                                        <p><strong>Doença crônica:</strong> {p.cronico ? 'Sim' : 'Não'}</p>
                                        <p><strong>Medicação:</strong> {p.medicacao ? 'Sim' : 'Não'}</p>
                                        <p><strong>Responsável:</strong> {p.responsavel ? 'Sim' : 'Não'}</p>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
