import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { Foto } from '../models/foto.model';
import { SITUACOES_OCUPACAO_MORADIA, TIPOS_CONSTRUCAO, USOS_IMOVEL } from '../models/moradia.model';
import { STATUS_PET, TIPOS_PET } from '../models/pet.model';
import { FotoService } from './foto.service';

const foto: Foto = { id: 1, idMoradia: 10, idPet: null, url: ' moradias/10/foto.jpg ' };

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

describe('FotoService - testes unitarios de Service', () => {
    it('CT04 -> RN04 - registra foto quando existe exatamente um dono', async () => {
        const fotos = fotoRepo();
        const moradias = moradiaRepo();
        const pets = petRepo();
        moradias.getById.mockResolvedValue({
            id: 10,
            idLocalizacao: 1,
            tipoConstrucao: TIPOS_CONSTRUCAO[0],
            dataRegistro: null,
            status: 'Ativa',
            usoImovel: USOS_IMOVEL[0],
            pavimentos: 1,
            situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0],
            descricao: null,
            deletedAt: null,
            localizacao: {
                id: 1,
                logradouro: null,
                numero: null,
                bairro: null,
                cidade: 'Santo Andre',
                estado: 'SP',
                cep: null,
                latitude: -23,
                longitude: -46,
                referencia: null,
                complemento: null
            }
        });
        fotos.create.mockResolvedValue({ ...foto, url: 'moradias/10/foto.jpg' });
        const service = new FotoService(fotos, moradias, pets);

        await expect(service.cadastrarNaMoradia(10, { url: ' moradias/10/foto.jpg ' })).resolves.toMatchObject({
            url: 'moradias/10/foto.jpg'
        });

        expect(fotos.create).toHaveBeenCalledWith({ idMoradia: 10, idPet: null, url: 'moradias/10/foto.jpg' });
    });

    it('CT04 -> RN04 - falha quando foto tem zero ou dois donos', async () => {
        const service = new FotoService(fotoRepo(), moradiaRepo(), petRepo());

        await expect((service as unknown as { cadastrarComDono(data: unknown): Promise<Foto> }).cadastrarComDono({
            url: 'foto.jpg'
        })).rejects.toMatchObject({ statusCode: 400 });
        await expect((service as unknown as { cadastrarComDono(data: unknown): Promise<Foto> }).cadastrarComDono({
            idMoradia: 10,
            idPet: 20,
            url: 'foto.jpg'
        })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('lista, atualiza e remove fotos com validacao de vinculo', async () => {
        const fotos = fotoRepo();
        const moradias = moradiaRepo();
        const pets = petRepo();
        fotos.getAll.mockResolvedValue([foto]);
        fotos.getById.mockResolvedValue({ ...foto, url: 'moradias/10/foto.jpg' });
        fotos.update.mockResolvedValue({ ...foto, url: 'moradias/10/nova.jpg' });
        const service = new FotoService(fotos, moradias, pets);

        await expect(service.getAll()).resolves.toHaveLength(1);
        await expect(service.atualizar(1, { url: ' moradias/10/nova.jpg ' })).resolves.toMatchObject({
            url: 'moradias/10/nova.jpg'
        });
        await service.removerDaMoradia(10, 1);
        await expect(service.removerDoPet(99, 1)).rejects.toMatchObject({ statusCode: 404 });

        expect(fotos.delete).toHaveBeenCalledWith(1);
    });

    it('falha quando dono consultado nao existe', async () => {
        const fotos = fotoRepo();
        const moradias = moradiaRepo();
        const pets = petRepo();
        moradias.getById.mockResolvedValue(null);
        pets.getById.mockResolvedValue(null);
        const service = new FotoService(fotos, moradias, pets);

        await expect(service.getByMoradia(10)).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.getByPet(20)).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.cadastrarNoPet(20, { url: 'pets/20/foto.jpg' })).rejects.toMatchObject({ statusCode: 404 });
    });
});
