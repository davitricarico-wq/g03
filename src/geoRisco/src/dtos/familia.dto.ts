import type { CreateLocalizacaoDto } from './localizacao.dto';
import type { CreateFotoSemMoradiaDto } from './foto.dto';
import type { CreateMoradiaDto } from './moradia.dto';
import type { CreatePetSemFamiliaDto } from './pet.dto';
import type { CreatePessoaDto, CreateResponsavelDto } from './pessoa.dto';
import type { Familia } from '../models/familia.model';
import type { Foto } from '../models/foto.model';
import type { Localizacao } from '../models/localizacao.model';
import type { Moradia } from '../models/moradia.model';
import type { Pessoa, Responsavel } from '../models/pessoa.model';
import type { Pet } from '../models/pet.model';

export interface CreateFamiliaDto {}

export interface VincularPessoaFamiliaDto {
    idPessoa: number;
    dataEntrada?: Date;
}

export interface VincularMoradiaFamiliaDto {
    idMoradia: number;
    dataEntrada?: Date;
    status?: string | null;
}

export interface CreateNucleoFamiliarDto {
    localizacao: CreateLocalizacaoDto;
    moradia: CreateMoradiaDto;
    responsavel: CreateResponsavelDto;
    dependentes?: CreatePessoaDto[];
    pets?: CreatePetSemFamiliaDto[];
    fotos?: CreateFotoSemMoradiaDto[];
    dataEntrada?: Date;
    statusMoradiaFamilia?: string | null;
}

export interface NucleoFamiliarCriado {
    localizacao: Localizacao;
    moradia: Moradia;
    familia: Familia;
    responsavel: Responsavel;
    dependentes: Pessoa[];
    pets: Pet[];
    fotos: Foto[];
}

export interface PessoaFamiliaHistoricoDto {
    vinculo: {
        idPessoa: number;
        idFamilia: number;
        dataEntrada: Date;
        dataSaida: Date | null;
    };
    pessoa: Pessoa;
    ativo: boolean;
}

export interface FamiliaMoradiaHistoricoDto {
    vinculo: {
        idFamilia: number;
        idMoradia: number;
        dataEntrada: Date;
        dataSaida: Date | null;
        status: string | null;
    };
    moradia: Moradia;
    ativo: boolean;
}

export interface MoradiaFamiliaHistoricoDto {
    vinculo: {
        idFamilia: number;
        idMoradia: number;
        dataEntrada: Date;
        dataSaida: Date | null;
        status: string | null;
    };
    familia: Familia;
    ativo: boolean;
}
