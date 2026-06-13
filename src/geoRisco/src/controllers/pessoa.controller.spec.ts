import type { Request, Response } from 'express';
import { PessoaController } from './pessoa.controller';
import type { Pessoa } from '../models/pessoa.model';
import type { PessoaService } from '../services/pessoa.service';

describe('PessoaController', () => {
    const makeService = (): jest.Mocked<PessoaService> => {
        return {
            cadastrar: jest.fn(),
            atualizar: jest.fn(),
            remover: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
            getAllResponsaveis: jest.fn(),
            getResponsavelByPessoaId: jest.fn(),
            cadastrarResponsavel: jest.fn(),
            atualizarResponsavel: jest.fn(),
            removerResponsavel: jest.fn()
        } as unknown as jest.Mocked<PessoaService>;
    };

    const makeRes = (): Response => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as Response;
    };

    const makeReqJson = (body: unknown = {}, params: Record<string, string> = {}): Request => {
        return { body, params } as unknown as Request;
    };

    const dataNascimentoAna = new Date('1985-03-20');
    const dataNascimentoJoao = new Date('1980-07-15');

    const pessoaAna: Pessoa = {
        id: 1,
        nome: 'Ana',
        nomeSocial: null,
        cpf: null,
        parentesco: 'Responsável',
        medicacao: false,
        status: 'Ativo',
        escolaridade: 'Médio Completo',
        cronico: false,
        situacaoOcupacional: 'Empregado',
        dataDeNascimento: dataNascimentoAna,
        deletedAt: null
    };

    it('201 com pessoa criada', async () => {
        const service = makeService();
        service.cadastrar.mockResolvedValueOnce(pessoaAna);
        const controller = new PessoaController(service);
        const req = makeReqJson({
            nome: 'Ana',
            nomeSocial: '',
            parentesco: 'Responsável',
            medicacao: false,
            status: 'Ativo',
            escolaridade: 'Médio Completo',
            cronico: false,
            situacaoOcupacional: 'Empregado',
            dataDeNascimento: '1985-03-20'
        });
        const res = makeRes();

        await controller.criar(req, res);

        expect(service.cadastrar).toHaveBeenCalledWith({
            nome: 'Ana',
            nomeSocial: null,
            cpf: null,
            parentesco: 'Responsável',
            medicacao: false,
            status: 'Ativo',
            escolaridade: 'Médio Completo',
            cronico: false,
            situacaoOcupacional: 'Empregado',
            dataDeNascimento: dataNascimentoAna
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(pessoaAna);
    });

    it('400 quando RN01 é violada', async () => {
        const service = makeService();
        const controller = new PessoaController(service);
        const req = makeReqJson({
            nome: '',
            parentesco: 'Responsável',
            medicacao: false,
            status: 'Ativo',
            escolaridade: 'Médio Completo',
            cronico: false,
            situacaoOcupacional: 'Empregado'
        });
        const res = makeRes();

        await controller.criar(req, res);

        expect(service.cadastrar).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Nome é obrigatório' });
    });

    it('200 com lista de pessoas em JSON', async () => {
        const service = makeService();
        const pessoas: Pessoa[] = [
            pessoaAna,
            {
                id: 2,
                nome: 'Joao',
                nomeSocial: 'Joao',
                cpf: null,
                parentesco: 'Cônjuge',
                medicacao: true,
                status: 'Ativo',
                escolaridade: 'Superior Completo',
                cronico: true,
                situacaoOcupacional: 'Desempregado',
                dataDeNascimento: dataNascimentoJoao,
                deletedAt: null
            }
        ];
        service.getAll.mockResolvedValueOnce(pessoas);
        const controller = new PessoaController(service);
        const res = makeRes();

        await controller.getAll(makeReqJson(), res);

        expect(service.getAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(pessoas);
    });

    it('200 com lista de pessoas em JSON', async () => {
        const service = makeService();
        service.getAll.mockResolvedValueOnce([pessoaAna]);
        const controller = new PessoaController(service);
        const res = makeRes();

        await controller.getAllJson(makeReqJson(), res);

        expect(service.getAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([pessoaAna]);
    });

    it('500 quando o serviço falha ao criar pessoa', async () => {
        const service = makeService();
        service.cadastrar.mockRejectedValueOnce(new Error('Falha inesperada'));
        const controller = new PessoaController(service);
        const req = makeReqJson({
            nome: 'Ana',
            parentesco: 'Responsável',
            medicacao: false,
            status: 'Ativo',
            escolaridade: 'Médio Completo',
            cronico: false,
            situacaoOcupacional: 'Empregado',
            dataDeNascimento: '1985-03-20'
        });
        const res = makeRes();

        await controller.criar(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao cadastrar pessoa' });
    });

    it('204 ao remover pessoa', async () => {
        const service = makeService();
        service.remover.mockResolvedValueOnce(undefined);
        const controller = new PessoaController(service);
        const res = makeRes();

        await controller.remover(makeReqJson({}, { id: '1' }), res);

        expect(service.remover).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});
