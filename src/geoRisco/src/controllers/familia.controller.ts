import type { Request, Response } from 'express';
import type { CreateFotoSemMoradiaDto } from '../dtos/foto.dto';
import type { CreateLocalizacaoDto } from '../dtos/localizacao.dto';
import type { CreateMoradiaDto } from '../dtos/moradia.dto';
import type { CreatePetSemFamiliaDto } from '../dtos/pet.dto';
import type { IFamiliaService } from '../interfaces/services/familia.service.interface';
import {
    asBody,
    handleControllerError,
    normalizeCreatePessoaDto,
    normalizeCreateResponsavelDto,
    normalizeLocalizacaoDto,
    normalizeMoradiaDto,
    parseId
} from './request-utils';

function parseOptionalDate(value: unknown): Date | undefined {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function normalizePetSemFamiliaDto(value: unknown): CreatePetSemFamiliaDto {
    const body = asBody(value);
    const status = body.status === undefined || body.status === null || String(body.status).trim() === ''
        ? 'Ativo'
        : String(body.status).trim();
    return {
        tipo: String(body.tipo ?? '') as CreatePetSemFamiliaDto['tipo'],
        nome: body.nome === undefined || body.nome === null || String(body.nome).trim() === '' ? null : String(body.nome).trim(),
        porte: String(body.porte ?? ''),
        raca: String(body.raca ?? ''),
        cor: String(body.cor ?? ''),
        status: status as CreatePetSemFamiliaDto['status'],
        observacao: body.observacao === undefined || body.observacao === null ? null : String(body.observacao),
        fotos: Array.isArray(body.fotos)
            ? body.fotos.map((foto) => normalizeFotoSemMoradiaDto(foto))
            : []
    };
}

function normalizeFotoSemMoradiaDto(value: unknown): CreateFotoSemMoradiaDto {
    const body = asBody(value);
    return {
        url: String(body.url ?? '')
    };
}

export class FamiliaController {
    constructor(private service: IFamiliaService) {
        this.getAll = this.getAll.bind(this);
        this.buscar = this.buscar.bind(this);
        this.getById = this.getById.bind(this);
        this.criar = this.criar.bind(this);
        this.remover = this.remover.bind(this);
        this.getPessoas = this.getPessoas.bind(this);
        this.getHistoricoPessoas = this.getHistoricoPessoas.bind(this);
        this.getMoradias = this.getMoradias.bind(this);
        this.getHistoricoMoradias = this.getHistoricoMoradias.bind(this);
        this.vincularPessoa = this.vincularPessoa.bind(this);
        this.removerPessoa = this.removerPessoa.bind(this);
        this.vincularMoradia = this.vincularMoradia.bind(this);
        this.removerMoradia = this.removerMoradia.bind(this);
        this.cadastrarNucleoFamiliar = this.cadastrarNucleoFamiliar.bind(this);
    }

    async getAll(_req: Request, res: Response) {
        try {
            const familias = await this.service.getAll();
            res.status(200).json(familias);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter famílias');
        }
    }

    async buscar(req: Request, res: Response) {
        try {
            const familias = await this.service.buscar({
                termo: typeof req.query.termo === 'string' ? req.query.termo : undefined,
                bairro: typeof req.query.bairro === 'string' ? req.query.bairro : undefined
            });
            res.status(200).json(familias);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao buscar famílias');
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const familia = await this.service.getById(parseId(req.params.id));
            res.status(200).json(familia);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter família');
        }
    }

    async criar(_req: Request, res: Response) {
        try {
            const familia = await this.service.cadastrar();
            res.status(201).json(familia);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar família');
        }
    }

    async remover(req: Request, res: Response) {
        try {
            await this.service.remover(parseId(req.params.id));
            res.status(204).send();
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover família');
        }
    }

    async getPessoas(req: Request, res: Response) {
        try {
            const pessoas = await this.service.getPessoas(parseId(req.params.id));
            res.status(200).json(pessoas);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter pessoas da família');
        }
    }

    async getHistoricoPessoas(req: Request, res: Response) {
        try {
            const historico = await this.service.getHistoricoPessoas(parseId(req.params.id));
            res.status(200).json(historico);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter historico de pessoas da familia');
        }
    }

    async getMoradias(req: Request, res: Response) {
        try {
            const moradias = await this.service.getMoradias(parseId(req.params.id));
            res.status(200).json(moradias);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter moradias da família');
        }
    }

    async getHistoricoMoradias(req: Request, res: Response) {
        try {
            const historico = await this.service.getHistoricoMoradias(parseId(req.params.id));
            res.status(200).json(historico);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao obter historico de moradias da familia');
        }
    }

    async vincularPessoa(req: Request, res: Response) {
        try {
            const body = asBody(req.body);
            const vinculo = await this.service.vincularPessoa(parseId(req.params.id), {
                idPessoa: parseId(body.idPessoa),
                dataEntrada: parseOptionalDate(body.dataEntrada)
            });
            res.status(201).json(vinculo);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao vincular pessoa à família');
        }
    }

    async removerPessoa(req: Request, res: Response) {
        try {
            const vinculo = await this.service.removerPessoa(parseId(req.params.id), parseId(req.params.pessoaId));
            res.status(200).json(vinculo);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover pessoa da família');
        }
    }

    async vincularMoradia(req: Request, res: Response) {
        try {
            const body = asBody(req.body);
            const vinculo = await this.service.vincularMoradia(parseId(req.params.id), {
                idMoradia: parseId(body.idMoradia),
                dataEntrada: parseOptionalDate(body.dataEntrada),
                status: typeof body.status === 'string' ? body.status : null
            });
            res.status(201).json(vinculo);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao vincular moradia à família');
        }
    }

    async removerMoradia(req: Request, res: Response) {
        try {
            const vinculo = await this.service.removerMoradia(parseId(req.params.id), parseId(req.params.moradiaId));
            res.status(200).json(vinculo);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao remover moradia da família');
        }
    }

    async cadastrarNucleoFamiliar(req: Request, res: Response) {
        try {
            const body = asBody(req.body);
            const dependentes = Array.isArray(body.dependentes)
                ? body.dependentes.map((dependente) => normalizeCreatePessoaDto(dependente))
                : [];
            const pets = Array.isArray(body.pets)
                ? body.pets.map((pet) => normalizePetSemFamiliaDto(pet))
                : [];
            const fotos = Array.isArray(body.fotos)
                ? body.fotos.map((foto) => normalizeFotoSemMoradiaDto(foto))
                : [];
            const temLocalizacao = body.localizacao !== undefined && body.localizacao !== null;
            const temMoradia = body.moradia !== undefined && body.moradia !== null;

            const nucleo = await this.service.cadastrarNucleoFamiliar({
                localizacao: temLocalizacao ? normalizeLocalizacaoDto(body.localizacao) as CreateLocalizacaoDto : undefined,
                moradia: temMoradia ? normalizeMoradiaDto(body.moradia) as CreateMoradiaDto : undefined,
                responsavel: normalizeCreateResponsavelDto(body.responsavel),
                dependentes,
                pets,
                fotos,
                dataEntrada: parseOptionalDate(body.dataEntrada),
                statusMoradiaFamilia: typeof body.statusMoradiaFamilia === 'string' ? body.statusMoradiaFamilia : null
            });
            res.status(201).json(nucleo);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao cadastrar núcleo familiar');
        }
    }
}
