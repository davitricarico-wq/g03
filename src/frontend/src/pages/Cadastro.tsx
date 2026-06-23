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
import { buscarCep, buscarEnderecoPorCoordenadas, capturarGPS, cpfValido, emailValido, maskCEP, maskCPF, maskTelefone } from '../utils/forms.ts';
import { CheckboxField, Row, SelectField, TextAreaField, TextField } from '../components/FormFields.tsx';
import LocationPicker from '../components/LocationPicker.tsx';
import PhotoPicker, { type FotoLocal } from '../components/PhotoPicker.tsx';
import {
    ESCOLARIDADES,
    ESTADOS_BRASIL,
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
    nis: string;
    renda: string;
    sexo: string;
    raca: string;
    estadoCivil: string;
    email: string;
    telefone: string;
    nomeDaMae: string;
    dataResidenciaMoradia: string;
    veiculo: boolean;
    programasSociais: string;
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
        nis: '', renda: '', sexo: '', raca: '', estadoCivil: '',
        email: '', telefone: '', nomeDaMae: '',
        dataResidenciaMoradia: '', veiculo: false, programasSociais: '0',
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
        nome: pet.nome ?? '',
        porte: pet.porte,
        raca: pet.raca,
        cor: pet.cor,
        status: pet.status,
        observacao: pet.observacao ?? '',
        fotos: []
    };
}

type Aba = 'moradia' | 'moradores' | 'pets';
const ABAS: { id: Aba; label: string }[] = [
    { id: 'moradia', label: 'Moradia' },
    { id: 'moradores', label: 'Moradores' },
    { id: 'pets', label: 'Pets e Animais' }
];
const TITULOS: Record<Aba, string> = {
    moradia: 'Seção 1 - Moradia',
    moradores: 'Seção 2 - Moradores',
    pets: 'Seção 3 - Pets e animais'
};
type ModoMoradia = 'nova' | 'existente';
type CampoFeedback = { type: 'error' | 'warning' | 'success' | 'info'; message: string };

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
        medicacao: m.medicacao,
        nis: limpar(m.nis),
        renda: m.renda.trim() ? Number(m.renda) : null,
        sexo: limpar(m.sexo),
        raca: limpar(m.raca),
        estadoCivil: limpar(m.estadoCivil),
        email: limpar(m.email),
        telefone: m.telefone.trim() ? m.telefone.replace(/\D/g, '') : null,
        nomeDaMae: limpar(m.nomeDaMae),
        dataResidenciaMoradia: limpar(m.dataResidenciaMoradia),
        veiculo: m.veiculo,
        programasSociais: Math.max(0, Number.parseInt(m.programasSociais || '0', 10) || 0)
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
    const [feedbackAssincrono, setFeedbackAssincrono] = useState<Record<string, CampoFeedback>>({});
    const [capturando, setCapturando] = useState(false);

    const [loc, setLoc] = useState({
        logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
        latitude: '', longitude: '', referencia: '', complemento: ''
    });
    const [moradia, setMoradia] = useState({
        tipoConstrucao: '', usoImovel: '', situacaoDeOcupacao: '', pavimentos: '1', status: 'Ativa', descricao: ''
    });
    const [moradores, setMoradores] = useState<MoradorForm[]>([novoMorador(RESPONSAVEL)]);
    const [pets, setPets] = useState<PetForm[]>([]);
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

    const feedbackLocal = useMemo<Record<string, CampoFeedback>>(() => {
        const feedback: Record<string, CampoFeedback> = {};
        const cpfs = new Map<string, string[]>();
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        for (const morador of moradores) {
            const cpf = morador.cpf.replace(/\D/g, '');
            if (cpf) {
                const key = `${morador.key}:cpf`;
                if (cpf.length < 11) {
                    feedback[key] = { type: 'warning', message: 'CPF incompleto. Digite os 11 números.' };
                } else if (!cpfValido(cpf)) {
                    feedback[key] = { type: 'error', message: 'CPF inválido. Confira os números digitados.' };
                }
                cpfs.set(cpf, [...(cpfs.get(cpf) ?? []), morador.key]);
            }

            if (morador.dataDeNascimento) {
                const data = new Date(`${morador.dataDeNascimento}T00:00:00`);
                if (Number.isNaN(data.getTime()) || data > hoje) {
                    feedback[`${morador.key}:data`] = { type: 'error', message: 'Data de nascimento inválida.' };
                }
            }

            if (morador.parentesco === RESPONSAVEL && morador.email.trim() && !emailValido(morador.email)) {
                feedback[`${morador.key}:email`] = { type: 'error', message: 'E-mail inválido. Use o formato nome@dominio.com.' };
            }
        }

        for (const keys of cpfs.values()) {
            if (keys.length > 1) {
                for (const key of keys) {
                    feedback[`${key}:cpf`] = { type: 'error', message: 'Este CPF está repetido no formulário.' };
                }
            }
        }

        return feedback;
    }, [moradores]);

    const feedbackCampo = (chave: string): CampoFeedback | undefined => feedbackLocal[chave] ?? feedbackAssincrono[chave];

    useEffect(() => {
        const checks = moradores.flatMap((morador) => {
            const itens: { key: string; tipo: 'cpf' | 'email'; valor: string; id?: number }[] = [];
            const cpf = morador.cpf.replace(/\D/g, '');
            const cpfKey = `${morador.key}:cpf`;
            if (cpf.length === 11 && cpfValido(cpf) && !feedbackLocal[cpfKey]) {
                itens.push({ key: cpfKey, tipo: 'cpf', valor: cpf, id: morador.id });
            }

            const email = morador.email.trim();
            const emailKey = `${morador.key}:email`;
            if (morador.parentesco === RESPONSAVEL && email && emailValido(email) && !feedbackLocal[emailKey]) {
                itens.push({ key: emailKey, tipo: 'email', valor: email, id: morador.id });
            }
            return itens;
        });

        const trackedKeys = new Set(moradores.flatMap((morador) => [`${morador.key}:cpf`, `${morador.key}:email`]));
        setFeedbackAssincrono((prev) => {
            const next: Record<string, CampoFeedback> = {};
            for (const key of Object.keys(prev)) {
                if (!trackedKeys.has(key)) continue;
                const aindaValido = checks.some((check) => check.key === key);
                if (aindaValido) next[key] = { type: 'info', message: 'Verificando cadastro existente...' };
            }
            for (const check of checks) {
                next[check.key] = { type: 'info', message: 'Verificando cadastro existente...' };
            }
            return next;
        });

        if (checks.length === 0) return;

        let cancelado = false;
        const timer = window.setTimeout(() => {
            void Promise.all(checks.map(async (check) => {
                try {
                    const pessoas = await buscarPessoas({
                        escopo: 'todas',
                        cpf: check.tipo === 'cpf' ? check.valor : undefined,
                        email: check.tipo === 'email' ? check.valor : undefined
                    });
                    const existente = pessoas.find((pessoa) => pessoa.id !== check.id);
                    if (existente) {
                        return {
                            key: check.key,
                            feedback: {
                                type: 'error',
                                message: check.tipo === 'cpf'
                                    ? `CPF já cadastrado para ${existente.nome}.`
                                    : `E-mail já cadastrado para ${existente.nome}.`
                            } as CampoFeedback
                        };
                    }
                    return {
                        key: check.key,
                        feedback: {
                            type: 'success',
                            message: check.tipo === 'cpf' ? 'CPF válido e disponível.' : 'E-mail disponível.'
                        } as CampoFeedback
                    };
                } catch {
                    return {
                        key: check.key,
                        feedback: {
                            type: 'warning',
                            message: 'Não foi possível verificar duplicidade agora.'
                        } as CampoFeedback
                    };
                }
            })).then((resultados) => {
                if (cancelado) return;
                setFeedbackAssincrono((prev) => {
                    const next = { ...prev };
                    for (const resultado of resultados) {
                        next[resultado.key] = resultado.feedback;
                    }
                    return next;
                });
            });
        }, 450);

        return () => {
            cancelado = true;
            window.clearTimeout(timer);
        };
    }, [moradores, feedbackLocal]);

    async function preencherEnderecoPorCoordenadas(lat: number, lng: number) {
        const endereco = await buscarEnderecoPorCoordenadas(lat, lng);
        if (!endereco) return;
        setLoc((p) => ({
            ...p,
            cep: endereco.cep ? maskCEP(endereco.cep) : p.cep,
            logradouro: endereco.logradouro || p.logradouro,
            bairro: endereco.bairro || p.bairro,
            cidade: endereco.cidade || p.cidade,
            estado: endereco.uf || p.estado
        }));
        if (endereco.cidade) limparInvalido('cidade');
        if (endereco.uf) limparInvalido('estado');
        toast.info('Endereço preenchido pelas coordenadas.');
    }

    // posiciona o pino no mapa (clique/arraste) sem disparar recentralização
    const setCoord = (lat: number, lng: number) => {
        setLoc((p) => ({ ...p, latitude: String(lat), longitude: String(lng) }));
        limparInvalido('latitude');
        limparInvalido('longitude');
        void preencherEnderecoPorCoordenadas(lat, lng);
    };

    const invalido = (chave: string) => invalidos.has(chave);
    const limparInvalido = (chave: string) =>
        setInvalidos((prev) => {
            if (!prev.has(chave)) return prev;
            const next = new Set(prev);
            next.delete(chave);
            return next;
	        });

    function moradorFromPessoa(pessoa: Pessoa, prioridadeIds: number[], responsavel?: Pessoa): MoradorForm {
        const dadosPessoa = responsavel ?? pessoa;
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
            nis: dadosPessoa.nis ?? '',
            renda: dadosPessoa.renda === null || dadosPessoa.renda === undefined ? '' : String(dadosPessoa.renda),
            sexo: dadosPessoa.sexo ?? '',
            raca: dadosPessoa.raca ?? '',
            estadoCivil: dadosPessoa.estadoCivil ?? '',
            email: dadosPessoa.email ?? '',
            telefone: dadosPessoa.telefone ?? '',
            nomeDaMae: dadosPessoa.nomeDaMae ?? '',
            dataResidenciaMoradia: dadosPessoa.dataResidenciaMoradia ? String(dadosPessoa.dataResidenciaMoradia).slice(0, 10) : '',
            veiculo: Boolean(dadosPessoa.veiculo),
            programasSociais: String(dadosPessoa.programasSociais ?? 0),
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

    function selecionarCadastroApenasFamilia(ativo: boolean) {
        setAdicionarApenasFamilia(ativo);
        if (ativo) {
            setModoMoradia('nova');
            setMoradiaSelecionadaId(null);
            setInvalidos(new Set());
            setFotosCasa([]);
            return;
        }
        if (moradiaOriginalId) {
            setMoradiaSelecionadaId(moradiaOriginalId);
            setModoMoradia('existente');
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

    async function pesquisarPessoaExistente() {
        const termo = buscaPessoa.trim();
        if (!termo) {
            setPessoasEncontradas([]);
            return;
        }
        setBuscandoPessoa(true);
        try {
            const apenasDigitos = termo.replace(/\D/g, '');
            const ehCpf = apenasDigitos.length >= 3 && apenasDigitos.length / termo.length > 0.6;
            const pessoas = await buscarPessoas({
                escopo: 'todas',
                nome: ehCpf ? undefined : termo,
                cpf: ehCpf ? apenasDigitos : undefined
            });
            setPessoasEncontradas(pessoas.filter((p) => {
                const responsavelAtivo = p.responsavel && p.status === 'Ativo';
                return !responsavelAtivo && !moradores.some((m) => m.id === p.id);
            }));
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
            setMoradores((prev) => [
                ...prev,
                moradorFromPessoa(
                    responsavelDetalhe ?? detalhePessoa,
                    prioridadesPessoa.map((prioridade) => prioridade.id),
                    responsavelDetalhe
                )
            ]);
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
                ? 'Informe coordenadas válidas (use o botão GPS) e os dados da moradia.'
                : 'Preencha os campos obrigatórios da moradia.'
            : null;
        return { campos, msg };
    }

    // valida aba de moradores -> retorna { campos, msg }
    function validarMoradores(): { campos: string[]; msg: string | null } {
        const campos: string[] = [];
        const responsavel = moradores.find((m) => m.parentesco === RESPONSAVEL);
        if (!modoEdicaoPessoa && !responsavel) return { campos: [], msg: 'É necessário um morador com vínculo "Responsável".' };
        for (const m of moradores) {
            if (!m.nome.trim()) campos.push(`${m.key}:nome`);
            if (!m.dataDeNascimento) campos.push(`${m.key}:data`);
            if (!m.parentesco) campos.push(`${m.key}:parentesco`);
            if (!m.situacaoOcupacional) campos.push(`${m.key}:ocupacao`);
            if (!m.escolaridade) campos.push(`${m.key}:escolaridade`);
            for (const chave of [`${m.key}:cpf`, `${m.key}:email`, `${m.key}:data`]) {
                const feedback = feedbackCampo(chave);
                if (feedback && feedback.type !== 'success') campos.push(chave);
            }
            if (!m.sexo) campos.push(`${m.key}:sexo`);
            if (!m.raca) campos.push(`${m.key}:raca`);
            if (!m.estadoCivil) campos.push(`${m.key}:estadoCivil`);
        }
        return { campos, msg: campos.length ? 'Revise os campos destacados antes de continuar.' : null };
    }

    function avancarDe(de: Aba, para: Aba) {
        const r = de === 'moradia' ? validarMoradia() : validarMoradores();
        if (r.msg) {
            setInvalidos(new Set(r.campos));
            toast.error(r.msg);
            return;
        }
        setInvalidos(new Set());
        setAba(para);
    }

    async function pegarGPS() {
        setCapturando(true);
        try {
            const c = await capturarGPS();
            setLoc((p) => ({ ...p, latitude: String(c.latitude), longitude: String(c.longitude) }));
            limparInvalido('latitude');
            limparInvalido('longitude');
            setGpsSignal((s) => s + 1);
            void preencherEnderecoPorCoordenadas(c.latitude, c.longitude);
            toast.success(`Localização capturada (±${c.accuracy ?? '?'}m).`);
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Não foi possível capturar a localização atual.';
            setErro(mensagem);
            toast.error(mensagem);
        } finally {
            setCapturando(false);
        }
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
            parentesco: RESPONSAVEL
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
            nome: limpar(p.nome),
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
        if (rMoradia.msg || rMoradores.msg) {
            setInvalidos(new Set([...rMoradia.campos, ...rMoradores.campos]));
            if (rMoradia.msg) {
                setAba('moradia');
                toast.error(rMoradia.msg);
            } else {
                setAba('moradores');
                toast.error(rMoradores.msg!);
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
                nis: limpar(r.nis),
                renda: r.renda.trim() ? Number(r.renda) : null,
                sexo: r.sexo,
                raca: r.raca,
                estadoCivil: r.estadoCivil,
                email: limpar(r.email),
                telefone: r.telefone.trim() ? r.telefone.replace(/\D/g, '') : null,
                nomeDaMae: limpar(r.nomeDaMae),
                dataResidenciaMoradia: limpar(r.dataResidenciaMoradia),
                veiculo: r.veiculo,
                programasSociais: Math.max(0, Number.parseInt(r.programasSociais || '0', 10) || 0)
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
                    <button key={a.id} className={`pill-tab${aba === a.id ? ' active' : ''}`} onClick={() => setAba(a.id)}>
                        {a.label}
                    </button>
                ))}
            </div>

            <h2 className="page-title">{modoEdicaoPessoa ? 'Editar pessoa' : TITULOS[aba]}</h2>

            {aba === 'moradia' && (
                <div className="card">
                    <p className="required-note"><span className="required-mark">*</span> Campos obrigatórios precisam ser preenchidos para avançar.</p>
                    {!modoEdicaoPessoa && (
                        <div className="family-housing-mode" role="group" aria-label="Tipo de cadastro">
                            <button
                                type="button"
                                className={`mode-choice${!adicionarApenasFamilia ? ' active' : ''}`}
                                onClick={() => selecionarCadastroApenasFamilia(false)}
                            >
                                <span className="mode-choice-title">Família com moradia</span>
                                <span className="mode-choice-copy">Exige um morador com parentesco Responsável</span>
                            </button>
                            <button
                                type="button"
                                className={`mode-choice${adicionarApenasFamilia ? ' active warning' : ''}`}
                                onClick={() => selecionarCadastroApenasFamilia(true)}
                            >
                                <span className="mode-choice-title">{modoEdicao && moradiaOriginalId ? 'Desvincular da moradia' : 'Apenas família'}</span>
                                <span className="mode-choice-copy">{modoEdicao && moradiaOriginalId ? 'Salvar família sem casa atual' : 'Continuar sem dados da casa'}</span>
                            </button>
                        </div>
                    )}
                    {!modoEdicaoPessoa && !adicionarApenasFamilia && (
                        <div className="inline-alert info">
                            Para cadastrar ou vincular uma moradia, a família deve possuir um morador marcado como Responsável.
                        </div>
                    )}
                    {modoEdicao && adicionarApenasFamilia && moradiaOriginalId && (
                        <div className="inline-alert warning">
                            Ao salvar, esta família será desvinculada da moradia #{moradiaOriginalId}.
                        </div>
                    )}
                    {!modoEdicaoPessoa && !adicionarApenasFamilia && (
                        <>
                            <div className="field">
                                <label>Moradia da família</label>
                                <select
                                    value={modoMoradia}
                                    onChange={(e) => selecionarModoMoradia(e.target.value as ModoMoradia)}
                                >
                                    <option value="nova">Cadastrar nova moradia</option>
                                    <option value="existente">Usar moradia existente</option>
                                </select>
                            </div>
                            {modoMoradia === 'existente' && (
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
                    <p className="field-group-title">Coordenadas (mapa)</p>
                    <div className="field">
                        <label>Localização *</label>
                        <div className="input-with-btn">
                            <input
                                className={invalido('latitude') || invalido('longitude') ? 'invalid' : undefined}
                                placeholder="Latitude, Longitude"
                                value={loc.latitude && loc.longitude ? `${loc.latitude}, ${loc.longitude}` : ''}
                                readOnly
                                style={invalido('latitude') || invalido('longitude') ? { borderColor: '#e53935', background: '#fff6f6' } : undefined}
                            />
                            <button type="button" className="gps-btn" disabled={capturando} onClick={pegarGPS}>
                                {capturando ? 'Capturando…' : '◎ GPS'}
                            </button>
                        </div>
                        {loc.latitude && loc.longitude ? (
                            <span className="gps-status">✓ Coordenadas definidas</span>
                        ) : (
                            <span className="field-hint">Capture pelo GPS ou selecione manualmente no mapa.</span>
                        )}
                    </div>

                    <LocationPicker
                        latitude={loc.latitude}
                        longitude={loc.longitude}
                        focusSignal={gpsSignal}
                        onChange={setCoord}
                    />

                    <Row>
                        <TextField label="CEP" value={loc.cep} onChange={(v) => setLocField('cep', maskCEP(v))} onBlur={lookupCep} inputMode="numeric" placeholder="00000-000" />
                        <TextField label="Logradouro (rua)" value={loc.logradouro} onChange={(v) => setLocField('logradouro', v)} />
                    </Row>
                    <Row>
                        <TextField label="Cidade" value={loc.cidade} onChange={(v) => { setLocField('cidade', v); limparInvalido('cidade'); }} required error={invalido('cidade')} errorMessage="Informe a cidade" />
                        <TextField label="Bairro" value={loc.bairro} onChange={(v) => setLocField('bairro', v)} />
                    </Row>
                    <Row>
                        <TextField label="Número" value={loc.numero} onChange={(v) => setLocField('numero', v)} />
                        <SelectField label="Estado (UF)" value={loc.estado} onChange={(v) => { setLocField('estado', v); limparInvalido('estado'); }} options={ESTADOS_BRASIL} placeholder="Selecione o estado" required error={invalido('estado')} errorMessage="Selecione o estado" />
                    </Row>
                    <TextField label="Complemento" value={loc.complemento} onChange={(v) => setLocField('complemento', v)} />

                    <p className="field-group-title">Construção</p>
                    <Row>
                        <SelectField label="Tipo" value={moradia.tipoConstrucao} onChange={(v) => { setMoradiaField('tipoConstrucao', v); limparInvalido('tipoConstrucao'); }} options={TIPOS_CONSTRUCAO} required error={invalido('tipoConstrucao')} errorMessage="Selecione o tipo de construção" />
                        <TextField label="Número de pavimentos" value={moradia.pavimentos} onChange={(v) => setMoradiaField('pavimentos', v)} inputMode="numeric" />
                    </Row>
                    <Row>
                        <SelectField label="Condição de ocupação" value={moradia.situacaoDeOcupacao} onChange={(v) => { setMoradiaField('situacaoDeOcupacao', v); limparInvalido('situacaoDeOcupacao'); }} options={SITUACOES_OCUPACAO_MORADIA} required error={invalido('situacaoDeOcupacao')} errorMessage="Selecione a condição de ocupação" />
                        <SelectField label="Uso do imóvel" value={moradia.usoImovel} onChange={(v) => { setMoradiaField('usoImovel', v); limparInvalido('usoImovel'); }} options={USOS_IMOVEL} required error={invalido('usoImovel')} errorMessage="Selecione o uso do imóvel" />
                    </Row>
                    <SelectField label="Status da moradia" value={moradia.status} onChange={(v) => setMoradiaField('status', v)} options={STATUS_MORADIA} />
                    <TextAreaField label="Referência geográfica" value={loc.referencia} onChange={(v) => setLocField('referencia', v)} />
                    <div className="field">
                        <label>Fotos da moradia (fachada e entorno)</label>
                        <PhotoPicker
                            fotos={fotosCasa}
                            onAdd={(novas) => setFotosCasa((prev) => [...prev, ...novas])}
                            onRemove={(key) => setFotosCasa((prev) => prev.filter((f) => f.key !== key))}
                            label="Adicionar foto"
                            max={2}
                            showName
                        />
                    </div>
                    <TextAreaField label="Descrição da moradia" value={moradia.descricao} onChange={(v) => setMoradiaField('descricao', v)} />
                        </>
                    )}

                    <button className="btn btn-navy btn-block" style={{ marginTop: 6 }} onClick={() => avancarDe('moradia', 'moradores')}>Próximo</button>
                </div>
            )}

            {aba === 'moradores' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {!modoEdicaoPessoa && (
                        <div className="inline-alert info">
                            Cada família precisa ter exatamente um morador com grau de parentesco Responsável.
                        </div>
                    )}
                    {!modoEdicaoPessoa && (
                        <div className="card">
                            <p className="field-group-title" style={{ marginTop: 0 }}>Adicionar pessoa existente</p>
                            <div className="input-with-btn">
                                <input
                                    value={buscaPessoa}
                                    onChange={(e) => setBuscaPessoa(e.target.value)}
                                    placeholder="Buscar por nome ou CPF"
                                />
                                <button type="button" className="btn btn-azul" disabled={buscandoPessoa} onClick={pesquisarPessoaExistente}>
                                    {buscandoPessoa ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>
                            {pessoasEncontradas.length > 0 && (
                                <div className="detail-list" style={{ marginTop: 12 }}>
                                    {pessoasEncontradas.map((pessoa) => (
                                        <p key={pessoa.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                                            <span>
                                                <strong>{pessoa.nome}</strong> · {pessoa.cpf ?? 'CPF n/d'} · {pessoa.parentesco ?? 'sem parentesco'}
                                            </span>
                                            <button type="button" className="btn-editar" onClick={() => void adicionarPessoaExistente(pessoa)}>
                                                Adicionar
                                            </button>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {moradores.map((m, index) => {
                        const ehResponsavel = m.parentesco === RESPONSAVEL;
                        const outroResponsavel = temResponsavel && !ehResponsavel;
                        return (
                            <div key={m.key} className="card">
                                <p className="required-note"><span className="required-mark">*</span> Campos obrigatórios. Erros e avisos aparecem durante o preenchimento.</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <strong style={{ color: 'var(--hover)' }}>
                                        {modoEdicaoPessoa ? 'Pessoa' : ehResponsavel ? 'Responsável' : `Morador ${index + 1}`}
                                    </strong>
                                    {!modoEdicaoPessoa && moradores.length > 1 && (
                                        <button onClick={() => setMoradores((prev) => prev.filter((_, i) => i !== index))} style={{ color: 'var(--laranja)', fontWeight: 700, fontSize: '0.85rem' }}>
                                            Remover
                                        </button>
                                    )}
                                </div>

                                <SelectField
                                    label="Grau de parentesco c/ responsável"
                                    value={m.parentesco}
                                    onChange={(v) => { updateMorador(index, { parentesco: v }); limparInvalido(`${m.key}:parentesco`); }}
                                    options={PARENTESCOS}
                                    disabledOptions={outroResponsavel ? [RESPONSAVEL] : []}
                                    required
                                    error={invalido(`${m.key}:parentesco`)}
                                    errorMessage="Selecione o parentesco"
                                />
                                <Row>
                                    <TextField label="Nome completo" value={m.nome} onChange={(v) => { updateMorador(index, { nome: v }); limparInvalido(`${m.key}:nome`); }} required error={invalido(`${m.key}:nome`)} errorMessage="Informe o nome completo" />
                                    <TextField
                                        label="Data de nascimento"
                                        value={m.dataDeNascimento}
                                        onChange={(v) => { updateMorador(index, { dataDeNascimento: v }); limparInvalido(`${m.key}:data`); }}
                                        type="date"
                                        required
                                        error={invalido(`${m.key}:data`) && !feedbackCampo(`${m.key}:data`)}
                                        errorMessage="Informe a data de nascimento"
                                        feedback={feedbackCampo(`${m.key}:data`)}
                                    />
                                </Row>
                                <Row>
                                    <TextField label="Apelido" value={m.nomeSocial} onChange={(v) => updateMorador(index, { nomeSocial: v })} />
                                    <TextField
                                        label="CPF"
                                        value={m.cpf}
                                        onChange={(v) => { updateMorador(index, { cpf: maskCPF(v) }); limparInvalido(`${m.key}:cpf`); }}
                                        inputMode="numeric"
                                        maxLength={14}
                                        placeholder="Opcional"
                                        error={invalido(`${m.key}:cpf`) && !feedbackCampo(`${m.key}:cpf`)}
                                        errorMessage="Revise o CPF informado"
                                        feedback={feedbackCampo(`${m.key}:cpf`)}
                                    />
                                </Row>
                                <SelectField label="Escolaridade" value={m.escolaridade} onChange={(v) => { updateMorador(index, { escolaridade: v }); limparInvalido(`${m.key}:escolaridade`); }} options={ESCOLARIDADES} required error={invalido(`${m.key}:escolaridade`)} errorMessage="Selecione a escolaridade" />
                                <SelectField label="Situação ocupacional" value={m.situacaoOcupacional} onChange={(v) => { updateMorador(index, { situacaoOcupacional: v }); limparInvalido(`${m.key}:ocupacao`); }} options={SITUACOES_OCUPACIONAIS} required error={invalido(`${m.key}:ocupacao`)} errorMessage="Selecione a situação ocupacional" />
	                                <Row>
	                                    <CheckboxField label="Doença crônica" checked={m.cronico} onChange={(v) => updateMorador(index, { cronico: v })} />
	                                    <CheckboxField label="Usa medicação" checked={m.medicacao} onChange={(v) => updateMorador(index, { medicacao: v })} />
	                                </Row>
	                                <div className="field">
	                                    <label>Prioridades</label>
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

                                <Row>
                                    <SelectField label="Sexo" value={m.sexo} onChange={(v) => { updateMorador(index, { sexo: v }); limparInvalido(`${m.key}:sexo`); }} options={SEXOS} required error={invalido(`${m.key}:sexo`)} errorMessage="Selecione o sexo" />
                                    <SelectField label="Cor/Raça" value={m.raca} onChange={(v) => { updateMorador(index, { raca: v }); limparInvalido(`${m.key}:raca`); }} options={RACAS} required error={invalido(`${m.key}:raca`)} errorMessage="Selecione a cor/raça" />
                                </Row>
                                <SelectField label="Estado civil" value={m.estadoCivil} onChange={(v) => { updateMorador(index, { estadoCivil: v }); limparInvalido(`${m.key}:estadoCivil`); }} options={ESTADOS_CIVIS} required error={invalido(`${m.key}:estadoCivil`)} errorMessage="Selecione o estado civil" />
                                <Row>
                                    <TextField label="Nome da mãe" value={m.nomeDaMae} onChange={(v) => updateMorador(index, { nomeDaMae: v })} />
                                    <TextField label="Programas sociais" value={m.programasSociais} onChange={(v) => updateMorador(index, { programasSociais: v.replace(/\D/g, '') })} inputMode="numeric" />
                                </Row>
                                <Row>
                                    <TextField label="NIS" value={m.nis} onChange={(v) => updateMorador(index, { nis: v })} inputMode="numeric" />
                                    <TextField label="Renda mensal (R$)" value={m.renda} onChange={(v) => updateMorador(index, { renda: v })} inputMode="decimal" />
                                </Row>
                                <Row>
                                    <TextField
                                        label="E-mail"
                                        value={m.email}
                                        onChange={(v) => { updateMorador(index, { email: v }); limparInvalido(`${m.key}:email`); }}
                                        inputMode="email"
                                        error={invalido(`${m.key}:email`) && !feedbackCampo(`${m.key}:email`)}
                                        errorMessage="Revise o e-mail informado"
                                        feedback={feedbackCampo(`${m.key}:email`)}
                                    />
                                    <TextField label="Telefone" value={m.telefone} onChange={(v) => updateMorador(index, { telefone: maskTelefone(v) })} inputMode="tel" />
                                </Row>
                                <TextField label="Residência na moradia (desde)" value={m.dataResidenciaMoradia} onChange={(v) => updateMorador(index, { dataResidenciaMoradia: v })} type="date" />
                                <Row>
                                    <CheckboxField label="Possui veículo" checked={m.veiculo} onChange={(v) => updateMorador(index, { veiculo: v })} />
                                </Row>
                            </div>
                        );
                    })}

                    {!modoEdicaoPessoa && (
                        <button className="btn-dashed" onClick={() => setMoradores((prev) => [...prev, novoMorador()])}>+ Adicionar Morador</button>
                    )}
                    <button className="btn btn-navy btn-block" onClick={() => avancarDe('moradores', 'pets')}>Próximo</button>
                </div>
            )}

            {aba === 'pets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {pets.length === 0 && <p className="state-msg">Nenhum animal adicionado.</p>}
                    {pets.map((p, index) => (
                        <div key={p.key} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <strong style={{ color: 'var(--hover)' }}>Animal {index + 1}</strong>
                                <button onClick={() => setPets((prev) => prev.filter((_, i) => i !== index))} style={{ color: 'var(--laranja)', fontWeight: 700, fontSize: '0.85rem' }}>
                                    Remover
                                </button>
                            </div>
                            <Row>
                                <TextField label="Nome do animal" value={p.nome} onChange={(v) => updatePet(index, { nome: v })} />
                                <TextField label="Porte" value={p.porte} onChange={(v) => updatePet(index, { porte: v })} />
                            </Row>
                            <Row>
                                <SelectField label="Tipo" value={p.tipo} onChange={(v) => updatePet(index, { tipo: v })} options={TIPOS_PET} required />
                                <TextField label="Cor do animal" value={p.cor} onChange={(v) => updatePet(index, { cor: v })} />
                            </Row>
                            <Row>
                                <TextField label="Raça" value={p.raca} onChange={(v) => updatePet(index, { raca: v })} />
                                <SelectField label="Status" value={p.status} onChange={(v) => updatePet(index, { status: v })} options={STATUS_PET} />
                            </Row>
                            <TextAreaField label="Observações sobre o animal" value={p.observacao} onChange={(v) => updatePet(index, { observacao: v })} />
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
                    ))}
                    <button className="btn-dashed" onClick={() => setPets((prev) => [...prev, novoPet()])}>+ Adicionar Animal</button>
                </div>
            )}

            {erro && <p className="error-msg">{erro}</p>}

	            {aba === 'pets' && (
	                <button className="btn btn-outline btn-block" style={{ marginTop: 16 }} disabled={enviando} onClick={enviar}>
	                    {enviando ? 'Enviando...' : modoEdicao ? 'Salvar alterações' : `Concluir Cadastro${totalFotos > 0 ? ` (${totalFotos} foto(s))` : ''}`}
	                </button>
	            )}
        </div>
    );
}
