export const PARENTESCOS = ['Responsável', 'Cônjuge', 'Filho(a)', 'Enteado(a)', 'Pai/Mãe', 'Outro'] as const;
export const ESCOLARIDADES = [
    'Analfabeto',
    'Fundamental Incompleto',
    'Fundamental Completo',
    'Médio Incompleto',
    'Médio Completo',
    'Superior Incompleto',
    'Superior Completo',
    'Pós-graduação'
] as const;
export const SITUACOES_OCUPACIONAIS = [
    'Empregado',
    'Desempregado',
    'Autônomo',
    'Informal',
    'Aposentado/Pensionista',
    'Estudante',
    'Do Lar',
    'Outro'
] as const;
export const SEXOS = ['Masculino', 'Feminino', 'Outro', 'Não Declarado'] as const;
export const RACAS = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Não Declarado'] as const;
export const ESTADOS_CIVIS = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'] as const;

export const TIPOS_CONSTRUCAO = ['Alvenaria', 'Madeira', 'Mista', 'Taipa', 'Lona/Improvisada', 'Outro'] as const;
export const USOS_IMOVEL = ['Residencial', 'Comercial', 'Misto', 'Institucional', 'Abandonado'] as const;
export const SITUACOES_OCUPACAO_MORADIA = [
    'Própria Quitada',
    'Própria Financiada',
    'Alugada',
    'Cedida',
    'Invasão',
    'Outro'
] as const;
export const STATUS_MORADIA = ['Ativa', 'Interditada', 'Demolida', 'Em Risco', 'Excluída'] as const;

export const TIPOS_PET = ['cachorro', 'gato', 'reptil', 'ave', 'roedor', 'outros'] as const;
export const STATUS_PET = ['Ativo', 'Inativo', 'Desaparecido', 'Falecido'] as const;
export const STATUS_PESSOA = ['Ativo', 'Obito', 'Inativo'] as const;
export type EscopoPessoa = 'ativas' | 'inativas' | 'todas';

export interface Localizacao {
    id: number;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string;
    estado: string;
    cep: string | null;
    latitude: number;
    longitude: number;
    referencia: string | null;
    complemento: string | null;
}

export interface MoradiaComLocalizacao {
    id: number;
    idLocalizacao: number;
    tipoConstrucao: string;
    dataRegistro?: string | null;
    status: string;
    usoImovel: string;
    pavimentos: number;
    situacaoDeOcupacao: string;
    descricao: string | null;
    localizacao: Localizacao;
}

export interface FamiliaBuscaResultado {
    id: number;
    responsavel: { id: number; nome: string; cpf: string | null } | null;
    bairro: string | null;
    totalPessoas: number;
    totalPets: number;
    prioridadeTipos: string[];
    prioridadeCondicoes: string[];
    grupos: {
        idoso: boolean;
        crianca: boolean;
        gestante: boolean;
        doencaCronica: boolean;
    };
}

export interface Prioridade {
    id: number;
    condicao: string;
    tipo: string;
}

export interface CreatePessoaPayload {
    nome: string;
    nomeSocial?: string | null;
    cpf?: string | null;
    dataDeNascimento: string;
    parentesco: string;
    situacaoOcupacional: string;
    escolaridade: string;
    cronico: boolean;
    medicacao: boolean;
}

export interface CreateResponsavelPayload extends CreatePessoaPayload {
    nis?: string | null;
    renda?: number | null;
    sexo: string;
    raca: string;
    estadoCivil: string;
    veiculo?: boolean;
    programaSocial?: boolean;
    email?: string | null;
    telefone?: string | null;
    localDeNascimento?: string | null;
    nomeDoPai?: string | null;
    nomeDaMae?: string | null;
    dataResidenciaEstado?: string | null;
    dataResidenciaMoradia?: string | null;
}

export interface CreatePetPayload {
    tipo: string;
    nome: string;
    porte: string;
    raca: string;
    cor: string;
    status: string;
    observacao?: string | null;
}

export interface PessoaBuscaResultado {
    id: number;
    nome: string;
    nomeSocial: string | null;
    cpf: string | null;
    dataDeNascimento: string | null;
    parentesco: string | null;
    situacaoOcupacional: string | null;
    escolaridade: string | null;
    cronico: boolean;
    medicacao: boolean;
    status: string | null;
    deletedAt: string | null;
    email: string | null;
    telefone: string | null;
    responsavel: boolean;
}

export interface Pessoa extends PessoaBuscaResultado {}

export interface Pessoa {
    nis?: string | null;
    renda?: number | null;
    sexo?: string | null;
    raca?: string | null;
    estadoCivil?: string | null;
    veiculo?: boolean;
    programaSocial?: boolean;
    localDeNascimento?: string | null;
    nomeDoPai?: string | null;
    nomeDaMae?: string | null;
    dataResidenciaEstado?: string | null;
    dataResidenciaMoradia?: string | null;
}

export interface Pet {
    id: number;
    idFamilia: number;
    tipo: string;
    nome: string;
    porte: string;
    raca: string;
    cor: string;
    status: string;
    observacao: string | null;
}

export interface FamiliaDetalhe {
    id: number;
    pessoas: Pessoa[];
    moradias: MoradiaComLocalizacao[];
    pets: Pet[];
}

export interface Foto {
    id: number;
    idMoradia: number | null;
    idPet: number | null;
    url: string;
}

export interface MoradiaDetalhe {
    moradia: MoradiaComLocalizacao;
    familias: {
        familia: {
            id: number;
            deletedAt: string | null;
        };
        pessoas: Pessoa[];
        pets: Pet[];
    }[];
    fotos: Foto[];
}

export interface FamiliaMoradiaHistorico {
    vinculo: {
        idFamilia: number;
        idMoradia: number;
        dataEntrada: string;
        dataSaida: string | null;
        status: string | null;
    };
    moradia: Omit<MoradiaComLocalizacao, 'localizacao'>;
    ativo: boolean;
}

export interface MoradiaFamiliaHistorico {
    vinculo: {
        idFamilia: number;
        idMoradia: number;
        dataEntrada: string;
        dataSaida: string | null;
        status: string | null;
    };
    familia: {
        id: number;
        deletedAt: string | null;
    };
    ativo: boolean;
}

export interface FotoUploadUrl {
    bucket: string;
    path: string;
    signedUrl: string;
    token: string;
    expiresIn: number;
}

/** Resposta do POST /familias/nucleo (ids necessários para anexar fotos). */
export interface NucleoFamiliarCriado {
    moradia: { id: number } | null;
    familia: { id: number };
    responsavel: { id: number };
    dependentes: { id: number }[];
    pets: { id: number }[];
    fotos: Foto[];
}

export interface CreateNucleoFamiliarPayload {
    localizacao?: {
        logradouro?: string | null;
        numero?: string | null;
        bairro?: string | null;
        cidade: string;
        estado: string;
        cep?: string | null;
        latitude: number;
        longitude: number;
        referencia?: string | null;
        complemento?: string | null;
    };
    moradia?: {
        tipoConstrucao: string;
        usoImovel: string;
        situacaoDeOcupacao: string;
        status?: string;
        pavimentos?: number;
        descricao?: string | null;
    };
    responsavel: CreateResponsavelPayload;
    dependentes?: CreatePessoaPayload[];
    pets?: CreatePetPayload[];
}

export type UpdatePessoaPayload = Partial<CreatePessoaPayload> & { status?: string };

export interface UpdateMoradiaPayload {
    localizacao?: Partial<CreateNucleoFamiliarPayload['localizacao']>;
    moradia?: Partial<CreateNucleoFamiliarPayload['moradia']>;
}
