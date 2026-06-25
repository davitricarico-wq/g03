import type { CreateFotoSemDonoDto } from './foto.dto';
import type { StatusPet, TipoPet } from '../models/pet.model';

export interface CreatePetDto {
    idFamilia: number;
    tipo: TipoPet;
    nome?: string | null;
    porte: string;
    raca: string;
    cor: string;
    status: StatusPet;
    observacao?: string | null;
    fotos?: CreateFotoSemDonoDto[];
}

export type CreatePetSemFamiliaDto = Omit<CreatePetDto, 'idFamilia'>;

export type UpdatePetDto = Partial<CreatePetSemFamiliaDto>;
