import type {
    SituacaoOcupacaoMoradia,
    StatusMoradia,
    TipoConstrucao,
    UsoImovel
} from '../models/moradia.model';
import type { Familia } from '../models/familia.model';
import type { Foto } from '../models/foto.model';
import type { Pessoa } from '../models/pessoa.model';
import type { Pet } from '../models/pet.model';
import type { CreateLocalizacaoDto, UpdateLocalizacaoDto } from './localizacao.dto';
import type { MoradiaComLocalizacao } from '../models/moradia.model';

export interface CreateMoradiaDto {
    tipoConstrucao: TipoConstrucao;
    dataRegistro?: Date | null;
    status?: StatusMoradia;
    usoImovel: UsoImovel;
    pavimentos?: number;
    situacaoDeOcupacao: SituacaoOcupacaoMoradia;
    descricao?: string | null;
}

export type UpdateMoradiaDto = Partial<CreateMoradiaDto>;

export interface CreateMoradiaComLocalizacaoDto {
    localizacao: CreateLocalizacaoDto;
    moradia: CreateMoradiaDto;
}

export interface UpdateMoradiaComLocalizacaoDto {
    localizacao?: UpdateLocalizacaoDto;
    moradia?: UpdateMoradiaDto;
}

export interface FamiliaMoradiaDetalheDto {
    familia: Familia;
    pessoas: Pessoa[];
    pets: Pet[];
}

export interface MoradiaDetalhadaDto {
    moradia: MoradiaComLocalizacao;
    familias: FamiliaMoradiaDetalheDto[];
    fotos: Foto[];
}
