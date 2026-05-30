import type { Request, Response } from 'express';
import type { IPessoaService } from '../interfaces/services/pessoa.service.interface';
import {
    handleControllerError,
    normalizeCreatePessoaDto,
    normalizeCreateResponsavelDto,
    normalizeUpdatePessoaDto,
    normalizeUpdateResponsavelDto,
    parseId
} from './request-utils';

export class PessoaController {
    constructor(private service: IPessoaService) {
        this.getAll = this.getAll.bind(this);
        this.getAllJson = this.getAllJson.bind(this);
        this.getById = this.getById.bind(this);
        this.getInativas = this.getInativas.bind(this);
        this.buscar = this.buscar.bind(this);
        this.novoForm = this.novoForm.bind(this);
        this.criar = this.criar.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.remover = this.remover.bind(this);
        this.getAllResponsaveis = this.getAllResponsaveis.bind(this);
        this.getResponsavelById = this.getResponsavelById.bind(this);
        this.criarResponsavel = this.criarResponsavel.bind(this);
        this.atualizarResponsavel = this.atualizarResponsavel.bind(this);
        this.removerResponsavel = this.removerResponsavel.bind(this);
    }

    async getAll(_req: Request, res: Response) {
        try {
            const pessoas = await this.service.getAll();
            res.status(200).render('pessoa-lista', { pessoas });
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pessoas');
        }
    }

    async getAllJson(_req: Request, res: Response) {
        try {
            const pessoas = await this.service.getAll();
            res.status(200).json(pessoas);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pessoas');
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const pessoa = await this.service.getById(parseId(req.params.id));
            res.status(200).json(pessoa);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pessoa');
        }
    }

    async getInativas(_req: Request, res: Response) {
        try {
            const pessoas = await this.service.getInativas();
            res.status(200).json(pessoas);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pessoas inativas');
        }
    }

    async buscar(req: Request, res: Response) {
        try {
            const pessoas = await this.service.buscar({
                nome: typeof req.query.nome === 'string' ? req.query.nome : undefined,
                cpf: typeof req.query.cpf === 'string' ? req.query.cpf : undefined,
                email: typeof req.query.email === 'string' ? req.query.email : undefined,
                telefone: typeof req.query.telefone === 'string' ? req.query.telefone : undefined,
                escopo: typeof req.query.escopo === 'string' ? req.query.escopo as 'ativas' | 'inativas' | 'todas' : undefined
            });
            res.status(200).json(pessoas);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao buscar pessoas');
        }
    }

    async novoForm(_req: Request, res: Response) {
        res.status(200).render('pessoa-novo');
    }

    async criar(req: Request, res: Response) {
        try {
            const created = await this.service.cadastrar(normalizeCreatePessoaDto(req.body));
            res.status(201).json(created);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar pessoa');
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const updated = await this.service.atualizar(parseId(req.params.id), normalizeUpdatePessoaDto(req.body));
            res.status(200).json(updated);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao atualizar pessoa');
        }
    }

    async remover(req: Request, res: Response) {
        try {
            await this.service.remover(parseId(req.params.id));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover pessoa');
        }
    }

    async getAllResponsaveis(_req: Request, res: Response) {
        try {
            const responsaveis = await this.service.getAllResponsaveis();
            res.status(200).json(responsaveis);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter responsáveis');
        }
    }

    async getResponsavelById(req: Request, res: Response) {
        try {
            const responsavel = await this.service.getResponsavelByPessoaId(parseId(req.params.id));
            res.status(200).json(responsavel);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter responsável');
        }
    }

    async criarResponsavel(req: Request, res: Response) {
        try {
            const created = await this.service.cadastrarResponsavel(normalizeCreateResponsavelDto(req.body));
            res.status(201).json(created);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar responsável');
        }
    }

    async atualizarResponsavel(req: Request, res: Response) {
        try {
            const updated = await this.service.atualizarResponsavel(parseId(req.params.id), normalizeUpdateResponsavelDto(req.body));
            res.status(200).json(updated);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao atualizar responsável');
        }
    }

    async removerResponsavel(req: Request, res: Response) {
        try {
            await this.service.removerResponsavel(parseId(req.params.id));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover responsável');
        }
    }
}
