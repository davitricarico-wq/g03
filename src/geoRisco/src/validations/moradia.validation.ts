import type { CreateLocalizacaoDto, UpdateLocalizacaoDto } from '../dtos/localizacao.dto';
import type { CreateMoradiaDto, UpdateMoradiaDto } from '../dtos/moradia.dto';
import { HttpError } from '../errors/http-error';
import {
    SITUACOES_OCUPACAO_MORADIA,
    STATUS_MORADIA,
    TIPOS_CONSTRUCAO,
    USOS_IMOVEL
} from '../models/moradia.model';

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
    return typeof value === 'string' && allowed.includes(value as T[number]);
}

export function validateLocalizacaoPayload(data: CreateLocalizacaoDto | UpdateLocalizacaoDto, partial = false) {
    if (!partial || data.cidade !== undefined) {
        if (typeof data.cidade !== 'string' || data.cidade.trim() === '') {
            throw new HttpError(400, 'Cidade e obrigatoria');
        }
    }
    if (!partial || data.estado !== undefined) {
        if (typeof data.estado !== 'string' || data.estado.trim().length !== 2) {
            throw new HttpError(400, 'Estado deve conter 2 caracteres');
        }
    }
    if (!partial || data.latitude !== undefined) {
        if (typeof data.latitude !== 'number' || Number.isNaN(data.latitude)) {
            throw new HttpError(400, 'Latitude invalida');
        }
    }
    if (!partial || data.longitude !== undefined) {
        if (typeof data.longitude !== 'number' || Number.isNaN(data.longitude)) {
            throw new HttpError(400, 'Longitude invalida');
        }
    }
}

export function validateMoradiaPayload(data: CreateMoradiaDto | UpdateMoradiaDto, partial = false) {
    if (!partial || data.tipoConstrucao !== undefined) {
        if (!isOneOf(data.tipoConstrucao, TIPOS_CONSTRUCAO)) {
            throw new HttpError(400, 'Tipo de construcao invalido');
        }
    }
    if (data.status !== undefined && !isOneOf(data.status, STATUS_MORADIA)) {
        throw new HttpError(400, 'Status de moradia invalido');
    }
    if (!partial || data.usoImovel !== undefined) {
        if (!isOneOf(data.usoImovel, USOS_IMOVEL)) {
            throw new HttpError(400, 'Uso do imovel invalido');
        }
    }
    if (data.pavimentos !== undefined && (!Number.isInteger(data.pavimentos) || data.pavimentos <= 0)) {
        throw new HttpError(400, 'Pavimentos deve ser um inteiro positivo');
    }
    if (!partial || data.situacaoDeOcupacao !== undefined) {
        if (!isOneOf(data.situacaoDeOcupacao, SITUACOES_OCUPACAO_MORADIA)) {
            throw new HttpError(400, 'Situacao de ocupacao invalida');
        }
    }
}
