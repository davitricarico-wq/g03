import * as storageClient from '../storage/supabase-storage.client';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import { FotoStorageService } from './foto-storage.service';

function fotoRepo(): jest.Mocked<IFotoRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getByMoradia: jest.fn(),
        getByPet: jest.fn(),
        create: jest.fn(),
        createForMoradia: jest.fn(),
        createForPet: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };
}

function moradiaRepo(): jest.Mocked<IMoradiaRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        createLocalizacao: jest.fn(),
        updateLocalizacao: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };
}

function petRepo(): jest.Mocked<IPetRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getByFamilia: jest.fn(),
        create: jest.fn(),
        createForFamilia: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };
}

describe('FotoStorageService - testes unitarios de Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('gera URL de upload para moradia existente', async () => {
        const fotos = fotoRepo();
        const moradias = moradiaRepo();
        const pets = petRepo();
        moradias.getById.mockResolvedValue({ id: 10 } as never);
        jest.spyOn(storageClient, 'getSupabaseStorageBucket').mockReturnValue('bucket-test');
        jest.spyOn(storageClient, 'getSupabaseStorageClient').mockReturnValue({
            storage: {
                from: jest.fn().mockReturnValue({
                    createSignedUploadUrl: jest.fn().mockResolvedValue({
                        data: {
                            path: 'moradias/10/arquivo.jpg',
                            signedUrl: 'https://upload.test',
                            token: 'token'
                        },
                        error: null
                    })
                })
            }
        } as never);
        const service = new FotoStorageService(fotos, moradias, pets);

        await expect(service.criarUploadParaMoradia(10, {
            fileName: 'fachada.jpg',
            contentType: 'image/jpeg'
        })).resolves.toMatchObject({
            bucket: 'bucket-test',
            path: 'moradias/10/arquivo.jpg',
            signedUrl: 'https://upload.test',
            token: 'token',
            expiresIn: 7200
        });
    });

    it('gera URL de upload para pet existente com content type webp', async () => {
        const pets = petRepo();
        pets.getById.mockResolvedValue({ id: 20 } as never);
        jest.spyOn(storageClient, 'getSupabaseStorageBucket').mockReturnValue('bucket-test');
        jest.spyOn(storageClient, 'getSupabaseStorageClient').mockReturnValue({
            storage: {
                from: jest.fn().mockReturnValue({
                    createSignedUploadUrl: jest.fn().mockResolvedValue({
                        data: {
                            path: 'pets/20/arquivo.webp',
                            signedUrl: 'https://upload-pet.test',
                            token: 'pet-token'
                        },
                        error: null
                    })
                })
            }
        } as never);
        const service = new FotoStorageService(fotoRepo(), moradiaRepo(), pets);

        await expect(service.criarUploadParaPet(20, {
            fileName: 'pet.webp',
            contentType: 'image/webp',
            upsert: true
        })).resolves.toMatchObject({
            bucket: 'bucket-test',
            path: 'pets/20/arquivo.webp',
            token: 'pet-token'
        });
    });

    it('falha ao gerar upload para moradia inexistente ou tipo invalido', async () => {
        const moradias = moradiaRepo();
        moradias.getById.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 10 } as never);
        const service = new FotoStorageService(fotoRepo(), moradias, petRepo());

        await expect(service.criarUploadParaMoradia(10, {
            fileName: 'fachada.jpg',
            contentType: 'image/jpeg'
        })).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.criarUploadParaMoradia(10, {
            fileName: 'fachada.txt',
            contentType: 'text/plain'
        })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('falha ao gerar upload para pet inexistente ou erro do storage', async () => {
        const pets = petRepo();
        pets.getById.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 20 } as never);
        jest.spyOn(storageClient, 'getSupabaseStorageBucket').mockReturnValue('bucket-test');
        jest.spyOn(storageClient, 'getSupabaseStorageClient').mockReturnValue({
            storage: {
                from: jest.fn().mockReturnValue({
                    createSignedUploadUrl: jest.fn().mockResolvedValue({
                        data: null,
                        error: new Error('storage indisponivel')
                    })
                })
            }
        } as never);
        const service = new FotoStorageService(fotoRepo(), moradiaRepo(), pets);

        await expect(service.criarUploadParaPet(20, {
            fileName: 'pet.jpg',
            contentType: 'image/jpeg'
        })).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.criarUploadParaPet(20, {
            fileName: 'pet.jpg',
            contentType: 'image/jpeg'
        })).rejects.toMatchObject({ statusCode: 502 });
    });

    it('gera URL assinada e bloqueia path invalido', async () => {
        const fotos = fotoRepo();
        fotos.getById.mockResolvedValueOnce({ id: 1, idMoradia: 10, idPet: null, url: 'moradias/10/foto.jpg' })
            .mockResolvedValueOnce({ id: 2, idMoradia: 10, idPet: null, url: 'https://externo/foto.jpg' });
        jest.spyOn(storageClient, 'getSupabaseStorageBucket').mockReturnValue('bucket-test');
        jest.spyOn(storageClient, 'getSupabaseStorageClient').mockReturnValue({
            storage: {
                from: jest.fn().mockReturnValue({
                    createSignedUrl: jest.fn().mockResolvedValue({
                        data: { signedUrl: 'https://signed.test' },
                        error: null
                    })
                })
            }
        } as never);
        const service = new FotoStorageService(fotos, moradiaRepo(), petRepo());

        await expect(service.criarUrlAssinadaDaFoto(1, 300)).resolves.toMatchObject({
            bucket: 'bucket-test',
            path: 'moradias/10/foto.jpg',
            signedUrl: 'https://signed.test',
            expiresIn: 300
        });
        await expect(service.criarUrlAssinadaDaFoto(2)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('falha ao gerar URL assinada quando foto nao existe ou storage falha', async () => {
        const fotos = fotoRepo();
        fotos.getById.mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ id: 3, idMoradia: 10, idPet: null, url: 'moradias/10/foto.jpg' });
        jest.spyOn(storageClient, 'getSupabaseStorageBucket').mockReturnValue('bucket-test');
        jest.spyOn(storageClient, 'getSupabaseStorageClient').mockReturnValue({
            storage: {
                from: jest.fn().mockReturnValue({
                    createSignedUrl: jest.fn().mockResolvedValue({
                        data: null,
                        error: new Error('storage indisponivel')
                    })
                })
            }
        } as never);
        const service = new FotoStorageService(fotos, moradiaRepo(), petRepo());

        await expect(service.criarUrlAssinadaDaFoto(99)).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.criarUrlAssinadaDaFoto(3)).rejects.toMatchObject({ statusCode: 502 });
    });
});
