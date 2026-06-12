import { FotoService } from '../services/foto.service';
import { HttpError } from '../errors/http-error';

describe('FotoService - Suíte Completa', () => {
    let service: FotoService;
    let fotoRepoMock: any;
    let moradiaRepoMock: any;
    let petRepoMock: any;

    beforeEach(() => {
        fotoRepoMock = {
            getAll: jest.fn(),
            getById: jest.fn(),
            getByMoradia: jest.fn(),
            getByPet: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        moradiaRepoMock = { getById: jest.fn() };
        petRepoMock = { getById: jest.fn() };
        service = new FotoService(fotoRepoMock, moradiaRepoMock, petRepoMock);
    });

    it('Deve listar e buscar fotos por ID base', async () => {
        fotoRepoMock.getAll.mockResolvedValue([]);
        expect(await service.getAll()).toEqual([]);

        fotoRepoMock.getById.mockResolvedValue(null);
        await expect(service.getById(1)).rejects.toThrow(new HttpError(404, 'Foto nao encontrada'));
    });

    it('Deve buscar fotos de Moradia ou Pet validando parentesco', async () => {
        moradiaRepoMock.getById.mockResolvedValue(null);
        await expect(service.getByMoradia(1)).rejects.toThrow(new HttpError(404, 'Moradia nao encontrada'));

        petRepoMock.getById.mockResolvedValue(null);
        await expect(service.getByPet(1)).rejects.toThrow(new HttpError(404, 'Pet nao encontrado'));
    });

    it('Deve barrar cadastro com donos ambíguos ou inválidos', async () => {
        // Sem dono ou com ambos os donos preenchidos simultaneamente
        await expect(service.cadastrarNaMoradia(null as any, { url: 'x' })).rejects.toThrow(new HttpError(400, 'Informe uma moradia ou um pet para a foto'));

        moradiaRepoMock.getById.mockResolvedValue(null);
        await expect(service.cadastrarNaMoradia(1, { url: 'x' })).rejects.toThrow(new HttpError(404, 'Moradia nao encontrada'));

        petRepoMock.getById.mockResolvedValue(null);
        await expect(service.cadastrarNoPet(1, { url: 'x' })).rejects.toThrow(new HttpError(404, 'Pet nao encontrado'));
    });

    it('Deve cadastrar com sucesso se dono existir', async () => {
        moradiaRepoMock.getById.mockResolvedValue({ id: 1 });
        fotoRepoMock.create.mockResolvedValue({ id: 100 });
        expect(await service.cadastrarNaMoradia(1, { url: 'http://bucket.com/foto.png' })).toEqual({ id: 100 });
    });

    it('Deve atualizar e remover com restrição de contexto', async () => {
        fotoRepoMock.getById.mockResolvedValue({ id: 10, idMoradia: 1, idPet: null });
        fotoRepoMock.update.mockResolvedValue({ id: 10 });

        expect(await service.atualizar(10, { url: 'new' })).toEqual({ id: 10 });

        await service.removerDaMoradia(1, 10);
        expect(fotoRepoMock.delete).toHaveBeenCalledWith(10);

        await expect(service.removerDaMoradia(99, 10)).rejects.toThrow(new HttpError(404, 'Foto nao encontrada para esta moradia'));
        await expect(service.removerDoPet(1, 10)).rejects.toThrow(new HttpError(404, 'Foto nao encontrada para este pet'));
    });
});