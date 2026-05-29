import type { CreatePetDto, CreatePetSemFamiliaDto, UpdatePetDto } from '../../dtos/pet.dto';
import type { Pet } from '../../models/pet.model';

export interface IPetService {
    getAll(): Promise<Pet[]>;
    getById(id: number): Promise<Pet>;
    getByFamilia(idFamilia: number): Promise<Pet[]>;
    cadastrar(data: CreatePetDto): Promise<Pet>;
    cadastrarNaFamilia(idFamilia: number, data: CreatePetSemFamiliaDto): Promise<Pet>;
    atualizar(id: number, data: UpdatePetDto): Promise<Pet>;
    remover(id: number): Promise<void>;
}
