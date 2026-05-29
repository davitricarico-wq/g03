import type { CreateFotoDto, CreateFotoSemMoradiaDto, CreateFotoSemPetDto, UpdateFotoDto } from '../dtos/foto.dto';
import { HttpError } from '../errors/http-error';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { IFotoService } from '../interfaces/services/foto.service.interface';
import type { Foto } from '../models/foto.model';
import { validateFotoUrl } from '../validations/foto.validation';

function isPositiveId(value: unknown): value is number {
    return Number.isInteger(value) && Number(value) > 0;
}

export class FotoService implements IFotoService {
    constructor(
        private fotoRepo: IFotoRepository,
        private moradiaRepo: IMoradiaRepository,
        private petRepo: IPetRepository
    ) {}

    async getAll(): Promise<Foto[]> {
        return this.fotoRepo.getAll();
    }

    async getById(id: number): Promise<Foto> {
        const foto = await this.fotoRepo.getById(id);
        if (!foto) {
            throw new HttpError(404, 'Foto nao encontrada');
        }
        return foto;
    }

    async getByMoradia(idMoradia: number): Promise<Foto[]> {
        const moradia = await this.moradiaRepo.getById(idMoradia);
        if (!moradia) {
            throw new HttpError(404, 'Moradia nao encontrada');
        }
        return this.fotoRepo.getByMoradia(idMoradia);
    }

    async getByPet(idPet: number): Promise<Foto[]> {
        const pet = await this.petRepo.getById(idPet);
        if (!pet) {
            throw new HttpError(404, 'Pet nao encontrado');
        }
        return this.fotoRepo.getByPet(idPet);
    }

    private async cadastrarComDono(data: CreateFotoDto): Promise<Foto> {
        const idMoradia = isPositiveId(data.idMoradia) ? data.idMoradia : null;
        const idPet = isPositiveId(data.idPet) ? data.idPet : null;
        const temMoradia = idMoradia !== null;
        const temPet = idPet !== null;

        if (temMoradia === temPet) {
            throw new HttpError(400, 'Informe uma moradia ou um pet para a foto');
        }

        if (idMoradia !== null) {
            const moradia = await this.moradiaRepo.getById(idMoradia);
            if (!moradia) {
                throw new HttpError(404, 'Moradia nao encontrada');
            }
        }

        if (idPet !== null) {
            const pet = await this.petRepo.getById(idPet);
            if (!pet) {
                throw new HttpError(404, 'Pet nao encontrado');
            }
        }

        return this.fotoRepo.create({
            idMoradia,
            idPet,
            url: validateFotoUrl(data.url)
        });
    }

    async cadastrarNaMoradia(idMoradia: number, data: CreateFotoSemMoradiaDto): Promise<Foto> {
        return this.cadastrarComDono({ ...data, idMoradia });
    }

    async cadastrarNoPet(idPet: number, data: CreateFotoSemPetDto): Promise<Foto> {
        return this.cadastrarComDono({ ...data, idPet });
    }

    async atualizar(id: number, data: UpdateFotoDto): Promise<Foto> {
        await this.getById(id);
        const updated = await this.fotoRepo.update(id, {
            url: data.url === undefined ? undefined : validateFotoUrl(data.url)
        });
        if (!updated) {
            throw new HttpError(404, 'Foto nao encontrada');
        }
        return updated;
    }

    async remover(id: number): Promise<void> {
        await this.getById(id);
        await this.fotoRepo.delete(id);
    }

    async removerDaMoradia(idMoradia: number, idFoto: number): Promise<void> {
        const foto = await this.getById(idFoto);
        if (foto.idMoradia !== idMoradia) {
            throw new HttpError(404, 'Foto nao encontrada para esta moradia');
        }
        await this.fotoRepo.delete(idFoto);
    }

    async removerDoPet(idPet: number, idFoto: number): Promise<void> {
        const foto = await this.getById(idFoto);
        if (foto.idPet !== idPet) {
            throw new HttpError(404, 'Foto nao encontrada para este pet');
        }
        await this.fotoRepo.delete(idFoto);
    }
}
