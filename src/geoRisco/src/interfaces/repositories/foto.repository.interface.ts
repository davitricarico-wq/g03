import type { Queryable } from '../../db/queryable';
import type { CreateFotoDto, CreateFotoSemMoradiaDto, CreateFotoSemPetDto, UpdateFotoDto } from '../../dtos/foto.dto';
import type { Foto } from '../../models/foto.model';

export interface IFotoRepository {
    getAll(db?: Queryable): Promise<Foto[]>;
    getById(id: number, db?: Queryable): Promise<Foto | null>;
    getByMoradia(idMoradia: number, db?: Queryable): Promise<Foto[]>;
    getByPet(idPet: number, db?: Queryable): Promise<Foto[]>;
    create(data: CreateFotoDto, db?: Queryable): Promise<Foto>;
    createForMoradia(idMoradia: number, data: CreateFotoSemMoradiaDto, db?: Queryable): Promise<Foto>;
    createForPet(idPet: number, data: CreateFotoSemPetDto, db?: Queryable): Promise<Foto>;
    update(id: number, data: UpdateFotoDto, db?: Queryable): Promise<Foto | null>;
    delete(id: number, db?: Queryable): Promise<void>;
}
