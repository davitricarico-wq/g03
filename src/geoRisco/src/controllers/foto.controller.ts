import type { Request, Response } from 'express';
import type { CreateFotoSemMoradiaDto, CreateFotoSemPetDto, UpdateFotoDto } from '../dtos/foto.dto';
import type { IFotoService } from '../interfaces/services/foto.service.interface';
import { asBody, handleControllerError, parseId } from './request-utils';

function normalizeCreateFotoDto(bodyValue: unknown): CreateFotoSemMoradiaDto {
    const body = asBody(bodyValue);
    return {
        url: String(body.url ?? '')
    };
}

function normalizeUpdateFotoDto(bodyValue: unknown): UpdateFotoDto {
    const body = asBody(bodyValue);
    return {
        url: body.url === undefined ? undefined : String(body.url)
    };
}

export class FotoController {
    constructor(private service: IFotoService) {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getByMoradia = this.getByMoradia.bind(this);
        this.getByPet = this.getByPet.bind(this);
        this.criarNaMoradia = this.criarNaMoradia.bind(this);
        this.criarNoPet = this.criarNoPet.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.remover = this.remover.bind(this);
        this.removerDaMoradia = this.removerDaMoradia.bind(this);
        this.removerDoPet = this.removerDoPet.bind(this);
    }

    async getAll(_req: Request, res: Response) {
        try {
            const fotos = await this.service.getAll();
            res.status(200).json(fotos);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter fotos');
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const foto = await this.service.getById(parseId(req.params.id));
            res.status(200).json(foto);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter foto');
        }
    }

    async getByMoradia(req: Request, res: Response) {
        try {
            const fotos = await this.service.getByMoradia(parseId(req.params.id));
            res.status(200).json(fotos);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter fotos da moradia');
        }
    }

    async getByPet(req: Request, res: Response) {
        try {
            const fotos = await this.service.getByPet(parseId(req.params.id));
            res.status(200).json(fotos);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter fotos do pet');
        }
    }

    async criarNaMoradia(req: Request, res: Response) {
        try {
            const idMoradia = parseId(req.params.id);
            const data = normalizeCreateFotoDto(req.body);
            const foto = await this.service.cadastrarNaMoradia(idMoradia, data);
            res.status(201).json(foto);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar foto na moradia');
        }
    }

    async criarNoPet(req: Request, res: Response) {
        try {
            const idPet = parseId(req.params.id);
            const data = normalizeCreateFotoDto(req.body) as CreateFotoSemPetDto;
            const foto = await this.service.cadastrarNoPet(idPet, data);
            res.status(201).json(foto);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar foto no pet');
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const foto = await this.service.atualizar(parseId(req.params.id), normalizeUpdateFotoDto(req.body));
            res.status(200).json(foto);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao atualizar foto');
        }
    }

    async remover(req: Request, res: Response) {
        try {
            await this.service.remover(parseId(req.params.id));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover foto');
        }
    }

    async removerDaMoradia(req: Request, res: Response) {
        try {
            await this.service.removerDaMoradia(parseId(req.params.id), parseId(req.params.fotoId));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover foto da moradia');
        }
    }

    async removerDoPet(req: Request, res: Response) {
        try {
            await this.service.removerDoPet(parseId(req.params.id), parseId(req.params.fotoId));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover foto do pet');
        }
    }
}
