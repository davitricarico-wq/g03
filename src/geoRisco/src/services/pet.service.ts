import { HttpError } from '../errors/http-error';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { IPetService } from '../interfaces/services/pet.service.interface';
import type { CreatePetDto, CreatePetSemFamiliaDto, UpdatePetDto } from '../dtos/pet.dto';
import type { Pet } from '../models/pet.model';
import { validateCreatePet, validateUpdatePet } from '../validations/pet.validation';

export class PetService implements IPetService {
    constructor(
        private petRepo: IPetRepository,
        private familiaRepo: IFamiliaRepository
    ) {}

    async getAll(): Promise<Pet[]> {
        return this.petRepo.getAll();
    }

    async getById(id: number): Promise<Pet> {
        const pet = await this.petRepo.getById(id);
        if (!pet) {
            throw new HttpError(404, 'Pet nao encontrado');
        }
        return pet;
    }

    async getByFamilia(idFamilia: number): Promise<Pet[]> {
        const familia = await this.familiaRepo.getById(idFamilia);
        if (!familia) {
            throw new HttpError(404, 'Familia nao encontrada');
        }
        return this.petRepo.getByFamilia(idFamilia);
    }

    async cadastrar(data: CreatePetDto): Promise<Pet> {
        if (!Number.isInteger(data.idFamilia) || data.idFamilia <= 0) {
            throw new HttpError(400, 'Familia invalida');
        }

        const familia = await this.familiaRepo.getById(data.idFamilia);
        if (!familia) {
            throw new HttpError(404, 'Familia nao encontrada');
        }

        return this.petRepo.create({
            idFamilia: data.idFamilia,
            ...validateCreatePet(data)
        });
    }

    async cadastrarNaFamilia(idFamilia: number, data: CreatePetSemFamiliaDto): Promise<Pet> {
        return this.cadastrar({ ...data, idFamilia });
    }

    async atualizar(id: number, data: UpdatePetDto): Promise<Pet> {
        await this.getById(id);
        const updated = await this.petRepo.update(id, validateUpdatePet(data));
        if (!updated) {
            throw new HttpError(404, 'Pet nao encontrado');
        }
        return updated;
    }

    async remover(id: number): Promise<void> {
        await this.getById(id);
        await this.petRepo.delete(id);
    }
}
