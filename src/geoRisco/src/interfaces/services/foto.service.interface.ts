import type { CreateFotoSemMoradiaDto, CreateFotoSemPetDto, UpdateFotoDto } from '../../dtos/foto.dto';
import type { Foto } from '../../models/foto.model';

export interface IFotoService {
    getAll(): Promise<Foto[]>;
    getById(id: number): Promise<Foto>;
    getByMoradia(idMoradia: number): Promise<Foto[]>;
    getByPet(idPet: number): Promise<Foto[]>;
    cadastrarNaMoradia(idMoradia: number, data: CreateFotoSemMoradiaDto): Promise<Foto>;
    cadastrarNoPet(idPet: number, data: CreateFotoSemPetDto): Promise<Foto>;
    atualizar(id: number, data: UpdateFotoDto): Promise<Foto>;
    remover(id: number): Promise<void>;
    removerDaMoradia(idMoradia: number, idFoto: number): Promise<void>;
    removerDoPet(idPet: number, idFoto: number): Promise<void>;
}
