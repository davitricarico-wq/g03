export const STATUS_PESSOA = ['Ativo', 'Obito', 'Inativo'] as const;
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

export type StatusPessoa = (typeof STATUS_PESSOA)[number];
export type Parentesco = (typeof PARENTESCOS)[number];
export type Escolaridade = (typeof ESCOLARIDADES)[number];
export type SituacaoOcupacional = (typeof SITUACOES_OCUPACIONAIS)[number];
export type Sexo = (typeof SEXOS)[number];
export type Raca = (typeof RACAS)[number];
export type EstadoCivil = (typeof ESTADOS_CIVIS)[number];

export interface Pessoa {
    id: number;
    nome: string;
    nomeSocial: string | null;
    cpf: string | null;
    dataDeNascimento: Date;
    parentesco: Parentesco;
    situacaoOcupacional: SituacaoOcupacional;
    escolaridade: Escolaridade;
    cronico: boolean;
    medicacao: boolean;
    status: StatusPessoa;
    deletedAt: Date | null;
}

export interface Responsavel extends Pessoa {
    nis: string | null;
    renda: number | null;
    sexo: Sexo;
    raca: Raca;
    estadoCivil: EstadoCivil;
    veiculo: boolean;
    programaSocial: boolean;
    email: string | null;
    telefone: string | null;
    nomeDoPai: string | null;
    nomeDaMae: string | null;
    localDeNascimento: string | null;
    dataResidenciaEstado: Date | null;
    dataResidenciaMoradia: Date | null;
}
