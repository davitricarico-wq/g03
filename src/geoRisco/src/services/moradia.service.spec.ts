import { pool } from '../db/connection';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { MoradiaComLocalizacao } from '../models/moradia.model';
import { SITUACOES_OCUPACAO_MORADIA, TIPOS_CONSTRUCAO, USOS_IMOVEL } from '../models/moradia.model';
import { MoradiaService } from './moradia.service';

function moradia(overrides: Partial<MoradiaComLocalizacao> = {}): MoradiaComLocalizacao {
    return {
        id: 1,
        idLocalizacao: 10,
        tipoConstrucao: TIPOS_CONSTRUCAO[0],
        dataRegistro: new Date('2026-01-01T00:00:00.000Z'),
        status: 'Ativa',
        usoImovel: USOS_IMOVEL[0],
        pavimentos: 1,
        situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0],
        descricao: null,
        deletedAt: null,
        localizacao: {
            id: 10,
            logradouro: null,
            numero: null,
            bairro: null,
            cidade: 'Santo Andre',
            estado: 'SP',
            cep: null,
            latitude: -23.6637,
            longitude: -46.5383,
            referencia: null,
            complemento: null
        },
        ...overrides
    };
}

function repo(): jest.Mocked<IMoradiaRepository> {
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

function familiaRepo(): jest.Mocked<IFamiliaRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        vincularPessoa: jest.fn(),
        removerPessoa: jest.fn(),
        getPessoas: jest.fn(),
        getHistoricoPessoas: jest.fn(),
        getResponsavelAtivo: jest.fn(),
        vincularMoradia: jest.fn(),
        removerMoradia: jest.fn(),
        getMoradias: jest.fn(),
        getHistoricoMoradias: jest.fn(),
        getFamiliasByMoradia: jest.fn(),
        getHistoricoFamiliasByMoradia: jest.fn(),
        getPets: jest.fn()
    };
}

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

function mockClient() {
    return {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn()
    };
}

describe('MoradiaService - testes unitarios de Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('CT04 -> RN04 - cadastra moradia com coordenadas GPS validas em transacao', async () => {
        const repository = repo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        repository.createLocalizacao.mockResolvedValue(moradia().localizacao);
        repository.create.mockResolvedValue(moradia());
        repository.getById.mockResolvedValue(moradia());
        const service = new MoradiaService(repository);

        await expect(service.cadastrar({
            localizacao: {
                cidade: 'Santo Andre',
                estado: 'SP',
                latitude: -23.6637,
                longitude: -46.5383
            },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            }
        })).resolves.toMatchObject({ id: 1 });

        expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ idLocalizacao: 10 }), client);
        expect(client.query).toHaveBeenCalledWith('COMMIT');
    });

    it('CT04 -> RN04 - falha sem latitude numerica e nao abre transacao', async () => {
        const repository = repo();
        const service = new MoradiaService(repository);

        await expect(service.cadastrar({
            localizacao: {
                cidade: 'Santo Andre',
                estado: 'SP',
                latitude: Number.NaN,
                longitude: -46.5383
            },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            }
        })).rejects.toMatchObject({ statusCode: 400 });

        expect(repository.createLocalizacao).not.toHaveBeenCalled();
    });

    it('lista moradias e falha no historico quando dependencia nao foi configurada', async () => {
        const repository = repo();
        repository.getAll.mockResolvedValue([moradia()]);
        const service = new MoradiaService(repository);

        await expect(service.getAll()).resolves.toHaveLength(1);
        await expect(service.getHistoricoFamilias(1)).rejects.toMatchObject({ statusCode: 500 });
    });

    it('retorna detalhes de moradia e historico com repositorios auxiliares', async () => {
        const repository = repo();
        const familias = familiaRepo();
        const fotos = fotoRepo();
        repository.getById.mockResolvedValue(moradia());
        familias.getFamiliasByMoradia.mockResolvedValue([{ id: 3, deletedAt: null }]);
        familias.getPessoas.mockResolvedValue([]);
        familias.getPets.mockResolvedValue([]);
        fotos.getByMoradia.mockResolvedValue([{ id: 8, idMoradia: 1, idPet: null, url: 'moradias/1/foto.jpg' }]);
        familias.getHistoricoFamiliasByMoradia.mockResolvedValue([]);
        const service = new MoradiaService(repository, familias, fotos);

        await expect(service.getDetalhes(1)).resolves.toMatchObject({
            moradia: { id: 1 },
            familias: [{ familia: { id: 3 }, pessoas: [], pets: [] }],
            fotos: [{ id: 8 }]
        });
        await expect(service.getHistoricoFamilias(1)).resolves.toEqual([]);
    });

    it('retorna 404 para moradia inexistente e 500 sem dependencias de detalhe', async () => {
        const repository = repo();
        repository.getById.mockResolvedValue(null);
        const service = new MoradiaService(repository);

        await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.getDetalhes(1)).rejects.toMatchObject({ statusCode: 500 });
    });

    it('atualiza e remove moradia existente', async () => {
        const repository = repo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        repository.getById.mockResolvedValue(moradia());
        const service = new MoradiaService(repository);

        await expect(service.atualizar(1, {
            localizacao: { cidade: 'Santo Andre' },
            moradia: { pavimentos: 2 }
        })).resolves.toMatchObject({ id: 1 });
        await service.remover(1);

        expect(repository.updateLocalizacao).toHaveBeenCalledWith(10, { cidade: 'Santo Andre' }, client);
        expect(repository.update).toHaveBeenCalledWith(1, { pavimentos: 2 }, client);
        expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('faz rollback quando moradia cadastrada nao retorna na leitura', async () => {
        const repository = repo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        repository.createLocalizacao.mockResolvedValue(moradia().localizacao);
        repository.create.mockResolvedValue(moradia());
        repository.getById.mockResolvedValue(null);
        const service = new MoradiaService(repository);

        await expect(service.cadastrar({
            localizacao: {
                cidade: 'Santo Andre',
                estado: 'SP',
                latitude: -23.6637,
                longitude: -46.5383
            },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            }
        })).rejects.toThrow('Moradia criada');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });
});
