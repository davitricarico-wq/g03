import { MoradiaService } from '../services/moradia.service';
import { pool } from '../db/connection';
import { HttpError } from '../errors/http-error';
import { CreateMoradiaComLocalizacaoDto } from '../dtos/moradia.dto';
import { SITUACOES_OCUPACAO_MORADIA, TIPOS_CONSTRUCAO, USOS_IMOVEL } from '../models/moradia.model';

// Mocking de dependências globais do arquivo
jest.mock('../db/connection.ts', () => ({
    pool: {
        connect: jest.fn(),
    },
}));
jest.mock('../validations/familia.validation');

// Definição do Mock Client local para testes transacionais
const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
};

// Vincula o pool mockado para resolver sempre com o nosso mockClient local
(pool.connect as jest.Mock).mockResolvedValue(mockClient);


describe('MoradiaService - Suíte Completa', () => {
    let service: MoradiaService;
    let moradiaRepoMock: any;
    let familiaRepoMock: any;
    let fotoRepoMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        moradiaRepoMock = {
            getAll: jest.fn(),
            getById: jest.fn(),
            createLocalizacao: jest.fn(),
            create: jest.fn(),
            updateLocalizacao: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        familiaRepoMock = {
            getFamiliasByMoradia: jest.fn(),
            getHistoricoFamiliasByMoradia: jest.fn(),
            getPessoas: jest.fn(),
            getPets: jest.fn()
        };
        fotoRepoMock = { getByMoradia: jest.fn() };

        service = new MoradiaService(moradiaRepoMock, familiaRepoMock, fotoRepoMock);
    });

    describe('Métodos de leitura simples', () => {
        it('Deve retornar todas as moradias em getAll', async () => {
            moradiaRepoMock.getAll.mockResolvedValue([{ id: 1 }]);
            expect(await service.getAll()).toEqual([{ id: 1 }]);
        });

        it('Deve lançar 404 se a moradia não for encontrada em getById', async () => {
            moradiaRepoMock.getById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toThrow(new HttpError(404, 'Moradia não encontrada'));
        });

        it('Deve remover uma moradia com sucesso', async () => {
            moradiaRepoMock.getById.mockResolvedValue({ id: 1 });
            await service.remover(1);
            expect(moradiaRepoMock.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('getDetalhes e getHistoricoFamilias', () => {
        it('Deve lançar 500 se as dependências opcionais não forem fornecidas', async () => {
            const serviceIncompleto = new MoradiaService(moradiaRepoMock);
            await expect(serviceIncompleto.getDetalhes(1)).rejects.toThrow(new HttpError(500, 'Dependencias de detalhe de moradia nao configuradas'));
            await expect(serviceIncompleto.getHistoricoFamilias(1)).rejects.toThrow(new HttpError(500, 'Dependencias de historico de moradia nao configuradas'));
        });

        it('Deve montar a árvore completa de detalhes da moradia', async () => {
            moradiaRepoMock.getById.mockResolvedValue({ id: 1 });
            familiaRepoMock.getFamiliasByMoradia.mockResolvedValue([{ id: 10 }]);
            fotoRepoMock.getByMoradia.mockResolvedValue([{ id: 100 }]);
            familiaRepoMock.getPessoas.mockResolvedValue([{ id: 20 }]);
            familiaRepoMock.getPets.mockResolvedValue([{ id: 30 }]);

            const detalhes = await service.getDetalhes(1);
            expect(detalhes.familias[0].pessoas).toEqual([{ id: 20 }]);
            expect(detalhes.fotos).toEqual([{ id: 100 }]);
        });

        it('Deve buscar o histórico de famílias vinculadas à moradia', async () => {
            moradiaRepoMock.getById.mockResolvedValue({ id: 1 });
            familiaRepoMock.getHistoricoFamiliasByMoradia.mockResolvedValue([{ id: 50 }]);

            const res = await service.getHistoricoFamilias(1);
            expect(res).toEqual([{ id: 50 }]);
        });
    });

    describe('cadastrar (Transacional)', () => {
        const dtoValido: CreateMoradiaComLocalizacaoDto = {
            localizacao: {
                cidade: 'Cidade Teste',
                estado: 'UF',
                latitude: -23.5505,
                longitude: -46.6333
            },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0], // Garante que pega um tipo válido do seu enum/type
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            }
        };

        it('Deve cadastrar localização e moradia em uma transação atômica bem sucedida', async () => {
            moradiaRepoMock.createLocalizacao.mockResolvedValue({ id: 10 });
            moradiaRepoMock.create.mockResolvedValue({ id: 20 });
            moradiaRepoMock.getById.mockResolvedValue({ id: 20, idLocalizacao: 10 });

            const res = await service.cadastrar(dtoValido);
            expect(res.id).toBe(20);
            expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        });

        it('Deve lançar erro genérico se a moradia sumir da view de leitura pós criação', async () => {
            moradiaRepoMock.createLocalizacao.mockResolvedValue({ id: 10 });
            moradiaRepoMock.create.mockResolvedValue({ id: 20 });
            moradiaRepoMock.getById.mockResolvedValue(null);

            await expect(service.cadastrar(dtoValido)).rejects.toThrow('Moradia criada, mas não encontrada na view de leitura');
            expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
        });
    });

    describe('atualizar', () => {
        it('CT05 - Deve lançar HttpError 404 ao tentar atualizar uma moradia inexistente', async () => {
            moradiaRepoMock.getById.mockResolvedValue(null);
            await expect(service.atualizar(999, { moradia: {} })).rejects.toThrow(new HttpError(404, 'Moradia não encontrada'));
        });
    });
});