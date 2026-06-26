import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarStatusPessoa, buscarPessoas, listarPessoas, listarPessoasInativas } from '../api.ts';
import { confirmDialog, toast } from '../components/feedback.tsx';
import Icon from '../components/Icon.tsx';
import type { EscopoPessoa, PessoaBuscaResultado } from '../types.ts';

const ESCOPOS: { id: EscopoPessoa; label: string }[] = [
    { id: 'todas', label: 'Todos' },
    { id: 'ativas', label: 'Ativos' },
    { id: 'inativas', label: 'Inativos' }
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
            if (!limpo) {
                if (escopoAtual === 'inativas') {
                    setResultados(await listarPessoasInativas());
                } else if (escopoAtual === 'ativas') {
                    setResultados(await listarPessoas());
                } else {
                    const [ativas, inativas] = await Promise.all([listarPessoas(), listarPessoasInativas()]);
                    setResultados([...ativas, ...inativas]);
                }
                return;
            }
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
                        <div className="familia-card-top pessoa-card-top">
                            <div className="pessoa-card-main">
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
                            <div className="pessoa-card-actions">
                                <div className="card-actions-top">
                                    <span className={`status-badge ${inativo ? 'status-inativo' : 'status-ativo'}`}>
                                        {inativo ? p.status ?? 'Inativo' : 'Ativo'}
                                    </span>
                                </div>

                                <div className="card-actions-bottom">

                                    <div className="action-column">
                                        <button
                                            type="button"
                                            className={`card-action-btn secondary${aberto === p.id ? ' active' : ''}`}
                                            aria-expanded={aberto === p.id}
                                            title={aberto === p.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                                            onClick={() => setAberto((id) => id === p.id ? null : p.id)}
                                        >
                                            <Icon name={aberto === p.id ? 'eye-off' : 'eye'} size={16} />
                                            <span>{aberto === p.id ? 'Ocultar' : 'Detalhes'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="card-action-btn secondary"
                                            title="Editar cadastro"
                                            onClick={() => navigate(`/cadastro?pessoaId=${p.id}`)}
                                        >
                                            <Icon name="edit" size={16} />
                                            <span>Editar</span>
                                        </button>
                                    </div>

                                    {/* Coluna 2: Inativar / Óbito / Responsável / Reativar */}
                                    <div className="action-column">
                                        {p.responsavel ? (
                                            <button
                                                type="button"
                                                className="card-action-btn neutral"
                                                disabled
                                                title="Responsável familiar não pode ter status alterado por esta tela."
                                            >
                                                <Icon name="people" size={16} />
                                                <span>Responsável</span>
                                            </button>
                                        ) : inativo ? (
                                            <button
                                                type="button"
                                                className="card-action-btn success"
                                                disabled={salvandoId === p.id}
                                                title="Reativar pessoa"
                                                onClick={() => alterarStatus(p, 'Ativo')}
                                            >
                                                <Icon name="user-check" size={16} />
                                                <span>{salvandoId === p.id ? '...' : 'Reativar'}</span>
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="card-action-btn warning"
                                                    disabled={salvandoId === p.id}
                                                    title="Inativar pessoa"
                                                    onClick={() => alterarStatus(p, 'Inativo')}
                                                >
                                                    <Icon name="user-x" size={16} />
                                                    <span>{salvandoId === p.id ? '...' : 'Inativar'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="card-action-btn danger"
                                                    disabled={salvandoId === p.id}
                                                    title="Registrar óbito"
                                                    onClick={() => alterarStatus(p, 'Obito')}
                                                >
                                                    <Icon name="x-circle" size={16} />
                                                    <span>Óbito</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {aberto === p.id && (
                            <div className="detalhe-panel">
                                <section className="detail-section">
                                    <h3>Dados pessoais</h3>
                                    <div className="detail-list detail-grid">
                                        <p><strong>Apelido:</strong> {p.nomeSocial || 'Não informado'}</p>
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
