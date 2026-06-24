import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    atualizarMoradia,
    atualizarPessoa,
    atualizarPet,
    atualizarPrioridadesPessoa,
    atualizarResponsavel,
    buscarPessoas,
    cadastrarNucleoFamiliar,
    cadastrarPetFamilia,
    criarFamilia,
    criarMoradia,
    criarPessoa,
    criarResponsavel,
    detalharFamilia,
    detalharMoradia,
    enviarFoto,
    listarPessoas,
    listarMoradias,
    listarPrioridades,
    listarPrioridadesPessoa,
    obterPessoa,
    obterResponsavel,
    removerMoradiaFamilia,
    removerPet,
    removerPessoaFamilia,
    vincularMoradiaFamilia,
    vincularPessoaFamilia
} from '../api.ts';
import { toast } from '../components/feedback.tsx';
import { buscarCep, capturarGPS, maskCEP, maskCPF, maskTelefone } from '../utils/forms.ts';
import { CheckboxField, Row, SelectField, TextAreaField, TextField } from '../components/FormFields.tsx';
import LocationPicker from '../components/LocationPicker.tsx';
import PhotoPicker, { type FotoLocal } from '../components/PhotoPicker.tsx';
import {
    ESCOLARIDADES,
    ESTADOS_CIVIS,
    PARENTESCOS,
    RACAS,
    SEXOS,
    SITUACOES_OCUPACAO_MORADIA,
    SITUACOES_OCUPACIONAIS,
    STATUS_MORADIA,
    STATUS_PET,
    TIPOS_CONSTRUCAO,
    TIPOS_PET,
    USOS_IMOVEL
} from '../types.ts';
import type { CreateNucleoFamiliarPayload, CreatePessoaPayload, FamiliaDetalhe, MoradiaComLocalizacao, Pessoa, PessoaBuscaResultado, Pet, Prioridade } from '../types.ts';

const RESPONSAVEL = 'Responsável';

interface MoradorForm {
    id?: number;
    key: string;
    nome: string;
    nomeSocial: string;
    cpf: string;
    dataDeNascimento: string;
    parentesco: string;
    situacaoOcupacional: string;
    escolaridade: string;
    cronico: boolean;
    medicacao: boolean;
    // exclusivos do responsável
    localDeNascimento: string;
    nis: string;
    renda: string;
    sexo: string;
    raca: string;
    estadoCivil: string;
    email: string;
    telefone: string;
    nomeDoPai: string;
    nomeDaMae: string;
    dataResidenciaMoradia: string;
    dataResidenciaEstado: string;
    veiculo: boolean;
    programaSocial: boolean;
    prioridadeIds: number[];
}

interface PetForm {
    key: string;
    id?: number;
    tipo: string;
    nome: string;
    porte: string;
    raca: string;
    cor: string;
    status: string;
    observacao: string;
    fotos: FotoLocal[];
}

function novoMorador(parentesco = ''): MoradorForm {
    return {
        key: crypto.randomUUID(),
        nome: '', nomeSocial: '', cpf: '', dataDeNascimento: '', parentesco,
        situacaoOcupacional: '', escolaridade: '', cronico: false, medicacao: false,
        localDeNascimento: '', nis: '', renda: '', sexo: '', raca: '', estadoCivil: '',
        email: '', telefone: '', nomeDoPai: '', nomeDaMae: '',
        dataResidenciaMoradia: '', dataResidenciaEstado: '', veiculo: false, programaSocial: false,
        prioridadeIds: []
    };
}

function novoPet(): PetForm {
    return { key: crypto.randomUUID(), tipo: '', nome: '', porte: '', raca: '', cor: '', status: 'Ativo', observacao: '', fotos: [] };
}

function petFromPet(pet: Pet): PetForm {
    return {
        key: crypto.randomUUID(),
        id: pet.id,
        tipo: pet.tipo,
        nome: pet.nome,
        porte: pet.porte,
        raca: pet.raca,
        cor: pet.cor,
        status: pet.status,
        observacao: pet.observacao ?? '',
        fotos: []
    };
}

type Aba = 'moradia' | 'moradores' | 'pets' | 'visaoGeral';
const ABAS: { id: Aba; label: string }[] = [
    { id: 'moradia', label: 'Moradia' },
    { id: 'moradores', label: 'Moradores' },
    { id: 'pets', label: 'Pets e Animais' },
    { id: 'visaoGeral', label: 'Visão Geral' }
];
const TITULOS: Record<Aba, string> = {
    moradia: 'Cadastro - Moradia',
    moradores: 'Cadastro - Moradores',
    pets: 'Cadastro - Pets e animais',
    visaoGeral: 'Visão Geral'
};
type ModoMoradia = 'nova' | 'existente';

function limpar(valor: string): string | null {
    const t = valor.trim();
    return t === '' ? null : t;
}

function pessoaBase(m: MoradorForm): CreatePessoaPayload {
    return {
        nome: m.nome.trim(),
        nomeSocial: limpar(m.nomeSocial),
        cpf: m.cpf.trim() ? m.cpf.replace(/\D/g, '') : null,
        dataDeNascimento: m.dataDeNascimento,
        parentesco: m.parentesco,
        situacaoOcupacional: m.situacaoOcupacional,
        escolaridade: m.escolaridade,
        cronico: m.cronico,
        medicacao: m.medicacao
    };
}

export default function Cadastro() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const familiaIdParam = searchParams.get('familiaId');
    const pessoaIdParam = searchParams.get('pessoaId');
    const moradiaIdParam = searchParams.get('moradiaId');
    const familiaId = familiaIdParam ? Number(familiaIdParam) : null;
    const pessoaId = pessoaIdParam ? Number(pessoaIdParam) : null;
    const moradiaId = moradiaIdParam ? Number(moradiaIdParam) : null;
    const modoEdicao = Number.isInteger(familiaId) && Number(familiaId) > 0;
    const modoEdicaoPessoa = Number.isInteger(pessoaId) && Number(pessoaId) > 0;
    const [aba, setAba] = useState<Aba>(modoEdicaoPessoa ? 'moradores' : 'moradia');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [invalidos, setInvalidos] = useState<Set<string>>(new Set());
    const [capturando, setCapturando] = useState(false);
    const [gpsSolicitadoAutomaticamente, setGpsSolicitadoAutomaticamente] = useState(false);

    const [loc, setLoc] = useState({
        logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
        latitude: '', longitude: '', referencia: '', complemento: ''
    });
    const [moradia, setMoradia] = useState({
        tipoConstrucao: '', usoImovel: '', situacaoDeOcupacao: '', pavimentos: '1', status: 'Ativa', descricao: ''
    });
    const [moradores, setMoradores] = useState<MoradorForm[]>(() => [novoMorador(RESPONSAVEL)]);
    const [pets, setPets] = useState<PetForm[]>([]);
    const [moradoresAbertos, setMoradoresAbertos] = useState<Set<string>>(new Set());
    const [petsAbertos, setPetsAbertos] = useState<Set<string>>(new Set());
    const [fotosCasa, setFotosCasa] = useState<FotoLocal[]>([]);
    const [gpsSignal, setGpsSignal] = useState(0);
    const [prioridades, setPrioridades] = useState<Prioridade[]>([]);
    const [pessoasOriginais, setPessoasOriginais] = useState<number[]>([]);
    const [petsOriginais, setPetsOriginais] = useState<number[]>([]);
    const [moradiaOriginalId, setMoradiaOriginalId] = useState<number | null>(null);
    const [moradiaSelecionadaId, setMoradiaSelecionadaId] = useState<number | null>(null);
    const [modoMoradia, setModoMoradia] = useState<ModoMoradia>('nova');
    const [adicionarApenasFamilia, setAdicionarApenasFamilia] = useState(false);
    const [moradiasDisponiveis, setMoradiasDisponiveis] = useState<MoradiaComLocalizacao[]>([]);
    const [buscaPessoa, setBuscaPessoa] = useState('');
    const [pessoasEncontradas, setPessoasEncontradas] = useState<PessoaBuscaResultado[]>([]);
    const [buscandoPessoa, setBuscandoPessoa] = useState(false);
    const [mostrarBuscaPessoaExistente, setMostrarBuscaPessoaExistente] = useState(false);

    const temResponsavel = useMemo(() => moradores.some((m) => m.parentesco === RESPONSAVEL), [moradores]);
    const abasVisiveis = useMemo(
        () => {
            if (modoEdicaoPessoa) return ABAS.filter((a) => a.id === 'moradores');
            return ABAS;
        },
        [modoEdicaoPessoa]
    );

    const totalFotos = useMemo(
        () => fotosCasa.length + pets.reduce((acc, p) => acc + p.fotos.length, 0),
        [fotosCasa, pets]
    );
    const enderecoResumo = useMemo(
        () => [loc.logradouro, loc.numero, loc.bairro, loc.cidade, loc.estado].filter(Boolean).join(', '),
        [loc.bairro, loc.cidade, loc.estado, loc.logradouro, loc.numero]
    );

    const setLocField = (campo: keyof typeof loc, valor: string) => setLoc((p) => ({ ...p, [campo]: valor }));
    const setMoradiaField = (campo: keyof typeof moradia, valor: string) => setMoradia((p) => ({ ...p, [campo]: valor }));
    const updateMorador = (i: number, patch: Partial<MoradorForm>) =>
        setMoradores((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
    const updatePet = (i: number, patch: Partial<PetForm>) =>
        setPets((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
    const addFotosPet = (i: number, novas: FotoLocal[]) =>
        setPets((prev) => prev.map((p, idx) => (idx === i ? { ...p, fotos: [...p.fotos, ...novas] } : p)));
    const removeFotoPet = (i: number, key: string) =>
        setPets((prev) => prev.map((p, idx) => (idx === i ? { ...p, fotos: p.fotos.filter((f) => f.key !== key) } : p)));

    useEffect(() => {
        listarPrioridades()
            .then(setPrioridades)
            .catch(() => toast.error('Não foi possível carregar prioridades.'));
    }, []);

    useEffect(() => {
        if (!modoEdicao || !familiaId) return;
        void carregarCadastro(familiaId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modoEdicao, familiaId]);

    useEffect(() => {
        if (modoEdicaoPessoa) return;
        listarMoradias()
            .then(setMoradiasDisponiveis)
            .catch(() => toast.error('Não foi possível carregar moradias para vínculo.'));
    }, [modoEdicaoPessoa]);

    useEffect(() => {
        if (!modoEdicaoPessoa || !pessoaId) return;
        void carregarPessoa(pessoaId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modoEdicaoPessoa, pessoaId]);

    useEffect(() => {
        if (modoEdicao || modoEdicaoPessoa || !moradiaId || !Number.isInteger(moradiaId) || moradiaId <= 0) return;
        void carregarMoradiaSemFamilia(moradiaId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modoEdicao, modoEdicaoPessoa, moradiaId]);

    useEffect(() => {
        if (modoEdicaoPessoa && aba === 'pets') {
            setAba('moradores');
        }
    }, [aba, modoEdicaoPessoa]);

    useEffect(() => {
        setMoradoresAbertos((prev) => sincronizarCardsAbertos(prev, moradores.map((m) => m.key), true));
    }, [moradores]);

    useEffect(() => {
        setPetsAbertos((prev) => sincronizarCardsAbertos(prev, pets.map((p) => p.key), false));
    }, [pets]);

    useEffect(() => {
        if (!mostrarBuscaPessoaExistente || modoEdicaoPessoa) return;
        const timer = window.setTimeout(() => {
            void pesquisarPessoaExistente(buscaPessoa);
        }, 250);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mostrarBuscaPessoaExistente, buscaPessoa, moradores, modoEdicaoPessoa]);

    useEffect(() => {
        if (
            gpsSolicitadoAutomaticamente ||
            modoEdicao ||
            modoEdicaoPessoa ||
            moradiaId ||
            adicionarApenasFamilia ||
            modoMoradia !== 'nova'
        ) {
            return;
        }
        setGpsSolicitadoAutomaticamente(true);
        void pegarGPS();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gpsSolicitadoAutomaticamente, modoEdicao, modoEdicaoPessoa, moradiaId, adicionarApenasFamilia, modoMoradia]);

    // posiciona o pino no mapa (clique/arraste) sem disparar recentralização
    const setCoord = (lat: number, lng: number) => {
        setLoc((p) => ({ ...p, latitude: String(lat), longitude: String(lng) }));
        limparInvalido('latitude');
        limparInvalido('longitude');
    };

    function sincronizarCardsAbertos(prev: Set<string>, keys: string[], abrirPrimeiro: boolean) {
        const keysAtuais = new Set(keys);
        const next = new Set([...prev].filter((key) => keysAtuais.has(key)));
        if (abrirPrimeiro && next.size === 0 && keys[0]) {
            next.add(keys[0]);
        }
        return next;
    }

    function toggleMoradorCard(key: string) {
        setMoradoresAbertos((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    function togglePetCard(key: string) {
        setPetsAbertos((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    function adicionarMorador() {
        const novo = novoMorador();
        setMoradores((prev) => [...prev, novo]);
        setMoradoresAbertos((prev) => new Set(prev).add(novo.key));
    }

    function adicionarPet() {
        const novo = novoPet();
        setPets((prev) => [...prev, novo]);
        setPetsAbertos((prev) => new Set(prev).add(novo.key));
    }

    function abrirCardsComCamposInvalidos(campos: string[]) {
        const chavesMoradores = campos
            .filter((campo) => campo.includes(':') && moradores.some((m) => campo.startsWith(`${m.key}:`)))
            .map((campo) => campo.split(':')[0]);
        const chavesPets = campos
            .filter((campo) => campo.includes(':') && pets.some((p) => campo.startsWith(`${p.key}:`)))
            .map((campo) => campo.split(':')[0]);

        if (chavesMoradores.length > 0) {
            setMoradoresAbertos((prev) => new Set([...prev, ...chavesMoradores]));
        }
        if (chavesPets.length > 0) {
            setPetsAbertos((prev) => new Set([...prev, ...chavesPets]));
        }
    }

    const invalido = (chave: string) => invalidos.has(chave);
    const limparInvalido = (chave: string) =>
        setInvalidos((prev) => {
            if (!prev.has(chave)) return prev;
            const next = new Set(prev);
            next.delete(chave);
            return next;
        });

    function moradorFromPessoa(pessoa: Pessoa, prioridadeIds: number[], responsavel?: Pessoa): MoradorForm {
        return {
            ...novoMorador(pessoa.parentesco ?? ''),
            id: pessoa.id,
            nome: pessoa.nome,
            nomeSocial: pessoa.nomeSocial ?? '',
            cpf: pessoa.cpf ?? '',
            dataDeNascimento: pessoa.dataDeNascimento ? String(pessoa.dataDeNascimento).slice(0, 10) : '',
            parentesco: pessoa.parentesco ?? '',
            situacaoOcupacional: pessoa.situacaoOcupacional ?? '',
            escolaridade: pessoa.escolaridade ?? '',
            cronico: pessoa.cronico,
            medicacao: pessoa.medicacao,
            localDeNascimento: responsavel?.localDeNascimento ?? '',
            nis: responsavel?.nis ?? '',
            renda: responsavel?.renda === null || responsavel?.renda === undefined ? '' : String(responsavel.renda),
            sexo: responsavel?.sexo ?? '',
            raca: responsavel?.raca ?? '',
            estadoCivil: responsavel?.estadoCivil ?? '',
            email: responsavel?.email ?? '',
            telefone: responsavel?.telefone ?? '',
            nomeDoPai: responsavel?.nomeDoPai ?? '',
            nomeDaMae: responsavel?.nomeDaMae ?? '',
            dataResidenciaMoradia: responsavel?.dataResidenciaMoradia ? String(responsavel.dataResidenciaMoradia).slice(0, 10) : '',
            dataResidenciaEstado: responsavel?.dataResidenciaEstado ? String(responsavel.dataResidenciaEstado).slice(0, 10) : '',
            veiculo: Boolean(responsavel?.veiculo),
            programaSocial: Boolean(responsavel?.programaSocial),
            prioridadeIds
        };
    }

    function aplicarMoradiaSelecionada(m: MoradiaComLocalizacao) {
        setMoradiaSelecionadaId(m.id);
        setModoMoradia('existente');
        setAdicionarApenasFamilia(false);
        setLoc({
            logradouro: m.localizacao.logradouro ?? '',
            numero: m.localizacao.numero ?? '',
            bairro: m.localizacao.bairro ?? '',
            cidade: m.localizacao.cidade ?? '',
            estado: m.localizacao.estado ?? '',
            cep: m.localizacao.cep ?? '',
            latitude: String(m.localizacao.latitude ?? ''),
            longitude: String(m.localizacao.longitude ?? ''),
            referencia: m.localizacao.referencia ?? '',
            complemento: m.localizacao.complemento ?? ''
        });
        setMoradia({
            tipoConstrucao: m.tipoConstrucao ?? '',
            usoImovel: m.usoImovel ?? '',
            situacaoDeOcupacao: m.situacaoDeOcupacao ?? '',
            pavimentos: String(m.pavimentos ?? 1),
            status: m.status ?? 'Ativa',
            descricao: m.descricao ?? ''
        });
    }

    function limparFormularioMoradia() {
        setMoradiaSelecionadaId(null);
        setLoc({
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
            latitude: '',
            longitude: '',
            referencia: '',
            complemento: ''
        });
        setMoradia({
            tipoConstrucao: '',
            usoImovel: '',
            situacaoDeOcupacao: '',
            pavimentos: '1',
            status: 'Ativa',
            descricao: ''
        });
        setFotosCasa([]);
    }

    function selecionarModoMoradia(modo: ModoMoradia) {
        setModoMoradia(modo);
        if (modo === 'nova') {
            limparFormularioMoradia();
        }
    }

    async function selecionarMoradiaExistente(id: string) {
        const parsed = Number(id);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            setMoradiaSelecionadaId(null);
            return;
        }
        try {
            const detalhes = await detalharMoradia(parsed);
            const familiaOcupante = detalhes.familias.find((item) => item.familia.id !== familiaId);
            if (familiaOcupante) {
                toast.error('Esta moradia já possui uma família ativa.');
                return;
            }
            aplicarMoradiaSelecionada(detalhes.moradia);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao carregar moradia.');
        }
    }

    async function carregarMoradiaSemFamilia(idMoradia: number) {
        setEnviando(true);
        setErro(null);
        try {
            const detalhes = await detalharMoradia(idMoradia);
            if (detalhes.familias.length > 0) {
                toast.error('Esta moradia já possui família ativa.');
                navigate(`/busca?familiaId=${detalhes.familias[0].familia.id}`);
                return;
            }
            aplicarMoradiaSelecionada(detalhes.moradia);
            setAba('moradia');
            setMoradores([novoMorador(RESPONSAVEL)]);
            setPets([]);
            setPessoasOriginais([]);
            setMoradiaOriginalId(null);
            setAdicionarApenasFamilia(false);
            toast.info('Moradia carregada. Preencha os dados da família.');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao carregar moradia.';
            setErro(msg);
            toast.error(msg);
        } finally {
            setEnviando(false);
        }
    }

    async function pesquisarPessoaExistente(termoBusca = buscaPessoa) {
        const termo = termoBusca.trim();
        setBuscandoPessoa(true);
        try {
            const apenasDigitos = termo.replace(/\D/g, '');
            const ehCpf = apenasDigitos.length >= 3 && apenasDigitos.length / termo.length > 0.6;
            const pessoas = termo
                ? await buscarPessoas({
                    escopo: 'todas',
                    nome: ehCpf ? undefined : termo,
                    cpf: ehCpf ? apenasDigitos : undefined
                })
                : await listarPessoas();
            setPessoasEncontradas(
                pessoas
                    .filter((p) => {
                        const responsavelAtivo = p.responsavel && p.status === 'Ativo';
                        return !responsavelAtivo && !moradores.some((m) => m.id === p.id);
                    })
                    .slice(0, termo ? 5 : 3)
            );
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao buscar pessoas.');
        } finally {
            setBuscandoPessoa(false);
        }
    }

    async function adicionarPessoaExistente(pessoa: PessoaBuscaResultado) {
        try {
            const [detalhePessoa, prioridadesPessoa] = await Promise.all([
                obterPessoa(pessoa.id),
                listarPrioridadesPessoa(pessoa.id).catch(() => [])
            ]);
            if (detalhePessoa.parentesco === RESPONSAVEL && temResponsavel) {
                toast.error('Esta família já possui responsável.');
                return;
            }
            const responsavelDetalhe = await obterResponsavel(pessoa.id).catch(() => undefined);
            const novo = moradorFromPessoa(
                responsavelDetalhe ?? detalhePessoa,
                prioridadesPessoa.map((prioridade) => prioridade.id),
                responsavelDetalhe
            );
            setMoradores((prev) => [...prev, novo]);
            setMoradoresAbertos((prev) => new Set(prev).add(novo.key));
            setPessoasEncontradas((prev) => prev.filter((p) => p.id !== pessoa.id));
            toast.success('Pessoa adicionada ao formulário.');
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao adicionar pessoa.');
        }
    }

    async function carregarCadastro(idFamilia: number) {
        setEnviando(true);
        setErro(null);
        try {
            const detalhe: FamiliaDetalhe = await detalharFamilia(idFamilia);
            const moradiaAtual = detalhe.moradias[0];
            setAdicionarApenasFamilia(!moradiaAtual);
            if (moradiaAtual) {
                setMoradiaOriginalId(moradiaAtual.id);
                setMoradiaSelecionadaId(moradiaAtual.id);
                setModoMoradia('existente');
                setLoc({
                    logradouro: moradiaAtual.localizacao.logradouro ?? '',
                    numero: moradiaAtual.localizacao.numero ?? '',
                    bairro: moradiaAtual.localizacao.bairro ?? '',
                    cidade: moradiaAtual.localizacao.cidade ?? '',
                    estado: moradiaAtual.localizacao.estado ?? '',
                    cep: moradiaAtual.localizacao.cep ?? '',
                    latitude: String(moradiaAtual.localizacao.latitude ?? ''),
                    longitude: String(moradiaAtual.localizacao.longitude ?? ''),
                    referencia: moradiaAtual.localizacao.referencia ?? '',
                    complemento: moradiaAtual.localizacao.complemento ?? ''
                });
                setMoradia({
                    tipoConstrucao: moradiaAtual.tipoConstrucao ?? '',
                    usoImovel: moradiaAtual.usoImovel ?? '',
                    situacaoDeOcupacao: moradiaAtual.situacaoDeOcupacao ?? '',
                    pavimentos: String(moradiaAtual.pavimentos ?? 1),
                    status: moradiaAtual.status ?? 'Ativa',
                    descricao: moradiaAtual.descricao ?? ''
                });
            }

            const prioridadePorPessoa = await Promise.all(
                detalhe.pessoas.map(async (pessoa) => {
                    try {
                        const pessoaPrioridades = await listarPrioridadesPessoa(pessoa.id);
                        return [pessoa.id, pessoaPrioridades.map((p) => p.id)] as const;
                    } catch {
                        return [pessoa.id, [] as number[]] as const;
                    }
                })
            );
            const prioridadeMap = new Map(prioridadePorPessoa);
            const responsavelPessoa = detalhe.pessoas.find((pessoa) => pessoa.parentesco === RESPONSAVEL);
            let responsavelDetalhe: Pessoa | undefined;
            if (responsavelPessoa) {
                try {
                    responsavelDetalhe = await obterResponsavel(responsavelPessoa.id);
                } catch {
                    responsavelDetalhe = undefined;
                }
            }
            setPessoasOriginais(detalhe.pessoas.map((pessoa) => pessoa.id));
            setMoradores(detalhe.pessoas.map((pessoa) => moradorFromPessoa(
                pessoa,
                prioridadeMap.get(pessoa.id) ?? [],
                pessoa.id === responsavelPessoa?.id ? responsavelDetalhe : undefined
            )));
            setPetsOriginais(detalhe.pets.map((pet) => pet.id));
            setPets(detalhe.pets.map(petFromPet));
            setFotosCasa([]);
            toast.info('Cadastro carregado para edição.');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao carregar cadastro.';
            setErro(msg);
            toast.error(msg);
        } finally {
            setEnviando(false);
        }
    }

    async function carregarPessoa(idPessoa: number) {
        setEnviando(true);
        setErro(null);
        try {
            const pessoaBaseDetalhe = await obterPessoa(idPessoa);
            const pessoaPrioridades = await listarPrioridadesPessoa(idPessoa).catch(() => []);
            let responsavelDetalhe: Pessoa | undefined;
            if (pessoaBaseDetalhe.parentesco === RESPONSAVEL) {
                responsavelDetalhe = await obterResponsavel(idPessoa).catch(() => undefined);
            }

            setAba('moradores');
            setAdicionarApenasFamilia(true);
            setPets([]);
            setFotosCasa([]);
            setPessoasOriginais([idPessoa]);
            setMoradiaOriginalId(null);
            setMoradiaSelecionadaId(null);
            setMoradores([
                moradorFromPessoa(
                    responsavelDetalhe ?? pessoaBaseDetalhe,
                    pessoaPrioridades.map((prioridade) => prioridade.id),
                    responsavelDetalhe
                )
            ]);
            toast.info('Pessoa carregada para edição.');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao carregar pessoa.';
            setErro(msg);
            toast.error(msg);
        } finally {
            setEnviando(false);
        }
    }

    // valida aba de moradia -> retorna { campos, msg }
    function validarMoradia(): { campos: string[]; msg: string | null } {
        if (adicionarApenasFamilia) return { campos: [], msg: null };
        const campos: string[] = [];
        if (!loc.cidade.trim()) campos.push('cidade');
        if (!loc.estado.trim()) campos.push('estado');
        if (!loc.latitude.trim() || Number.isNaN(Number(loc.latitude))) campos.push('latitude');
        if (!loc.longitude.trim() || Number.isNaN(Number(loc.longitude))) campos.push('longitude');
        if (!moradia.tipoConstrucao) campos.push('tipoConstrucao');
        if (!moradia.situacaoDeOcupacao) campos.push('situacaoDeOcupacao');
        if (!moradia.usoImovel) campos.push('usoImovel');
        const msg = campos.length
            ? campos.includes('latitude') || campos.includes('longitude')
                ? 'Aguarde a captura da localização ou marque a posição no mapa, e preencha os dados da moradia.'
                : 'Preencha os campos obrigatórios da moradia.'
            : null;
        return { campos, msg };
    }

    // valida aba de moradores -> retorna { campos, msg }
    function validarMoradores(): { campos: string[]; msg: string | null } {
        const campos: string[] = [];
        const responsavel = moradores.find((m) => m.parentesco === RESPONSAVEL);
        if (!modoEdicaoPessoa && !responsavel) return { campos: [], msg: 'Cadastre um responsável antes de acessar a Visão Geral.' };
        for (const m of moradores) {
            if (!m.nome.trim()) campos.push(`${m.key}:nome`);
            if (!m.dataDeNascimento) campos.push(`${m.key}:data`);
            if (!m.parentesco) campos.push(`${m.key}:parentesco`);
            if (!m.situacaoOcupacional) campos.push(`${m.key}:ocupacao`);
            if (!m.escolaridade) campos.push(`${m.key}:escolaridade`);
            if (m.parentesco === RESPONSAVEL) {
                if (!m.sexo) campos.push(`${m.key}:sexo`);
                if (!m.raca) campos.push(`${m.key}:raca`);
                if (!m.estadoCivil) campos.push(`${m.key}:estadoCivil`);
            }
        }
        return { campos, msg: campos.length ? 'Preencha os dados obrigatórios de cada morador.' : null };
    }

    function validarPets(): { campos: string[]; msg: string | null } {
        const campos: string[] = [];
        for (const p of pets) {
            if (!p.nome.trim()) campos.push(`${p.key}:petNome`);
            if (!p.tipo) campos.push(`${p.key}:petTipo`);
        }
        return { campos, msg: campos.length ? 'Preencha nome e tipo dos animais adicionados.' : null };
    }

    function avancarDe(de: Aba, para: Aba) {
        const r = de === 'moradia' ? validarMoradia() : de === 'moradores' ? validarMoradores() : validarPets();
        if (r.msg) {
            setInvalidos(new Set(r.campos));
            abrirCardsComCamposInvalidos(r.campos);
            toast.error(r.msg);
            return;
        }
        setInvalidos(new Set());
        navegarParaAba(para, true);
    }

    function navegarParaAba(proximaAba: Aba, rolarAoTopo = false) {
        setAba(proximaAba);
        if (!rolarAoTopo) return;
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function validarTudoAntesDaRevisao(): boolean {
        const rMoradia = validarMoradia();
        const rMoradores = validarMoradores();
        const rPets = validarPets();
        if (rMoradia.msg || rMoradores.msg || rPets.msg) {
            const camposInvalidos = [...rMoradia.campos, ...rMoradores.campos, ...rPets.campos];
            setInvalidos(new Set(camposInvalidos));
            abrirCardsComCamposInvalidos(camposInvalidos);
            if (rMoradia.msg) {
                setAba('moradia');
                toast.error(rMoradia.msg);
            } else if (rMoradores.msg) {
                setAba('moradores');
                toast.error(rMoradores.msg);
            } else {
                setAba('pets');
                toast.error(rPets.msg!);
            }
            return false;
        }
        setInvalidos(new Set());
        return true;
    }

    function irParaVisaoGeral() {
        if (validarTudoAntesDaRevisao()) {
            navegarParaAba('visaoGeral', true);
        }
    }

    async function pegarGPS() {
        setCapturando(true);
        const c = await capturarGPS();
        setLoc((p) => ({ ...p, latitude: String(c.latitude), longitude: String(c.longitude) }));
        limparInvalido('latitude');
        limparInvalido('longitude');
        setGpsSignal((s) => s + 1);
        setCapturando(false);
        toast.success(c.demo ? 'Coordenadas aproximadas (modo demonstração).' : `Localização capturada (±${c.accuracy}m).`);
    }

    async function lookupCep() {
        const endereco = await buscarCep(loc.cep);
        if (!endereco) return;
        setLoc((p) => ({
            ...p,
            logradouro: endereco.logradouro || p.logradouro,
            bairro: endereco.bairro || p.bairro,
            cidade: endereco.cidade || p.cidade,
            estado: endereco.uf || p.estado
        }));
        toast.info('Endereço preenchido pelo CEP.');
    }

    function payloadResponsavel(m: MoradorForm): Record<string, unknown> {
        return {
            ...pessoaBase(m),
            parentesco: RESPONSAVEL,
            localDeNascimento: limpar(m.localDeNascimento),
            nis: limpar(m.nis),
            renda: m.renda.trim() ? Number(m.renda) : null,
            sexo: m.sexo,
            raca: m.raca,
            estadoCivil: m.estadoCivil,
            email: limpar(m.email),
            telefone: m.telefone.trim() ? m.telefone.replace(/\D/g, '') : null,
            nomeDoPai: limpar(m.nomeDoPai),
            nomeDaMae: limpar(m.nomeDaMae),
            dataResidenciaMoradia: limpar(m.dataResidenciaMoradia),
            dataResidenciaEstado: limpar(m.dataResidenciaEstado),
            veiculo: m.veiculo,
            programaSocial: m.programaSocial
        };
    }

    async function salvarEdicao() {
        if (!familiaId) return;
        setErro(null);
        try {
            let moradiaParaSalvarId = moradiaSelecionadaId ?? moradiaOriginalId;
            if (adicionarApenasFamilia && moradiaOriginalId) {
                await removerMoradiaFamilia(familiaId, moradiaOriginalId);
                moradiaParaSalvarId = null;
            }
            if (!adicionarApenasFamilia && modoMoradia === 'nova') {
                moradiaParaSalvarId = (await criarMoradia({
                    localizacao: localizacaoPayload(),
                    moradia: moradiaPayload()
                })).id;
            }
            if (moradiaParaSalvarId && !adicionarApenasFamilia) {
                if (!moradiaOriginalId || moradiaParaSalvarId !== moradiaOriginalId) {
                    await vincularMoradiaFamilia(familiaId, moradiaParaSalvarId, moradia.status);
                }
                if (moradiaOriginalId && moradiaParaSalvarId !== moradiaOriginalId) {
                    await removerMoradiaFamilia(familiaId, moradiaOriginalId);
                }
                await atualizarMoradia(moradiaParaSalvarId, {
                    localizacao: {
                        logradouro: limpar(loc.logradouro),
                        numero: limpar(loc.numero),
                        bairro: limpar(loc.bairro),
                        cidade: loc.cidade.trim(),
                        estado: loc.estado.trim().toUpperCase(),
                        cep: loc.cep.trim() ? loc.cep.replace(/\D/g, '') : null,
                        latitude: Number(loc.latitude),
                        longitude: Number(loc.longitude),
                        referencia: limpar(loc.referencia),
                        complemento: limpar(loc.complemento)
                    },
                    moradia: {
                        tipoConstrucao: moradia.tipoConstrucao,
                        usoImovel: moradia.usoImovel,
                        situacaoDeOcupacao: moradia.situacaoDeOcupacao,
                        pavimentos: Number(moradia.pavimentos) || 1,
                        status: moradia.status,
                        descricao: limpar(moradia.descricao)
                    }
                });
            }

            const idsPetsMantidos = new Set(pets.map((pet) => pet.id).filter((id): id is number => Number.isInteger(id)));
            await Promise.all(
                petsOriginais
                    .filter((idPet) => !idsPetsMantidos.has(idPet))
                    .map((idPet) => removerPet(idPet))
            );

            const petIdsPorKey = new Map<string, number>();
            for (const pet of pets) {
                if (pet.id) {
                    const atualizado = await atualizarPet(pet.id, petPayload(pet));
                    petIdsPorKey.set(pet.key, atualizado.id);
                } else {
                    const criado = await cadastrarPetFamilia(familiaId, petPayload(pet));
                    petIdsPorKey.set(pet.key, criado.id);
                }
            }

            const idsMantidos = new Set(moradores.map((m) => m.id).filter((id): id is number => Number.isInteger(id)));
            await Promise.all(
                pessoasOriginais
                    .filter((idPessoa) => !idsMantidos.has(idPessoa))
                    .map((idPessoa) => removerPessoaFamilia(familiaId, idPessoa))
            );

            for (const morador of moradores) {
                let idPessoa = morador.id;
                if (idPessoa) {
                    if (morador.parentesco === RESPONSAVEL) {
                        await atualizarResponsavel(idPessoa, payloadResponsavel(morador));
                    } else {
                        await atualizarPessoa(idPessoa, pessoaBase(morador));
                    }
                    if (!pessoasOriginais.includes(idPessoa)) {
                        await vincularPessoaFamilia(familiaId, idPessoa);
                    }
                } else if (morador.parentesco === RESPONSAVEL) {
                    const criado = await criarResponsavel(payloadResponsavel(morador));
                    idPessoa = criado.id;
                    await vincularPessoaFamilia(familiaId, idPessoa);
                } else {
                    const criado = await criarPessoa(pessoaBase(morador));
                    idPessoa = criado.id;
                    await vincularPessoaFamilia(familiaId, idPessoa);
                }

                await atualizarPrioridadesPessoa(idPessoa, morador.prioridadeIds);
            }

            await enviarFotosEdicao(moradiaParaSalvarId, petIdsPorKey);

            toast.success('Cadastro atualizado com sucesso.');
            if (adicionarApenasFamilia) {
                setMoradiaOriginalId(null);
                setMoradiaSelecionadaId(null);
            }
            navigate('/busca');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar cadastro.';
            setErro(msg);
            toast.error(msg);
        }
    }

    async function salvarEdicaoPessoa() {
        const morador = moradores[0];
        if (!pessoaId || !morador) return;
        setErro(null);
        try {
            if (morador.parentesco === RESPONSAVEL) {
                await atualizarResponsavel(pessoaId, payloadResponsavel(morador));
            } else {
                await atualizarPessoa(pessoaId, pessoaBase(morador));
            }
            await atualizarPrioridadesPessoa(pessoaId, morador.prioridadeIds);
            toast.success('Pessoa atualizada com sucesso.');
            navigate('/pessoas');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar pessoa.';
            setErro(msg);
            toast.error(msg);
        }
    }

    function localizacaoPayload(): NonNullable<CreateNucleoFamiliarPayload['localizacao']> {
        return {
            logradouro: limpar(loc.logradouro),
            numero: limpar(loc.numero),
            bairro: limpar(loc.bairro),
            cidade: loc.cidade.trim(),
            estado: loc.estado.trim().toUpperCase(),
            cep: loc.cep.trim() ? loc.cep.replace(/\D/g, '') : null,
            latitude: Number(loc.latitude),
            longitude: Number(loc.longitude),
            referencia: limpar(loc.referencia),
            complemento: limpar(loc.complemento)
        };
    }

    function moradiaPayload(): NonNullable<CreateNucleoFamiliarPayload['moradia']> {
        return {
            tipoConstrucao: moradia.tipoConstrucao,
            usoImovel: moradia.usoImovel,
            situacaoDeOcupacao: moradia.situacaoDeOcupacao,
            pavimentos: Number(moradia.pavimentos) || 1,
            status: moradia.status,
            descricao: limpar(moradia.descricao)
        };
    }

    function petPayload(p: PetForm) {
        return {
            tipo: p.tipo,
            nome: p.nome.trim(),
            porte: p.porte.trim(),
            raca: p.raca.trim(),
            cor: p.cor.trim(),
            status: p.status,
            observacao: limpar(p.observacao)
        };
    }

    async function salvarNovoComVinculos(responsavelForm: MoradorForm, dependentesMoradores: MoradorForm[]) {
        const familia = await criarFamilia();
        let moradiaCriada: { id: number } | null = null;
        if (!adicionarApenasFamilia) {
            const idMoradia = moradiaSelecionadaId
                ?? (await criarMoradia({ localizacao: localizacaoPayload(), moradia: moradiaPayload() })).id;
            if (moradiaSelecionadaId) {
                await atualizarMoradia(idMoradia, { localizacao: localizacaoPayload(), moradia: moradiaPayload() });
            }
            await vincularMoradiaFamilia(familia.id, idMoradia, moradia.status);
            moradiaCriada = { id: idMoradia };
        }

        const todosMoradores = [responsavelForm, ...dependentesMoradores];
        const dependentesCriados: { id: number }[] = [];
        let responsavelCriado = { id: responsavelForm.id ?? 0 };

        for (const morador of todosMoradores) {
            let idPessoa = morador.id;
            if (idPessoa) {
                if (morador.parentesco === RESPONSAVEL) {
                    await atualizarResponsavel(idPessoa, payloadResponsavel(morador));
                    responsavelCriado = { id: idPessoa };
                } else {
                    await atualizarPessoa(idPessoa, pessoaBase(morador));
                    dependentesCriados.push({ id: idPessoa });
                }
            } else if (morador.parentesco === RESPONSAVEL) {
                const criado = await criarResponsavel(payloadResponsavel(morador));
                idPessoa = criado.id;
                responsavelCriado = { id: criado.id };
            } else {
                const criado = await criarPessoa(pessoaBase(morador));
                idPessoa = criado.id;
                dependentesCriados.push({ id: criado.id });
            }
            await vincularPessoaFamilia(familia.id, idPessoa);
            await atualizarPrioridadesPessoa(idPessoa, morador.prioridadeIds);
        }

        const petsCriados = [];
        for (const pet of pets) {
            const criado = await cadastrarPetFamilia(familia.id, petPayload(pet));
            petsCriados.push({ id: criado.id });
        }

        return {
            familia,
            moradia: moradiaCriada,
            responsavel: responsavelCriado,
            dependentes: dependentesCriados,
            pets: petsCriados,
            fotos: []
        };
    }

    async function enviar() {
        const rMoradia = validarMoradia();
        const rMoradores = validarMoradores();
        const rPets = validarPets();
        if (rMoradia.msg || rMoradores.msg || rPets.msg) {
            const camposInvalidos = [...rMoradia.campos, ...rMoradores.campos, ...rPets.campos];
            setInvalidos(new Set(camposInvalidos));
            abrirCardsComCamposInvalidos(camposInvalidos);
            if (rMoradia.msg) {
                setAba('moradia');
                toast.error(rMoradia.msg);
            } else if (rMoradores.msg) {
                setAba('moradores');
                toast.error(rMoradores.msg!);
            } else {
                setAba('pets');
                toast.error(rPets.msg!);
            }
            return;
        }
        setInvalidos(new Set());
        setErro(null);
        setEnviando(true);

        if (modoEdicao) {
            await salvarEdicao();
            setEnviando(false);
            return;
        }
        if (modoEdicaoPessoa) {
            await salvarEdicaoPessoa();
            setEnviando(false);
            return;
        }

        const r = moradores.find((m) => m.parentesco === RESPONSAVEL)!;
        const dependentesMoradores = moradores.filter((m) => m.parentesco !== RESPONSAVEL);
        const dependentes = dependentesMoradores.map(pessoaBase);
        const temVinculosExistentes = moradores.some((m) => m.id) || Boolean(moradiaSelecionadaId);

        const payload: CreateNucleoFamiliarPayload = {
            responsavel: {
                ...pessoaBase(r),
                parentesco: RESPONSAVEL,
                localDeNascimento: limpar(r.localDeNascimento),
                nis: limpar(r.nis),
                renda: r.renda.trim() ? Number(r.renda) : null,
                sexo: r.sexo,
                raca: r.raca,
                estadoCivil: r.estadoCivil,
                email: limpar(r.email),
                telefone: r.telefone.trim() ? r.telefone.replace(/\D/g, '') : null,
                nomeDoPai: limpar(r.nomeDoPai),
                nomeDaMae: limpar(r.nomeDaMae),
                dataResidenciaMoradia: limpar(r.dataResidenciaMoradia),
                dataResidenciaEstado: limpar(r.dataResidenciaEstado),
                veiculo: r.veiculo,
                programaSocial: r.programaSocial
            },
            dependentes,
            pets: pets.map(petPayload)
        };

        if (!adicionarApenasFamilia) {
            payload.localizacao = localizacaoPayload();
            payload.moradia = moradiaPayload();
        }

        try {
            const nucleo = temVinculosExistentes
                ? await salvarNovoComVinculos(r, dependentesMoradores)
                : await cadastrarNucleoFamiliar(payload);
            if (!temVinculosExistentes) {
                await atualizarPrioridadesPessoa(nucleo.responsavel.id, r.prioridadeIds);
                await Promise.all(dependentesMoradores.map((morador, index) => {
                    const idPessoa = nucleo.dependentes[index]?.id;
                    return idPessoa ? atualizarPrioridadesPessoa(idPessoa, morador.prioridadeIds) : Promise.resolve();
                }));
            }
            toast.success('Cadastro registrado com sucesso!');
            await enviarFotos(nucleo);
            navigate('/busca');
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao cadastrar núcleo familiar.';
            setErro(msg);
            toast.error(msg);
        } finally {
            setEnviando(false);
        }
    }

    // Faz upload das fotos após o núcleo existir (precisa dos ids de moradia/pets).
    // Falhas aqui não invalidam o cadastro já gravado — apenas avisam o usuário.
    async function enviarFotosEdicao(idMoradia: number | null, petIdsPorKey: Map<string, number>) {
        if (totalFotos === 0) return;
        let enviadas = 0;
        let falhas = 0;
        try {
            if (idMoradia) {
                for (const f of fotosCasa) {
                    try {
                        await enviarFoto('moradias', idMoradia, f.file);
                        enviadas++;
                    } catch {
                        falhas++;
                    }
                }
            }

            for (const pet of pets) {
                const idPet = petIdsPorKey.get(pet.key) ?? pet.id;
                if (!idPet) continue;
                for (const f of pet.fotos) {
                    try {
                        await enviarFoto('pets', idPet, f.file);
                        enviadas++;
                    } catch {
                        falhas++;
                    }
                }
            }
        } finally {
            if (enviadas > 0) toast.success(`${enviadas} foto(s) enviada(s).`);
            if (falhas > 0) toast.error(`${falhas} foto(s) não puderam ser enviadas.`);
        }
    }

    async function enviarFotos(nucleo: Awaited<ReturnType<typeof cadastrarNucleoFamiliar>>) {
        if (totalFotos === 0) return;
        let enviadas = 0;
        let falhas = 0;
        try {
            for (const f of fotosCasa) {
                if (!nucleo.moradia) continue;
                try {
                    await enviarFoto('moradias', nucleo.moradia.id, f.file);
                    enviadas++;
                } catch {
                    falhas++;
                }
            }
            for (let i = 0; i < pets.length; i++) {
                const petId = nucleo.pets[i]?.id;
                if (!petId) continue;
                for (const f of pets[i].fotos) {
                    try {
                        await enviarFoto('pets', petId, f.file);
                        enviadas++;
                    } catch {
                        falhas++;
                    }
                }
            }
        } finally {
            if (enviadas > 0) toast.success(`${enviadas} foto(s) enviada(s).`);
            if (falhas > 0) toast.error(`${falhas} foto(s) não puderam ser enviadas.`);
        }
    }

    return (
        <div className="cadastro-page">
            <div className="pill-tabs">
                {abasVisiveis.map((a) => (
                    <button
                        key={a.id}
                        type="button"
                        className={`pill-tab${aba === a.id ? ' active' : ''}`}
                        onClick={() => a.id === 'visaoGeral' ? irParaVisaoGeral() : setAba(a.id)}
                    >
                        {a.label}
                    </button>
                ))}
            </div>

            <h2 className="page-title">{modoEdicaoPessoa ? 'Editar pessoa' : TITULOS[aba]}</h2>

            {aba === 'moradia' && (
                <div className="card">
                    {!modoEdicaoPessoa && (
                        <div className="optional-section-note required-section-note">
                            <strong>Responsável obrigatório</strong>
                            <span>Para concluir o cadastro de uma moradia, será necessário cadastrar ou vincular uma pessoa como responsável na seção Moradores.</span>
                        </div>
                    )}
                    {!modoEdicaoPessoa && (
                        <CheckboxField
                            label="Adicionar apenas família"
                            checked={adicionarApenasFamilia}
                            onChange={(checked) => {
                                setAdicionarApenasFamilia(checked);
                                if (checked) {
                                    setModoMoradia('nova');
                                    setMoradiaSelecionadaId(null);
                                    setInvalidos(new Set());
                                    setFotosCasa([]);
                                    setAba('moradores');
                                }
                            }}
                        />
                    )}
                    {!modoEdicaoPessoa && (
                        <>
                            <div className="field">
                                <label>Moradia da família</label>
                                <select
                                    value={modoMoradia}
                                    onChange={(e) => selecionarModoMoradia(e.target.value as ModoMoradia)}
                                    disabled={adicionarApenasFamilia}
                                >
                                    <option value="nova">Cadastrar nova moradia</option>
                                    <option value="existente">Usar moradia existente</option>
                                </select>
                            </div>
                            {modoMoradia === 'existente' && !adicionarApenasFamilia && (
                                <div className="field">
                                    <label>Vincular família a uma moradia existente</label>
                                    <select
                                        value={moradiaSelecionadaId ?? ''}
                                        onChange={(e) => void selecionarMoradiaExistente(e.target.value)}
                                    >
                                        <option value="">Selecione uma moradia</option>
                                        {moradiasDisponiveis.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                #{m.id} - {[m.localizacao.logradouro, m.localizacao.numero, m.localizacao.bairro].filter(Boolean).join(', ') || 'Endereço não informado'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                    {!adicionarApenasFamilia && (
                        <>
                            <>
                                <p className="field-group-title">Endereço</p>

                                <Row>
                                    <TextField label="CEP" value={loc.cep} onChange={(v) => setLocField('cep', maskCEP(v))} onBlur={lookupCep} inputMode="numeric" placeholder="00000-000" />
                                    <TextField label="Logradouro" value={loc.logradouro} onChange={(v) => setLocField('logradouro', v)} placeholder="Ex.: Rua das Flores" />
                                </Row>
                                <Row>
                                    <TextField placeholder='Ex.: Santo André' label="Cidade" value={loc.cidade} onChange={(v) => { setLocField('cidade', v); limparInvalido('cidade'); }} required error={invalido('cidade')} />
                                    <TextField label="Bairro" value={loc.bairro} onChange={(v) => setLocField('bairro', v)} placeholder="Ex.: Jardim Santo André" />
                                </Row>
                                <Row>
                                    <TextField label="Número" value={loc.numero} onChange={(v) => setLocField('numero', v)} placeholder="Ex.: 123" />
                                    <TextField label="Estado (UF)" value={loc.estado} onChange={(v) => { setLocField('estado', v); limparInvalido('estado'); }} maxLength={2} required error={invalido('estado')} placeholder="SP" />
                                </Row>
                                <TextField label="Complemento" value={loc.complemento} onChange={(v) => setLocField('complemento', v)} placeholder="Ex.: Casa 2, bloco B" />
                            </>

                            <>
                                <p className="field-group-title">Coordenadas (mapa)</p>
                                <div className={`field gps-auto-status ${invalido('latitude') || invalido('longitude') ? 'invalid' : ''}`}>
                                    <label>Localização *</label>
                                    <span className={`gps-status${capturando ? ' gps-status-loading' : ''}`}>
                                        {capturando
                                            ? 'Solicitando permissão e capturando localização...'
                                            : loc.latitude && loc.longitude
                                                ? 'Coordenadas capturadas automaticamente'
                                                : 'Permita o uso da localização para capturar as coordenadas automaticamente.'}
                                    </span>
                                </div>

                                <LocationPicker
                                    latitude={loc.latitude}
                                    longitude={loc.longitude}
                                    focusSignal={gpsSignal}
                                    onChange={setCoord}
                                />

                                <TextAreaField boxStyle={{ marginTop: '15px', marginBottom: '30px' }} label="Referência geográfica" value={loc.referencia} onChange={(v) => setLocField('referencia', v)} placeholder="Ex.: Próximo à escola municipal" />
                            </>

                            <>
                                <p className="field-group-title">Construção</p>
                                <Row>
                                    <SelectField label="Tipo" value={moradia.tipoConstrucao} onChange={(v) => { setMoradiaField('tipoConstrucao', v); limparInvalido('tipoConstrucao'); }} options={TIPOS_CONSTRUCAO} required error={invalido('tipoConstrucao')} />
                                    <TextField label="Tipo de pavimento" value={moradia.pavimentos} onChange={(v) => setMoradiaField('pavimentos', v)} inputMode="numeric" placeholder="Ex.: 1" />
                                </Row>
                                <Row>
                                    <SelectField label="Condição de ocupação" value={moradia.situacaoDeOcupacao} onChange={(v) => { setMoradiaField('situacaoDeOcupacao', v); limparInvalido('situacaoDeOcupacao'); }} options={SITUACOES_OCUPACAO_MORADIA} required error={invalido('situacaoDeOcupacao')} />
                                    <SelectField label="Uso do imóvel" value={moradia.usoImovel} onChange={(v) => { setMoradiaField('usoImovel', v); limparInvalido('usoImovel'); }} options={USOS_IMOVEL} required error={invalido('usoImovel')} />
                                </Row>
                                <SelectField label="Status da moradia" value={moradia.status} onChange={(v) => setMoradiaField('status', v)} options={STATUS_MORADIA} />
                                <TextAreaField label="Descrição da moradia" value={moradia.descricao} onChange={(v) => setMoradiaField('descricao', v)} placeholder="Ex.: Casa de alvenaria com acesso por viela" />

                                <div className="field">
                                    <label>Fotos do imóvel (fachada e entorno)</label>
                                    <PhotoPicker
                                        fotos={fotosCasa}
                                        onAdd={(novas) => setFotosCasa((prev) => [...prev, ...novas])}
                                        onRemove={(key) => setFotosCasa((prev) => prev.filter((f) => f.key !== key))}
                                        label="Adicionar foto"
                                        max={2}
                                        showName
                                    />
                                </div>
                            </>
                        </>
                    )}

                    <button className="btn btn-navy btn-block" style={{ marginTop: 6 }} onClick={() => avancarDe('moradia', 'moradores')}>Próximo</button>
                </div>
            )}

            {aba === 'moradores' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {!modoEdicaoPessoa && (
                        <>
                            <button
                                type="button"
                                className="btn-dashed"
                                onClick={() => setMostrarBuscaPessoaExistente((atual) => !atual)}
                            >
                                {mostrarBuscaPessoaExistente ? '- Ocultar busca de pessoa existente' : '+ Adicionar pessoa existente'}
                            </button>
                            {mostrarBuscaPessoaExistente && (
                                <div className="existing-person-card">
                                    <p className="field-group-title" style={{ marginTop: 0, color: 'black' }}>Buscar pessoa existente</p>
                                    <div className="field">
                                        <label>Nome ou CPF</label>
                                        <input
                                            value={buscaPessoa}
                                            onChange={(e) => setBuscaPessoa(e.target.value)}
                                            placeholder="Digite nome ou CPF"
                                        />
                                    </div>
                                    <div className="existing-person-list">
                                        {buscandoPessoa && <p className="state-msg existing-person-state">Buscando pessoas...</p>}
                                        {!buscandoPessoa && pessoasEncontradas.length === 0 && (
                                            <p className="state-msg existing-person-state">Nenhuma pessoa disponível encontrada.</p>
                                        )}
                                        {!buscandoPessoa && pessoasEncontradas.map((pessoa) => (
                                            <div key={pessoa.id} className="existing-person-item">
                                                <span>
                                                    <strong>{pessoa.nome}</strong>
                                                    <small>{pessoa.cpf ?? 'CPF n/d'} · {pessoa.parentesco ?? 'sem parentesco'}</small>
                                                </span>
                                                <button type="button" className="btn-editar" onClick={() => void adicionarPessoaExistente(pessoa)}>
                                                    Adicionar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button className="btn-dashed" onClick={adicionarMorador}>+ Adicionar Morador</button>
                        </>
                    )}
                    {moradores.map((m, index) => {
                        const ehResponsavel = m.parentesco === RESPONSAVEL;
                        const outroResponsavel = temResponsavel && !ehResponsavel;
                        const cardAberto = moradoresAbertos.has(m.key);
                        return (
                            <div key={m.key} className={`card collapsible-card${cardAberto ? ' open' : ''}`}>
                                <div className="collapsible-card-head">
                                    <button type="button" className="collapsible-trigger" onClick={() => toggleMoradorCard(m.key)}>
                                        <span className="collapsible-title">
                                            {modoEdicaoPessoa ? 'Pessoa' : ehResponsavel ? 'Responsável' : `Morador ${index + 1}`}
                                        </span>
                                        <span className="collapsible-summary">
                                            {m.nome || 'Nome não informado'} · {m.parentesco || 'Parentesco pendente'}
                                        </span>
                                        <span className="collapsible-chevron" aria-hidden="true">{cardAberto ? '⌃' : '⌄'}</span>
                                    </button>
                                    {!modoEdicaoPessoa && moradores.length > 1 && (
                                        <button type="button" className="collapsible-remove" onClick={() => setMoradores((prev) => prev.filter((_, i) => i !== index))}>
                                            Remover
                                        </button>
                                    )}
                                </div>

                                {cardAberto && (
                                    <div className="collapsible-card-body">
                                        <SelectField
                                            label="Grau de parentesco c/ responsável"
                                            value={m.parentesco}
                                            onChange={(v) => { updateMorador(index, { parentesco: v }); limparInvalido(`${m.key}:parentesco`); }}
                                            options={PARENTESCOS}
                                            disabledOptions={outroResponsavel ? [RESPONSAVEL] : []}
                                            required
                                            error={invalido(`${m.key}:parentesco`)}
                                        />
                                        <Row>
                                            <TextField label="Nome completo" value={m.nome} onChange={(v) => { updateMorador(index, { nome: v }); limparInvalido(`${m.key}:nome`); }} required error={invalido(`${m.key}:nome`)} placeholder="Ex.: Maria Silva Santos" />
                                            <TextField label="Data de nascimento" value={m.dataDeNascimento} onChange={(v) => { updateMorador(index, { dataDeNascimento: v }); limparInvalido(`${m.key}:data`); }} type="date" required error={invalido(`${m.key}:data`)} placeholder="AAAA-MM-DD" />
                                        </Row>
                                        <Row>
                                            <TextField label="Nome social" value={m.nomeSocial} onChange={(v) => updateMorador(index, { nomeSocial: v })} placeholder="Ex.: Maria Santos" />
                                            <TextField label="CPF" value={m.cpf} onChange={(v) => updateMorador(index, { cpf: maskCPF(v) })} inputMode="numeric" maxLength={14} placeholder="000.000.000-00" />
                                        </Row>
                                        <SelectField label="Escolaridade" value={m.escolaridade} onChange={(v) => { updateMorador(index, { escolaridade: v }); limparInvalido(`${m.key}:escolaridade`); }} options={ESCOLARIDADES} required error={invalido(`${m.key}:escolaridade`)} />
                                        <SelectField label="Situação ocupacional" value={m.situacaoOcupacional} onChange={(v) => { updateMorador(index, { situacaoOcupacional: v }); limparInvalido(`${m.key}:ocupacao`); }} options={SITUACOES_OCUPACIONAIS} required error={invalido(`${m.key}:ocupacao`)} />
                                        <Row>
                                            <CheckboxField label="Doença crônica" checked={m.cronico} onChange={(v) => updateMorador(index, { cronico: v })} />
                                            <CheckboxField label="Usa medicação" checked={m.medicacao} onChange={(v) => updateMorador(index, { medicacao: v })} />
                                        </Row>

                                        <div className="field">
                                            <label>Condições físicas</label>
                                            <div className="priority-checks">
                                                {prioridades.map((prioridade) => (
                                                    <CheckboxField
                                                        key={prioridade.id}
                                                        label={prioridade.tipo ? `${prioridade.condicao} (${prioridade.tipo})` : prioridade.condicao}
                                                        checked={m.prioridadeIds.includes(prioridade.id)}
                                                        onChange={(checked) => updateMorador(index, {
                                                            prioridadeIds: checked
                                                                ? [...m.prioridadeIds, prioridade.id]
                                                                : m.prioridadeIds.filter((id) => id !== prioridade.id)
                                                        })}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {ehResponsavel && (
                                            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px dashed var(--cinza)' }}>
                                                <p className="field-group-title" style={{ color: 'var(--laranja)', marginTop: 35 }}>
                                                    Dados exclusivos do responsável
                                                </p>
                                                <Row>
                                                    <SelectField label="Gênero" value={m.sexo} onChange={(v) => { updateMorador(index, { sexo: v }); limparInvalido(`${m.key}:sexo`); }} options={SEXOS} required error={invalido(`${m.key}:sexo`)} />
                                                    <SelectField label="Cor/Raça" value={m.raca} onChange={(v) => { updateMorador(index, { raca: v }); limparInvalido(`${m.key}:raca`); }} options={RACAS} required error={invalido(`${m.key}:raca`)} />
                                                </Row>
                                                <SelectField label="Estado civil" value={m.estadoCivil} onChange={(v) => { updateMorador(index, { estadoCivil: v }); limparInvalido(`${m.key}:estadoCivil`); }} options={ESTADOS_CIVIS} required error={invalido(`${m.key}:estadoCivil`)} />
                                                <TextField label="Local de nascimento" value={m.localDeNascimento} onChange={(v) => updateMorador(index, { localDeNascimento: v })} placeholder="Ex.: Santo André - SP" />
                                                <Row>
                                                    <TextField label="Nome do pai" value={m.nomeDoPai} onChange={(v) => updateMorador(index, { nomeDoPai: v })} placeholder="Ex.: João Silva" />
                                                    <TextField label="Nome da mãe" value={m.nomeDaMae} onChange={(v) => updateMorador(index, { nomeDaMae: v })} placeholder="Ex.: Ana Santos" />
                                                </Row>
                                                <Row>
                                                    <TextField label="NIS" value={m.nis} onChange={(v) => updateMorador(index, { nis: v })} inputMode="numeric" placeholder="Ex.: 12345678901" />
                                                    <TextField label="Renda mensal (R$)" value={m.renda} onChange={(v) => updateMorador(index, { renda: v })} inputMode="decimal" placeholder="Ex.: 1500,00" />
                                                </Row>
                                                <Row>
                                                    <TextField label="E-mail" value={m.email} onChange={(v) => updateMorador(index, { email: v })} inputMode="email" placeholder="Ex.: nome@email.com" />
                                                    <TextField label="Telefone" value={m.telefone} onChange={(v) => updateMorador(index, { telefone: maskTelefone(v) })} inputMode="tel" placeholder="(11) 99999-9999" />
                                                </Row>
                                                <Row>
                                                    <TextField label="Residência na moradia (desde)" value={m.dataResidenciaMoradia} onChange={(v) => updateMorador(index, { dataResidenciaMoradia: v })} type="date" placeholder="AAAA-MM-DD" />
                                                    <TextField label="Residência no estado (desde)" value={m.dataResidenciaEstado} onChange={(v) => updateMorador(index, { dataResidenciaEstado: v })} type="date" placeholder="AAAA-MM-DD" />
                                                </Row>
                                                <Row>
                                                    <CheckboxField label="Possui veículo" checked={m.veiculo} onChange={(v) => updateMorador(index, { veiculo: v })} />
                                                    <CheckboxField label="Programa social" checked={m.programaSocial} onChange={(v) => updateMorador(index, { programaSocial: v })} />
                                                </Row>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {modoEdicaoPessoa ? (
                        <button className="btn btn-outline btn-block" disabled={enviando} onClick={enviar}>
                            {enviando ? 'Enviando...' : 'Salvar alterações'}
                        </button>
                    ) : (
                        <button className="btn btn-navy btn-block" onClick={() => avancarDe('moradores', 'pets')}>Próximo</button>
                    )}
                </div>
            )}

            {aba === 'pets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="optional-section-note">
                        <strong>Pets e Animais são opcionais</strong>
                        <span>Se a família não tiver animais, você pode seguir para a Visão Geral sem adicionar nenhum cadastro.</span>
                    </div>
                    {pets.length === 0 && <p className="state-msg">Nenhum animal adicionado. Esta etapa pode ficar em branco.</p>}
                    {pets.map((p, index) => {
                        const cardAberto = petsAbertos.has(p.key);
                        return (
                            <div key={p.key} className={`card collapsible-card${cardAberto ? ' open' : ''}`}>
                                <div className="collapsible-card-head">
                                    <button type="button" className="collapsible-trigger" onClick={() => togglePetCard(p.key)}>
                                        <span className="collapsible-title">Animal {index + 1}</span>
                                        <span className="collapsible-summary">
                                            {p.nome || 'Nome não informado'} · {p.tipo || 'Tipo pendente'}
                                        </span>
                                        <span className="collapsible-chevron" aria-hidden="true">{cardAberto ? '⌃' : '⌄'}</span>
                                    </button>
                                    <button type="button" className="collapsible-remove" onClick={() => setPets((prev) => prev.filter((_, i) => i !== index))}>
                                        Remover
                                    </button>
                                </div>

                                {cardAberto && (
                                    <div className="collapsible-card-body">
                                        <Row>
                                            <TextField label="Nome do animal" value={p.nome} onChange={(v) => { updatePet(index, { nome: v }); limparInvalido(`${p.key}:petNome`); }} required error={invalido(`${p.key}:petNome`)} placeholder="Ex.: Thor" />
                                            <TextField label="Porte" value={p.porte} onChange={(v) => updatePet(index, { porte: v })} placeholder="Ex.: Médio" />
                                        </Row>
                                        <Row>
                                            <SelectField label="Tipo" value={p.tipo} onChange={(v) => { updatePet(index, { tipo: v }); limparInvalido(`${p.key}:petTipo`); }} options={TIPOS_PET} required error={invalido(`${p.key}:petTipo`)} />
                                            <TextField label="Cor do animal" value={p.cor} onChange={(v) => updatePet(index, { cor: v })} placeholder="Ex.: Caramelo" />
                                        </Row>
                                        <Row>
                                            <TextField label="Raça" value={p.raca} onChange={(v) => updatePet(index, { raca: v })} placeholder="Ex.: Sem raça definida" />
                                            <SelectField label="Status" value={p.status} onChange={(v) => updatePet(index, { status: v })} options={STATUS_PET} />
                                        </Row>
                                        <TextAreaField label="Observações sobre o animal" value={p.observacao} onChange={(v) => updatePet(index, { observacao: v })} placeholder="Ex.: Animal dócil, fica no quintal" />
                                        <div className="field">
                                            <label>Foto do animal</label>
                                            <PhotoPicker
                                                fotos={p.fotos}
                                                onAdd={(novas) => addFotosPet(index, novas)}
                                                onRemove={(key) => removeFotoPet(index, key)}
                                                label="Adicionar foto"
                                                max={1}
                                                showName
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <button className="btn-dashed" onClick={adicionarPet}>+ Adicionar Animal</button>
                    <button className="btn btn-navy btn-block" onClick={irParaVisaoGeral}>Próximo</button>
                </div>
            )}

            {aba === 'visaoGeral' && (
                <div className="overview-flow">
                    <div className="card overview-card">
                        <div className="overview-card-head">
                            <div>
                                <strong>Moradia</strong>
                                <span>{adicionarApenasFamilia ? 'Família sem moradia vinculada' : modoMoradia === 'existente' ? 'Moradia existente vinculada' : 'Nova moradia'}</span>
                            </div>
                            <button type="button" className="btn-editar" onClick={() => setAba('moradia')}>Editar</button>
                        </div>
                        {adicionarApenasFamilia ? (
                            <p className="state-msg overview-empty">Cadastro marcado como apenas família.</p>
                        ) : (
                            <div className="overview-grid">
                                <p><span>Endereço</span><strong>{enderecoResumo || 'Não informado'}</strong></p>
                                <p><span>CEP</span><strong>{loc.cep || 'Não informado'}</strong></p>
                                <p><span>Coordenadas</span><strong>{loc.latitude && loc.longitude ? `${loc.latitude}, ${loc.longitude}` : 'Não capturadas'}</strong></p>
                                <p><span>Tipo</span><strong>{moradia.tipoConstrucao || 'Não informado'}</strong></p>
                                <p><span>Ocupação</span><strong>{moradia.situacaoDeOcupacao || 'Não informado'}</strong></p>
                                <p><span>Uso</span><strong>{moradia.usoImovel || 'Não informado'}</strong></p>
                                <p><span>Status</span><strong>{moradia.status || 'Não informado'}</strong></p>
                                <p><span>Fotos</span><strong>{fotosCasa.length}</strong></p>
                            </div>
                        )}
                    </div>

                    <div className="card overview-card">
                        <div className="overview-card-head">
                            <div>
                                <strong>Moradores</strong>
                                <span>{moradores.length} pessoa(s) adicionada(s)</span>
                            </div>
                            <button type="button" className="btn-editar" onClick={() => setAba('moradores')}>Editar</button>
                        </div>
                        <div className="overview-list">
                            {moradores.map((m) => (
                                <div key={m.key} className="overview-list-item">
                                    <strong>{m.nome || 'Nome não informado'}</strong>
                                    <span>{m.parentesco || 'Parentesco não informado'}{m.cpf ? ` · CPF ${m.cpf}` : ''}</span>
                                    <small>{[m.dataDeNascimento, m.escolaridade, m.situacaoOcupacional].filter(Boolean).join(' · ') || 'Dados básicos pendentes'}</small>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card overview-card">
                        <div className="overview-card-head">
                            <div>
                                <strong>Pets e Animais</strong>
                                <span>{pets.length} animal(is) adicionado(s)</span>
                            </div>
                            <button type="button" className="btn-editar" onClick={() => setAba('pets')}>Editar</button>
                        </div>
                        {pets.length === 0 ? (
                            <p className="state-msg overview-empty">Nenhum animal adicionado.</p>
                        ) : (
                            <div className="overview-list">
                                {pets.map((p) => (
                                    <div key={p.key} className="overview-list-item">
                                        <strong>{p.nome || 'Nome não informado'}</strong>
                                        <span>{[p.tipo, p.porte, p.cor].filter(Boolean).join(' · ') || 'Dados do animal pendentes'}</span>
                                        <small>{p.fotos.length} foto(s){p.observacao ? ` · ${p.observacao}` : ''}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="overview-actions">
                        <button className="btn btn-outline btn-block" style={{ "width": "100%" }} disabled={enviando} onClick={enviar}>
                            {enviando ? 'Enviando...' : modoEdicao ? 'Salvar alterações' : `Concluir Cadastro${totalFotos > 0 ? ` (${totalFotos} foto(s))` : ''}`}
                        </button>
                    </div>
                </div>
            )}

            {erro && <p className="error-msg">{erro}</p>}
        </div>
    );
}
