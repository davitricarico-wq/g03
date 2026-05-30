import type { Queryable } from '../../db/queryable';
import type { CreatePetDto, CreatePetSemFamiliaDto, UpdatePetDto } from '../../dtos/pet.dto';
import type { Pet } from '../../models/pet.model';

export interface IPetRepository {
    getAll(db?: Queryable): Promise<Pet[]>;
    getById(id: number, db?: Queryable): Promise<Pet | null>;
    getByFamilia(idFamilia: number, db?: Queryable): Promise<Pet[]>;
    create(data: CreatePetDto, db?: Queryable): Promise<Pet>;
    createForFamilia(idFamilia: number, data: CreatePetSemFamiliaDto, db?: Queryable): Promise<Pet>;
    update(id: number, data: UpdatePetDto, db?: Queryable): Promise<Pet | null>;
    delete(id: number, db?: Queryable): Promise<void>;
}
