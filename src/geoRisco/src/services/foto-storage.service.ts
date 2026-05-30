import { randomUUID } from 'crypto';
import type { CreateFotoUploadUrlDto, FotoSignedUrlDto, FotoUploadUrlDto } from '../dtos/foto-storage.dto';
import { HttpError } from '../errors/http-error';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { IFotoStorageService } from '../interfaces/services/foto-storage.service.interface';
import { getSupabaseStorageBucket, getSupabaseStorageClient } from '../storage/supabase-storage.client';
import {
    extensionFromContentType,
    validateCreateFotoUploadUrlPayload,
    validateStoragePath
} from '../validations/foto-storage.validation';

const UPLOAD_URL_EXPIRES_IN_SECONDS = 60 * 60 * 2;

export class FotoStorageService implements IFotoStorageService {
    constructor(
        private fotoRepo: IFotoRepository,
        private moradiaRepo: IMoradiaRepository,
        private petRepo: IPetRepository
    ) {}

    async criarUploadParaMoradia(idMoradia: number, data: CreateFotoUploadUrlDto): Promise<FotoUploadUrlDto> {
        const moradia = await this.moradiaRepo.getById(idMoradia);
        if (!moradia) {
            throw new HttpError(404, 'Moradia nao encontrada');
        }

        return this.criarUploadUrl(`moradias/${idMoradia}`, data);
    }

    async criarUploadParaPet(idPet: number, data: CreateFotoUploadUrlDto): Promise<FotoUploadUrlDto> {
        const pet = await this.petRepo.getById(idPet);
        if (!pet) {
            throw new HttpError(404, 'Pet nao encontrado');
        }

        return this.criarUploadUrl(`pets/${idPet}`, data);
    }

    async criarUrlAssinadaDaFoto(idFoto: number, expiresIn = 300): Promise<FotoSignedUrlDto> {
        const foto = await this.fotoRepo.getById(idFoto);
        if (!foto) {
            throw new HttpError(404, 'Foto nao encontrada');
        }

        const bucket = getSupabaseStorageBucket();
        const path = validateStoragePath(foto.url);
        const { data, error } = await getSupabaseStorageClient()
            .storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error || !data) {
            throw new HttpError(502, 'Erro ao gerar URL assinada da foto');
        }

        return {
            bucket,
            path,
            signedUrl: data.signedUrl,
            expiresIn
        };
    }

    private async criarUploadUrl(folder: string, data: CreateFotoUploadUrlDto): Promise<FotoUploadUrlDto> {
        const validated = validateCreateFotoUploadUrlPayload(data);
        const bucket = getSupabaseStorageBucket();
        const path = `${folder}/${randomUUID()}.${extensionFromContentType(validated.contentType)}`;
        const { data: signedData, error } = await getSupabaseStorageClient()
            .storage
            .from(bucket)
            .createSignedUploadUrl(path, { upsert: validated.upsert ?? false });

        if (error || !signedData) {
            throw new HttpError(502, 'Erro ao gerar URL assinada de upload');
        }

        return {
            bucket,
            path: signedData.path,
            signedUrl: signedData.signedUrl,
            token: signedData.token,
            expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS
        };
    }
}
