import type { CreateFotoUploadUrlDto, FotoSignedUrlDto, FotoUploadUrlDto } from '../../dtos/foto-storage.dto';

export interface IFotoStorageService {
    criarUploadParaMoradia(idMoradia: number, data: CreateFotoUploadUrlDto): Promise<FotoUploadUrlDto>;
    criarUploadParaPet(idPet: number, data: CreateFotoUploadUrlDto): Promise<FotoUploadUrlDto>;
    criarUrlAssinadaDaFoto(idFoto: number, expiresIn?: number): Promise<FotoSignedUrlDto>;
}
