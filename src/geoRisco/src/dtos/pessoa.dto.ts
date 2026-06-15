import type {
    Escolaridade,
    EstadoCivil,
    Parentesco,
    Pessoa,
    Raca,
    Sexo,
    SituacaoOcupacional,
    StatusPessoa
} from '../models/pessoa.model';

export interface CreatePessoaDto {
    nome: string;
    nomeSocial?: string | null;
    cpf?: string | null;
    dataDeNascimento: Date;
    parentesco: Parentesco;
    situacaoOcupacional: SituacaoOcupacional;
    escolaridade: Escolaridade;
    cronico: boolean;
    medicacao: boolean;
    status?: StatusPessoa;
}

export type UpdatePessoaDto = Partial<CreatePessoaDto>;

export interface CreateResponsavelDto extends CreatePessoaDto {
    nis?: string | null;
    renda?: number | null;
    sexo: Sexo;
    raca: Raca;
    estadoCivil: EstadoCivil;
    veiculo?: boolean;
    programaSocial?: boolean;
    email?: string | null;
    telefone?: string | null;
    nomeDoPai?: string | null;
    nomeDaMae?: string | null;
    localDeNascimento?: string | null;
    dataResidenciaEstado?: Date | null;
    dataResidenciaMoradia?: Date | null;
}

export type UpdateResponsavelDto = Partial<CreateResponsavelDto>;

export interface BuscarPessoaDto {
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
    escopo?: 'ativas' | 'inativas' | 'todas';
}

export interface PessoaBuscaResultadoDto extends Pessoa {
    email: string | null;
    telefone: string | null;
    responsavel: boolean;
}
