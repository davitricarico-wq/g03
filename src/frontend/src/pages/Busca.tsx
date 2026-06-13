import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    atualizarMoradia,
    atualizarPessoa,
    buscarFamilias,
    detalharFamilia,
    detalharMoradia,
    listarMoradias,
    listarPrioridades,
    removerFamilia
} from '../api.ts';
import { confirmDialog, toast } from '../components/feedback.tsx';
import PhotoGallery from '../components/PhotoGallery.tsx';
import { exportarCSV, exportarPDF } from '../utils/export.ts';
import {
    ESCOLARIDADES,
    PARENTESCOS,
    SITUACOES_OCUPACAO_MORADIA,
    SITUACOES_OCUPACIONAIS,
    STATUS_MORADIA,
    TIPOS_CONSTRUCAO,
    USOS_IMOVEL
} from '../types.ts';
import Icon from '../components/Icon.tsx';
import type { FamiliaBuscaResultado, FamiliaDetalhe, MoradiaComLocalizacao, MoradiaDetalhe, Pessoa, Prioridade } from '../types.ts';

interface MoradiaDraft {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude: string;
    longitude: string;
    referencia: string;
    complemento: string;
    tipoConstrucao: string;
    usoImovel: string;
    situacaoDeOcupacao: string;
    pavimentos: string;
    status: string;
    descricao: string;
}

type PessoaDraft = Pick<
    Pessoa,
    'id' | 'nome' | 'nomeSocial' | 'cpf' | 'dataDeNascimento' | 'parentesco' | 'situacaoOcupacional' | 'escolaridade' | 'status'
> & {
    cronico: boolean;
    medicacao: boolean;
};

interface EditDraft {
    moradia: MoradiaDraft | null;
    pessoas: PessoaDraft[];
}

type AbaBusca = 'familias' | 'moradias';

function normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function prioridadeClass(tipo: string): string {
    const chave = normalizar(tipo);
    if (chave.includes('gravida') || chave.includes('gestante') || chave.includes('lactante')) return 'tag-gestante';
    if (chave.includes('crianca')) return 'tag-crianca';
    if (chave.includes('idoso')) return 'tag-idoso';
    if (chave.includes('cronica') || chave.includes('medicacao')) return 'tag-cronica';
    return 'tag-neutra';
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

function tagsDaFamilia(familia: FamiliaBuscaResultado, prioridades: Prioridade[]) {
    const dinamicas = prioridades
        .filter((prioridade) => familiaTemPrioridade(familia, prioridade))
        .map((prioridade) => ({
            key: String(prioridade.id),
            label: prioridade.condicao.toUpperCase(),
            cls: prioridadeClass(prioridade.condicao)
        }));

    if (dinamicas.length > 0) return dinamicas;

    return [
        familia.grupos.gestante && { key: 'gestante', label: 'GESTANTE', cls: 'tag-gestante' },
        familia.grupos.crianca && { key: 'crianca', label: 'CRIANÇA', cls: 'tag-crianca' },
        familia.grupos.idoso && { key: 'idoso', label: 'IDOSO', cls: 'tag-idoso' },
        familia.grupos.doencaCronica && { key: 'doencaCronica', label: 'DOENÇA CRÔNICA', cls: 'tag-cronica' }
    ].filter(Boolean) as { key: string; label: string; cls: string }[];
}

function Tags({ familia, prioridades }: { familia: FamiliaBuscaResultado; prioridades: Prioridade[] }) {
    const tags = tagsDaFamilia(familia, prioridades);
    if (tags.length === 0) return null;
    return (
        <div className="tags">
            {tags.map((t) => (
                <span key={t.key} className={`tag ${t.cls}`}>{t.label}</span>
            ))}
        </div>
    );
}

function dataInput(value: string | null | undefined): string {
    return value ? String(value).slice(0, 10) : '';
}

function selecionar<T extends readonly string[]>({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: T }) {
    return (
        <select value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">Selecione</option>
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
    );
}

export default function Busca() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const familiaIdInicial = Number(searchParams.get('familiaId'));
    const [abaBusca, setAbaBusca] = useState<AbaBusca>('familias');
    const [termo, setTermo] = useState('');
    const [bairro, setBairro] = useState('');
    const [termoMoradia, setTermoMoradia] = useState('');
    const [bairroMoradia, setBairroMoradia] = useState('');
    const [statusMoradiaFiltro, setStatusMoradiaFiltro] = useState('');
    const [prioridades, setPrioridades] = useState<Prioridade[]>([]);
    const [prioridadesAtivas, setPrioridadesAtivas] = useState<Set<number>>(new Set());
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [resultados, setResultados] = useState<FamiliaBuscaResultado[]>([]);
    const [moradias, setMoradias] = useState<MoradiaComLocalizacao[]>([]);
    const [detalhes, setDetalhes] = useState<Record<number, FamiliaDetalhe>>({});
    const [detalhesMoradia, setDetalhesMoradia] = useState<Record<number, MoradiaDetalhe>>({});
    const [aberto, setAberto] = useState<number | null>(null);
    const [moradiaAberta, setMoradiaAberta] = useState<number | null>(null);
    const [editando, setEditando] = useState<number | null>(null);
    const [draft, setDraft] = useState<EditDraft>({ moradia: null, pessoas: [] });
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [jaBuscou, setJaBuscou] = useState(false);

    async function carregar(filtros: { termo?: string; bairro?: string } = {}) {
        setCarregando(true);
        setErro(null);
        try {
            const familias = await buscarFamilias(filtros);
            const familiasOrdenadas = Number.isInteger(familiaIdInicial) && familiaIdInicial > 0
                ? [...familias].sort((a, b) => Number(b.id === familiaIdInicial) - Number(a.id === familiaIdInicial))
                : familias;
            setResultados(familiasOrdenadas);
            return familiasOrdenadas;
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao buscar famílias.');
            return [];
        } finally {
            setCarregando(false);
            setJaBuscou(true);
        }
    }

    useEffect(() => {
        void carregar().then((familias) => {
            if (!Number.isInteger(familiaIdInicial) || familiaIdInicial <= 0) return;
            setAbaBusca('familias');
            const familia = familias.find((item) => item.id === familiaIdInicial);
            if (familia) void abrirDetalhes(familia);
        });
        listarMoradias()
            .then(setMoradias)
            .catch(() => toast.error('Não foi possível carregar moradias.'));
        listarPrioridades()
            .then(setPrioridades)
            .catch(() => toast.error('Não foi possível carregar prioridades.'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function pesquisar(e: React.FormEvent) {
        e.preventDefault();
        void carregar({ termo: termo.trim() || undefined, bairro: bairro.trim() || undefined });
    }

    function togglePrioridade(id: number) {
        setPrioridadesAtivas((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const filtrados = useMemo(
        () =>
            resultados.filter((familia) =>
                Array.from(prioridadesAtivas).every((id) => {
                    const prioridade = prioridades.find((p) => p.id === id);
                    return prioridade ? familiaTemPrioridade(familia, prioridade) : false;
                })
            ),
        [resultados, prioridadesAtivas, prioridades]
    );

    const moradiasFiltradas = useMemo(() => {
        const termoNormalizado = normalizar(termoMoradia.trim());
        const bairroNormalizado = normalizar(bairroMoradia.trim());
        return moradias.filter((moradia) => {
            const endereco = [
                moradia.id,
                moradia.localizacao.logradouro,
                moradia.localizacao.numero,
                moradia.localizacao.bairro,
                moradia.localizacao.cidade,
                moradia.localizacao.estado,
                moradia.tipoConstrucao,
                moradia.usoImovel,
                moradia.situacaoDeOcupacao,
                moradia.status
            ].filter(Boolean).join(' ');
            if (termoNormalizado && !normalizar(endereco).includes(termoNormalizado)) return false;
            if (bairroNormalizado && !normalizar(moradia.localizacao.bairro ?? '').includes(bairroNormalizado)) return false;
            if (statusMoradiaFiltro && moradia.status !== statusMoradiaFiltro) return false;
            return true;
        });
    }, [moradias, termoMoradia, bairroMoradia, statusMoradiaFiltro]);

    async function abrirDetalhesMoradia(moradia: MoradiaComLocalizacao) {
        if (moradiaAberta === moradia.id) {
            setMoradiaAberta(null);
            return;
        }
        setMoradiaAberta(moradia.id);
        if (detalhesMoradia[moradia.id]) return;
        try {
            const detalhe = await detalharMoradia(moradia.id);
            setDetalhesMoradia((prev) => ({ ...prev, [moradia.id]: detalhe }));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao carregar detalhes da moradia.');
            setMoradiaAberta(null);
        }
    }

    async function abrirDetalhes(familia: FamiliaBuscaResultado) {
        if (aberto === familia.id) {
            setAberto(null);
            setEditando(null);
            return;
        }
        setAberto(familia.id);
        setEditando(null);
        if (detalhes[familia.id]) return;
        try {
            setDetalhes((prev) => ({ ...prev, [familia.id]: { id: familia.id, pessoas: [], moradias: [], pets: [] } }));
            const detalhe = await detalharFamilia(familia.id);
            setDetalhes((prev) => ({ ...prev, [familia.id]: detalhe }));
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao carregar detalhes.');
            setAberto(null);
        }
    }

    async function abrirFamiliaDaMoradia(idFamilia: number) {
        setAbaBusca('familias');
        setFiltroAberto(false);
        setEditando(null);

        let familia = resultados.find((item) => item.id === idFamilia);
        if (!familia) {
            const familias = await carregar();
            familia = familias.find((item) => item.id === idFamilia);
        }

        if (!familia) {
            toast.error('Família não encontrada na busca.');
            return;
        }

        setResultados((prev) => [
            familia,
            ...prev.filter((item) => item.id !== idFamilia)
        ]);
        setAberto(null);
        await abrirDetalhes(familia);
    }

    function setMoradiaDraft(campo: keyof MoradiaDraft, valor: string) {
        setDraft((prev) => ({
            ...prev,
            moradia: prev.moradia ? { ...prev.moradia, [campo]: valor } : prev.moradia
        }));
    }

    function setPessoaDraft(id: number, campo: keyof PessoaDraft, valor: string | boolean) {
        setDraft((prev) => ({
            ...prev,
            pessoas: prev.pessoas.map((pessoa) => pessoa.id === id ? { ...pessoa, [campo]: valor } : pessoa)
        }));
    }

    async function salvarEdicao(familia: FamiliaBuscaResultado) {
        const detalhe = detalhes[familia.id];
        if (!detalhe) return;

        try {
            const moradia = detalhe.moradias[0];
            if (moradia && draft.moradia) {
                await atualizarMoradia(moradia.id, {
                    localizacao: {
                        logradouro: draft.moradia.logradouro || null,
                        numero: draft.moradia.numero || null,
                        bairro: draft.moradia.bairro || null,
                        cidade: draft.moradia.cidade,
                        estado: draft.moradia.estado,
                        cep: draft.moradia.cep || null,
                        latitude: Number(draft.moradia.latitude),
                        longitude: Number(draft.moradia.longitude),
                        referencia: draft.moradia.referencia || null,
                        complemento: draft.moradia.complemento || null
                    },
                    moradia: {
                        tipoConstrucao: draft.moradia.tipoConstrucao,
                        usoImovel: draft.moradia.usoImovel,
                        situacaoDeOcupacao: draft.moradia.situacaoDeOcupacao,
                        pavimentos: Number(draft.moradia.pavimentos) || 1,
                        status: draft.moradia.status,
                        descricao: draft.moradia.descricao || null
                    }
                });
            }

            await Promise.all(draft.pessoas.map((pessoa) => atualizarPessoa(pessoa.id, {
                nome: pessoa.nome,
                nomeSocial: pessoa.nomeSocial || null,
                cpf: pessoa.cpf || null,
                dataDeNascimento: dataInput(pessoa.dataDeNascimento),
                parentesco: pessoa.parentesco || undefined,
                situacaoOcupacional: pessoa.situacaoOcupacional || undefined,
                escolaridade: pessoa.escolaridade || undefined,
                cronico: pessoa.cronico,
                medicacao: pessoa.medicacao,
                status: pessoa.status ?? 'Ativo'
            })));

            const detalheAtualizado = await detalharFamilia(familia.id);
            setDetalhes((prev) => ({ ...prev, [familia.id]: detalheAtualizado }));
            await carregar({ termo: termo.trim() || undefined, bairro: bairro.trim() || undefined });
            setEditando(null);
            toast.success('Cadastro atualizado.');
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao salvar cadastro.');
        }
    }

    async function excluir(f: FamiliaBuscaResultado) {
        const ok = await confirmDialog({
            title: 'Excluir família',
            message: `Tem certeza que deseja excluir o cadastro de "${f.responsavel?.nome ?? 'Sem responsável'}"? Esta ação não pode ser desfeita.`,
            okLabel: 'Excluir',
            danger: true
        });
        if (!ok) return;
        try {
            await removerFamilia(f.id);
            setResultados((prev) => prev.filter((x) => x.id !== f.id));
            toast.success('Cadastro excluído com sucesso.');
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao excluir cadastro.');
        }
    }

    function linhasExport() {
        return filtrados.map((f) => ({
            'ID da família': f.id,
            Responsavel: f.responsavel?.nome ?? 'Sem responsável',
            CPF: f.responsavel?.cpf ?? '',
            Bairro: f.bairro ?? '',
            Pessoas: f.totalPessoas,
            Pets: f.totalPets,
            Prioridades: tagsDaFamilia(f, prioridades).map((t) => t.label).join(', ')
        }));
    }

    function baixarCSV() {
        if (filtrados.length === 0) { toast.error('Nenhum dado para exportar.'); return; }
        exportarCSV(linhasExport(), 'georisco_familias');
        toast.success('CSV exportado.');
    }

    async function baixarPDF() {
        if (filtrados.length === 0) { toast.error('Nenhum dado para exportar.'); return; }
        try {
            await exportarPDF(
                {
                    titulo: 'GeoRisco Santo André — Famílias',
                    subtitulo: `Gerado em ${new Date().toLocaleString('pt-BR')} · ${filtrados.length} registro(s)`,
                    colunas: ['ID da família', 'Responsável', 'CPF', 'Bairro', 'Pessoas', 'Pets', 'Prioridades'],
                    linhas: filtrados.map((f) => [
                        f.id,
                        f.responsavel?.nome ?? 'Sem responsável',
                        f.responsavel?.cpf ?? '—',
                        f.bairro ?? '—',
                        f.totalPessoas,
                        f.totalPets,
                        tagsDaFamilia(f, prioridades).map((t) => t.label).join(', ') || '—'
                    ])
                },
                'georisco_familias'
            );
            toast.success('PDF exportado.');
        } catch {
            toast.error('Não foi possível gerar o PDF.');
        }
    }

    return (
        <div>
            <div className="pill-tabs" style={{ marginBottom: 14 }}>
                <button className={`pill-tab${abaBusca === 'familias' ? ' active' : ''}`} onClick={() => setAbaBusca('familias')}>
                    Busca por família
                </button>
                <button className={`pill-tab${abaBusca === 'moradias' ? ' active' : ''}`} onClick={() => setAbaBusca('moradias')}>
                    Busca por moradia
                </button>
            </div>

            {abaBusca === 'familias' && (
                <>
            <form onSubmit={pesquisar}>
                <div className="search-row">
                    <div className="search-input">
                        <input placeholder="Buscar responsável ou CPF" value={termo} onChange={(e) => setTermo(e.target.value)} />
                        <button type="submit" aria-label="Buscar" style={{ color: 'var(--cinza-escuro)' }}><Icon name="search" size={20} /></button>
                    </div>
                    <button type="button" className={`filter-btn${filtroAberto ? ' active' : ''}`} aria-label="Filtros" onClick={() => setFiltroAberto((v) => !v)}>
                        <Icon name="filter" size={20} />
                    </button>
                </div>
                {filtroAberto && (
                    <div className="card filtros-card">
                        <div className="field" style={{ marginBottom: 12 }}>
                            <label>Bairro</label>
                            <input placeholder="Filtrar por bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                        </div>
                        <p className="filtros-titulo">Prioridades</p>
                        <div className="chip-grupos">
	                            {prioridades.map((p) => (
	                                <button
	                                    type="button"
	                                    key={p.id}
	                                    className={`chip${prioridadesAtivas.has(p.id) ? ' on' : ''}`}
	                                    onClick={() => togglePrioridade(p.id)}
	                                >
                                    {p.condicao}
                                </button>
                            ))}
                        </div>
                        <button type="submit" className="btn btn-azul btn-block">Aplicar filtros</button>
                    </div>
                )}
            </form>

            <div className="resultados-head">
                <h2>Resultados:</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {jaBuscou && !erro && <span className="count-pill">{filtrados.length} encontrado(s)</span>}
                    {filtrados.length > 0 && (
                        <div className="export-actions">
                            <button className="btn-export" onClick={baixarCSV}><Icon name="arrow-down" size={15} /> CSV</button>
                            <button className="btn-export" onClick={baixarPDF}><Icon name="arrow-down" size={15} /> PDF</button>
                        </div>
                    )}
                </div>
            </div>

            {erro && <p className="error-msg">{erro}</p>}
            {carregando && <p className="state-msg">Buscando...</p>}
            {!carregando && !erro && jaBuscou && filtrados.length === 0 && (
                <p className="state-msg">Nenhuma família encontrada.</p>
            )}

            {filtrados.map((f) => {
                const detalhe = detalhes[f.id];
                const modoEdicao = editando === f.id;
                return (
                    <div key={f.id} className="familia-card">
                        <div className="familia-card-top">
                            <div style={{ flex: 1 }}>
                                <span className="familia-id-badge">ID da família #{f.id}</span>
                                <div className="nome">{f.responsavel?.nome ?? 'Sem responsável'}</div>
                                <div className="cpf">{f.responsavel?.cpf ?? 'CPF não informado'}</div>
                                <div className="familia-meta">
                                    <span><Icon name="map-pin" size={14} /> {f.bairro ?? 'Bairro n/d'}</span>
                                    <span><Icon name="person" size={14} /> {f.totalPessoas} pessoa(s)</span>
                                    <span><Icon name="paw" size={14} /> {f.totalPets} pet(s)</span>
                                </div>
                                <Tags familia={f} prioridades={prioridades} />
                            </div>
                            <div className="card-actions">
                                <button className="btn-editar" onClick={() => abrirDetalhes(f)}>
                                    {aberto === f.id ? 'Ocultar' : 'Detalhes'}
                                </button>
	                                <button className="btn-editar" onClick={() => navigate(`/cadastro?familiaId=${f.id}`)}><Icon name="edit" size={15} /> Editar</button>
                                <button className="btn-trash" aria-label="Remover" onClick={() => excluir(f)}><Icon name="trash" size={17} /></button>
                            </div>
                        </div>

                        {aberto === f.id && (
                            <div className="detalhe-panel">
                                {!detalhe || (detalhe.pessoas.length === 0 && detalhe.moradias.length === 0) ? (
                                    <p className="state-msg">Carregando detalhes...</p>
                                ) : (
                                    <>
                                        <section className="detail-section">
                                            <div className="detail-section-head">
                                                <h3>Moradia</h3>
                                                <span className="familia-id-badge">ID da família #{f.id}</span>
                                            </div>
                                            {modoEdicao && draft.moradia ? (
                                                <div className="edit-grid">
                                                    <label>Logradouro<input value={draft.moradia.logradouro} onChange={(e) => setMoradiaDraft('logradouro', e.target.value)} /></label>
                                                    <label>Número<input value={draft.moradia.numero} onChange={(e) => setMoradiaDraft('numero', e.target.value)} /></label>
                                                    <label>Bairro<input value={draft.moradia.bairro} onChange={(e) => setMoradiaDraft('bairro', e.target.value)} /></label>
                                                    <label>Cidade<input value={draft.moradia.cidade} onChange={(e) => setMoradiaDraft('cidade', e.target.value)} /></label>
                                                    <label>Estado<input value={draft.moradia.estado} onChange={(e) => setMoradiaDraft('estado', e.target.value.toUpperCase())} /></label>
                                                    <label>CEP<input value={draft.moradia.cep} onChange={(e) => setMoradiaDraft('cep', e.target.value)} /></label>
                                                    <label>Latitude<input value={draft.moradia.latitude} onChange={(e) => setMoradiaDraft('latitude', e.target.value)} /></label>
                                                    <label>Longitude<input value={draft.moradia.longitude} onChange={(e) => setMoradiaDraft('longitude', e.target.value)} /></label>
                                                    <label>Tipo{selecionar({ value: draft.moradia.tipoConstrucao, onChange: (v) => setMoradiaDraft('tipoConstrucao', v), options: TIPOS_CONSTRUCAO })}</label>
                                                    <label>Uso{selecionar({ value: draft.moradia.usoImovel, onChange: (v) => setMoradiaDraft('usoImovel', v), options: USOS_IMOVEL })}</label>
                                                    <label>Ocupação{selecionar({ value: draft.moradia.situacaoDeOcupacao, onChange: (v) => setMoradiaDraft('situacaoDeOcupacao', v), options: SITUACOES_OCUPACAO_MORADIA })}</label>
                                                    <label>Status{selecionar({ value: draft.moradia.status, onChange: (v) => setMoradiaDraft('status', v), options: STATUS_MORADIA })}</label>
                                                    <label>Pavimentos<input value={draft.moradia.pavimentos} onChange={(e) => setMoradiaDraft('pavimentos', e.target.value)} /></label>
                                                    <label className="edit-wide">Descrição<textarea value={draft.moradia.descricao} onChange={(e) => setMoradiaDraft('descricao', e.target.value)} /></label>
                                                </div>
                                            ) : (
                                                detalhe.moradias.map((m) => (
                                                    <div key={m.id} className="detail-list">
                                                        <p><strong>Endereço:</strong> {[m.localizacao.logradouro, m.localizacao.numero, m.localizacao.bairro].filter(Boolean).join(', ') || 'Não informado'}</p>
                                                        <p><strong>Cidade:</strong> {m.localizacao.cidade}/{m.localizacao.estado}</p>
                                                        <p><strong>Estrutura:</strong> {m.tipoConstrucao} · {m.usoImovel} · {m.situacaoDeOcupacao}</p>
                                                        <p><strong>Status:</strong> {m.status}</p>
                                                        <p><strong>Coordenadas:</strong> {m.localizacao.latitude}, {m.localizacao.longitude}</p>
                                                        <PhotoGallery owner="moradia" ownerId={m.id} />
                                                    </div>
                                                ))
                                            )}
                                        </section>

                                        <section className="detail-section">
                                            <h3>Moradores</h3>
                                            {modoEdicao ? (
                                                <div className="people-edit-list">
                                                    {draft.pessoas.map((pessoa) => (
                                                        <div key={pessoa.id} className="person-edit">
                                                            <label>Nome<input value={pessoa.nome} onChange={(e) => setPessoaDraft(pessoa.id, 'nome', e.target.value)} /></label>
                                                            <label>CPF<input value={pessoa.cpf ?? ''} onChange={(e) => setPessoaDraft(pessoa.id, 'cpf', e.target.value)} /></label>
                                                            <label>Nascimento<input type="date" value={dataInput(pessoa.dataDeNascimento)} onChange={(e) => setPessoaDraft(pessoa.id, 'dataDeNascimento', e.target.value)} /></label>
                                                            <label>Parentesco{selecionar({ value: pessoa.parentesco ?? '', onChange: (v) => setPessoaDraft(pessoa.id, 'parentesco', v), options: PARENTESCOS })}</label>
                                                            <label>Ocupação{selecionar({ value: pessoa.situacaoOcupacional ?? '', onChange: (v) => setPessoaDraft(pessoa.id, 'situacaoOcupacional', v), options: SITUACOES_OCUPACIONAIS })}</label>
                                                            <label>Escolaridade{selecionar({ value: pessoa.escolaridade ?? '', onChange: (v) => setPessoaDraft(pessoa.id, 'escolaridade', v), options: ESCOLARIDADES })}</label>
                                                            <label className="check-inline"><input type="checkbox" checked={pessoa.cronico} onChange={(e) => setPessoaDraft(pessoa.id, 'cronico', e.target.checked)} /> Doença crônica</label>
                                                            <label className="check-inline"><input type="checkbox" checked={pessoa.medicacao} onChange={(e) => setPessoaDraft(pessoa.id, 'medicacao', e.target.checked)} /> Medicação</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="detail-list">
                                                    {detalhe.pessoas.map((pessoa) => (
                                                        <p key={pessoa.id}>
                                                            <strong>{pessoa.nome}</strong> · {pessoa.parentesco} · {pessoa.cpf ?? 'CPF n/d'}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </section>

                                        <section className="detail-section">
                                            <h3>Pets</h3>
                                            <div className="detail-list">
                                                {detalhe.pets.length === 0 && <p>Nenhum pet cadastrado.</p>}
                                                {detalhe.pets.map((pet) => (
                                                    <div key={pet.id} className="pet-detail-item">
                                                        <p><strong>{pet.nome}</strong> · {pet.tipo} · {pet.status}</p>
                                                        <PhotoGallery owner="pet" ownerId={pet.id} />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {modoEdicao && (
                                            <div className="detail-actions">
                                                <button className="btn btn-outline" onClick={() => setEditando(null)}>Cancelar</button>
                                                <button className="btn btn-azul" onClick={() => salvarEdicao(f)}>Salvar</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
                </>
            )}

            {abaBusca === 'moradias' && (
                <>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <div className="search-row">
                            <div className="search-input">
                                <input
                                    placeholder="Buscar endereço, ID, estrutura ou status"
                                    value={termoMoradia}
                                    onChange={(e) => setTermoMoradia(e.target.value)}
                                />
                                <button type="submit" aria-label="Buscar" style={{ color: 'var(--cinza-escuro)' }}><Icon name="search" size={20} /></button>
                            </div>
                            <button type="button" className={`filter-btn${filtroAberto ? ' active' : ''}`} aria-label="Filtros" onClick={() => setFiltroAberto((v) => !v)}>
                                <Icon name="filter" size={20} />
                            </button>
                        </div>
                        {filtroAberto && (
                            <div className="card filtros-card">
                                <div className="field" style={{ marginBottom: 12 }}>
                                    <label>Bairro</label>
                                    <input placeholder="Filtrar por bairro" value={bairroMoradia} onChange={(e) => setBairroMoradia(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label>Status da moradia</label>
                                    <select value={statusMoradiaFiltro} onChange={(e) => setStatusMoradiaFiltro(e.target.value)}>
                                        <option value="">Todos</option>
                                        {STATUS_MORADIA.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="resultados-head">
                        <h2>Resultados de moradias:</h2>
                        <span className="count-pill">{moradiasFiltradas.length} encontrada(s)</span>
                    </div>

                    {moradiasFiltradas.length === 0 && <p className="state-msg">Nenhuma moradia encontrada.</p>}

                    {moradiasFiltradas.map((moradia) => {
                        const detalhe = detalhesMoradia[moradia.id];
                        const familiaAtiva = detalhe?.familias[0];
                        return (
                            <div key={moradia.id} className="familia-card">
                                <div className="familia-card-top">
                                    <div style={{ flex: 1 }}>
                                        <div className="nome">Moradia #{moradia.id}</div>
                                        <div className="cpf">
                                            {[moradia.localizacao.logradouro, moradia.localizacao.numero, moradia.localizacao.bairro].filter(Boolean).join(', ') || 'Endereço não informado'}
                                        </div>
                                        <div className="familia-meta">
                                            <span><Icon name="map-pin" size={14} /> {moradia.localizacao.cidade}/{moradia.localizacao.estado}</span>
                                            <span>{moradia.tipoConstrucao}</span>
                                            <span>{moradia.status}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-editar" onClick={() => void abrirDetalhesMoradia(moradia)}>
                                            {moradiaAberta === moradia.id ? 'Ocultar' : 'Detalhes'}
                                        </button>
                                        <button className="btn-editar" onClick={() => navigate(`/cadastro?moradiaId=${moradia.id}`)}>Usar no cadastro</button>
                                    </div>
                                </div>

                                {moradiaAberta === moradia.id && (
                                    <div className="detalhe-panel">
                                        {!detalhe ? (
                                            <p className="state-msg">Carregando detalhes...</p>
                                        ) : (
                                            <>
                                                <section className="detail-section">
                                                    <h3>Moradia</h3>
                                                    <div className="detail-list">
                                                        <p><strong>Endereço:</strong> {[moradia.localizacao.logradouro, moradia.localizacao.numero, moradia.localizacao.bairro].filter(Boolean).join(', ') || 'Não informado'}</p>
                                                        <p><strong>Cidade:</strong> {moradia.localizacao.cidade}/{moradia.localizacao.estado}</p>
                                                        <p><strong>Estrutura:</strong> {moradia.tipoConstrucao} · {moradia.usoImovel} · {moradia.situacaoDeOcupacao}</p>
                                                        <p><strong>Status:</strong> {moradia.status}</p>
                                                        <p><strong>Coordenadas:</strong> {moradia.localizacao.latitude}, {moradia.localizacao.longitude}</p>
                                                        {moradia.descricao && <p><strong>Descrição:</strong> {moradia.descricao}</p>}
                                                        <PhotoGallery owner="moradia" ownerId={moradia.id} initialFotos={detalhe.fotos} />
                                                    </div>
                                                </section>

                                                <section className="detail-section">
                                                    <h3>Família vinculada</h3>
                                                    {familiaAtiva ? (
                                                        <div className="detail-list">
                                                            <p><strong>Família #{familiaAtiva.familia.id}</strong></p>
                                                            <p>{familiaAtiva.pessoas.length} pessoa(s) · {familiaAtiva.pets.length} pet(s)</p>
                                                            <button className="btn-editar" onClick={() => void abrirFamiliaDaMoradia(familiaAtiva.familia.id)}>
                                                                Ver detalhe da família
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="detail-list">
                                                            <p>Nenhuma família ativa vinculada.</p>
                                                            <button className="btn-editar" onClick={() => navigate(`/cadastro?moradiaId=${moradia.id}`)}>
                                                                Cadastrar família nesta moradia
                                                            </button>
                                                        </div>
                                                    )}
                                                </section>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
