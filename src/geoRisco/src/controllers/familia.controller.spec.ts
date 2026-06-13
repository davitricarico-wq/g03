import type { Request, Response } from 'express';
import { FamiliaController } from './familia.controller';
import type { FamiliaBuscaResultadoDto } from '../dtos/familia.dto';
import type { FamiliaService } from '../services/familia.service';

describe('FamiliaController', () => {
    const makeService = (): jest.Mocked<FamiliaService> => {
        return {
            getAll: jest.fn(),
            buscar: jest.fn(),
            getById: jest.fn(),
            cadastrar: jest.fn(),
            remover: jest.fn(),
            getPessoas: jest.fn(),
            getHistoricoPessoas: jest.fn(),
            getMoradias: jest.fn(),
            getHistoricoMoradias: jest.fn(),
            vincularPessoa: jest.fn(),
            removerPessoa: jest.fn(),
            vincularMoradia: jest.fn(),
            removerMoradia: jest.fn(),
            cadastrarNucleoFamiliar: jest.fn()
        } as unknown as jest.Mocked<FamiliaService>;
    };

    const makeRes = (): Response => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;
    };

    const makeReq = (query: Record<string, unknown> = {}): Request => {
        return { query, params: {}, body: {} } as unknown as Request;
    };

    const resultado: FamiliaBuscaResultadoDto = {
        id: 1,
        responsavel: { id: 10, nome: 'Ana', cpf: '12345678901' },
        bairro: 'Centro',
        totalPessoas: 3,
        totalPets: 1,
        prioridadeTipos: ['crianca', 'doenca_cronica'],
        prioridadeCondicoes: ['Criança', 'Doença crônica'],
        grupos: { idoso: false, crianca: true, gestante: false, doencaCronica: true }
    };

    it('200 com lista de famílias e filtros repassados', async () => {
        const service = makeService();
        service.buscar.mockResolvedValueOnce([resultado]);
        const controller = new FamiliaController(service);
        const res = makeRes();

        await controller.buscar(makeReq({ termo: 'Ana', bairro: 'Centro' }), res);

        expect(service.buscar).toHaveBeenCalledWith({ termo: 'Ana', bairro: 'Centro' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([resultado]);
    });

    it('200 sem filtros quando query vazia', async () => {
        const service = makeService();
        service.buscar.mockResolvedValueOnce([]);
        const controller = new FamiliaController(service);
        const res = makeRes();

        await controller.buscar(makeReq(), res);

        expect(service.buscar).toHaveBeenCalledWith({ termo: undefined, bairro: undefined });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('500 quando o serviço falha ao buscar', async () => {
        const service = makeService();
        service.buscar.mockRejectedValueOnce(new Error('Falha inesperada'));
        const controller = new FamiliaController(service);
        const res = makeRes();

        await controller.buscar(makeReq({ termo: 'Ana' }), res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar famílias' });
    });
});
