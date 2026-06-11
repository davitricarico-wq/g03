import { PetService } from '../services/pet.service';
import { HttpError } from '../errors/http-error';
import { STATUS_PET, TIPOS_PET } from '../models/pet.model';

describe('PetService - Suíte Completa', () => {
    let service: PetService;
    let petRepoMock: any;
    let familiaRepoMock: any;

    beforeEach(() => {
        petRepoMock = {
            getAll: jest.fn(),
            getById: jest.fn(),
            getByFamilia: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        familiaRepoMock = { getById: jest.fn() };
        service = new PetService(petRepoMock, familiaRepoMock);
    });

    it('Deve listar todos os pets', async () => {
        petRepoMock.getAll.mockResolvedValue([{ id: 1 }]);
        expect(await service.getAll()).toEqual([{ id: 1 }]);
    });

    it('Deve buscar pet por ID ou retornar 404', async () => {
        petRepoMock.getById.mockResolvedValueOnce({ id: 2 });
        expect(await service.getById(2)).toEqual({ id: 2 });

        petRepoMock.getById.mockResolvedValueOnce(null);
        await expect(service.getById(3)).rejects.toThrow(new HttpError(404, 'Pet nao encontrado'));
    });

    it('Deve buscar pets por família ou retornar 404 se ela não existir', async () => {
        familiaRepoMock.getById.mockResolvedValueOnce({ id: 10 });
        petRepoMock.getByFamilia.mockResolvedValue([{ id: 1 }]);
        expect(await service.getByFamilia(10)).toEqual([{ id: 1 }]);

        familiaRepoMock.getById.mockResolvedValueOnce(null);
        await expect(service.getByFamilia(20)).rejects.toThrow(new HttpError(404, 'Familia nao encontrada'));
    });

    it('Deve barrar cadastro de pets se o ID da família for inválido ou não encontrado', async () => {
        await expect(service.cadastrar({ idFamilia: -1 } as any)).rejects.toThrow(new HttpError(400, 'Familia invalida'));

        familiaRepoMock.getById.mockResolvedValueOnce(null);
        await expect(service.cadastrar({ idFamilia: 5 } as any)).rejects.toThrow(new HttpError(404, 'Familia nao encontrada'));
    });

    it('Deve cadastrar pet mapeando payload sem família explícita', async () => {
        familiaRepoMock.getById.mockResolvedValue({ id: 10 });
        petRepoMock.create.mockResolvedValue({ id: 1 });

        const res = await service.cadastrarNaFamilia(10, {
            idFamilia: 10,
            tipo: TIPOS_PET[0],
            nome: 'Rex',
            porte: 'médio',
            raca: 'Labrador',
            cor: 'dourado',
            status: STATUS_PET[0],
        } as any);
        expect(res).toEqual({ id: 1 });
    });

    it('Deve atualizar e remover pets verificando existência prévia', async () => {
        petRepoMock.getById.mockResolvedValue({ id: 1 });
        petRepoMock.update.mockResolvedValueOnce({ id: 1, nome: 'Bob' });

        expect(await service.atualizar(1, { nome: 'Bob' })).toEqual({ id: 1, nome: 'Bob' });

        petRepoMock.update.mockResolvedValueOnce(null);
        await expect(service.atualizar(1, {})).rejects.toThrow(new HttpError(404, 'Pet nao encontrado'));

        await service.remover(1);
        expect(petRepoMock.delete).toHaveBeenCalledWith(1);
    });
});