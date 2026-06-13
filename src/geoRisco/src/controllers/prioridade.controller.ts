import type { Request, Response } from 'express';
import { handleControllerError } from './request-utils';
import type { PrioridadeRepository } from '../repositories/prioridade.repository';
import { parseId } from './request-utils';

export class PrioridadeController {
    constructor(private repo: PrioridadeRepository) {
        this.getAll = this.getAll.bind(this);
        this.getByPessoa = this.getByPessoa.bind(this);
        this.setForPessoa = this.setForPessoa.bind(this);
    }

    async getAll(_req: Request, res: Response) {
        try {
            const prioridades = await this.repo.getAll();
            res.status(200).json(prioridades);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter prioridades');
        }
    }

    async getByPessoa(req: Request, res: Response) {
        try {
            const prioridades = await this.repo.getByPessoa(parseId(req.params.id));
            res.status(200).json(prioridades);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter prioridades da pessoa');
        }
    }

    async setForPessoa(req: Request, res: Response) {
        try {
            const ids = Array.isArray(req.body?.prioridadeIds)
                ? req.body.prioridadeIds.map((id: unknown) => Number(id))
                : [];
            const prioridades = await this.repo.setForPessoa(parseId(req.params.id), ids);
            res.status(200).json(prioridades);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao atualizar prioridades da pessoa');
        }
    }
}
