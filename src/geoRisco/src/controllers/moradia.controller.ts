import type { Request, Response } from 'express';
import type { IMoradiaService } from '../interfaces/services/moradia.service.interface';
import {
    asBody,
    handleControllerError,
    normalizeLocalizacaoDto,
    normalizeMoradiaDto,
    parseId
} from './request-utils';
import type { CreateLocalizacaoDto, UpdateLocalizacaoDto } from '../dtos/localizacao.dto';
import type { CreateMoradiaDto, UpdateMoradiaDto } from '../dtos/moradia.dto';

export class MoradiaController {
    constructor(private service: IMoradiaService) {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getDetalhes = this.getDetalhes.bind(this);
        this.getHistoricoFamilias = this.getHistoricoFamilias.bind(this);
        this.criar = this.criar.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.remover = this.remover.bind(this);
    }

    async getAll(_req: Request, res: Response) {
        try {
            const moradias = await this.service.getAll();
            res.status(200).json(moradias);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter moradias');
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const moradia = await this.service.getById(parseId(req.params.id));
            res.status(200).json(moradia);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter moradia');
        }
    }

    async getDetalhes(req: Request, res: Response) {
        try {
            const detalhes = await this.service.getDetalhes(parseId(req.params.id));
            res.status(200).json(detalhes);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter detalhes da moradia');
        }
    }

    async getHistoricoFamilias(req: Request, res: Response) {
        try {
            const historico = await this.service.getHistoricoFamilias(parseId(req.params.id));
            res.status(200).json(historico);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter historico de familias da moradia');
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const body = asBody(req.body);
            const created = await this.service.cadastrar({
                localizacao: normalizeLocalizacaoDto(body.localizacao) as CreateLocalizacaoDto,
                moradia: normalizeMoradiaDto(body.moradia) as CreateMoradiaDto
            });
            res.status(201).json(created);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar moradia');
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const body = asBody(req.body);
            const updated = await this.service.atualizar(parseId(req.params.id), {
                localizacao: body.localizacao ? (normalizeLocalizacaoDto(body.localizacao, true) as UpdateLocalizacaoDto) : undefined,
                moradia: body.moradia ? (normalizeMoradiaDto(body.moradia, true) as UpdateMoradiaDto) : undefined
            });
            res.status(200).json(updated);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao atualizar moradia');
        }
    }

    async remover(req: Request, res: Response) {
        try {
            await this.service.remover(parseId(req.params.id));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover moradia');
        }
    }
}
