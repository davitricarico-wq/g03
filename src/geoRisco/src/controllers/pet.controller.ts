import type { Request, Response } from 'express';
import type { CreatePetDto, CreatePetSemFamiliaDto, UpdatePetDto } from '../dtos/pet.dto';
import type { IPetService } from '../interfaces/services/pet.service.interface';
import { asBody, handleControllerError, parseId } from './request-utils';

function optionalString(value: unknown): string | null {
    if (value === undefined || value === null) {
        return null;
    }
    const text = String(value).trim();
    return text === '' ? null : text;
}

function optionalStringUpdate(value: unknown): string | undefined {
    return optionalString(value) ?? undefined;
}

function normalizeCreatePetDto(bodyValue: unknown, idFamilia?: number): CreatePetDto {
    const body = asBody(bodyValue);
    return {
        idFamilia: idFamilia ?? parseId(body.idFamilia),
        tipo: String(body.tipo ?? '') as CreatePetDto['tipo'],
        nome: String(body.nome ?? ''),
        porte: String(body.porte ?? ''),
        raca: String(body.raca ?? ''),
        cor: String(body.cor ?? ''),
        status: (optionalString(body.status) ?? 'Ativo') as CreatePetDto['status'],
        observacao: optionalString(body.observacao)
    };
}

function normalizeUpdatePetDto(bodyValue: unknown): UpdatePetDto {
    const body = asBody(bodyValue);
    return {
        tipo: body.tipo === undefined ? undefined : (String(body.tipo) as CreatePetDto['tipo']),
        nome: body.nome === undefined ? undefined : String(body.nome),
        porte: body.porte === undefined ? undefined : String(body.porte),
        raca: body.raca === undefined ? undefined : String(body.raca),
        cor: body.cor === undefined ? undefined : String(body.cor),
        status: body.status === undefined ? undefined : (optionalStringUpdate(body.status) as CreatePetDto['status'] | undefined),
        observacao: body.observacao === undefined ? undefined : optionalString(body.observacao)
    };
}

export class PetController {
    constructor(private service: IPetService) {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getByFamilia = this.getByFamilia.bind(this);
        this.criar = this.criar.bind(this);
        this.criarNaFamilia = this.criarNaFamilia.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.remover = this.remover.bind(this);
    }

    async getAll(_req: Request, res: Response) {
        try {
            const pets = await this.service.getAll();
            res.status(200).json(pets);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pets');
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const pet = await this.service.getById(parseId(req.params.id));
            res.status(200).json(pet);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pet');
        }
    }

    async getByFamilia(req: Request, res: Response) {
        try {
            const pets = await this.service.getByFamilia(parseId(req.params.id));
            res.status(200).json(pets);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pets da família');
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const pet = await this.service.cadastrar(normalizeCreatePetDto(req.body));
            res.status(201).json(pet);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar pet');
        }
    }

    async criarNaFamilia(req: Request, res: Response) {
        try {
            const idFamilia = parseId(req.params.id);
            const data = normalizeCreatePetDto(req.body, idFamilia) as CreatePetSemFamiliaDto & { idFamilia: number };
            const pet = await this.service.cadastrarNaFamilia(idFamilia, data);
            res.status(201).json(pet);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar pet na família');
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const pet = await this.service.atualizar(parseId(req.params.id), normalizeUpdatePetDto(req.body));
            res.status(200).json(pet);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao atualizar pet');
        }
    }

    async remover(req: Request, res: Response) {
        try {
            await this.service.remover(parseId(req.params.id));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover pet');
        }
    }
}
