import type { CreatePetDto, CreatePetSemFamiliaDto, UpdatePetDto } from '../dtos/pet.dto';
import { HttpError } from '../errors/http-error';
import { STATUS_PET, TIPOS_PET } from '../models/pet.model';
import { validateFotoUrl } from './foto.validation';

function requiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new HttpError(400, `${field} e obrigatorio`);
    }
    return value.trim();
}

function optionalString(value: unknown): string | null {
    if (value === undefined || value === null) {
        return null;
    }
    const text = String(value).trim();
    return text === '' ? null : text;
}

function ensureValidStatus(value: unknown) {
    if (typeof value !== 'string' || !STATUS_PET.includes(value as (typeof STATUS_PET)[number])) {
        throw new HttpError(400, 'Status do pet invalido');
    }
    return value as (typeof STATUS_PET)[number];
}

function ensureValidTipo(value: unknown) {
    if (typeof value !== 'string' || !TIPOS_PET.includes(value as (typeof TIPOS_PET)[number])) {
        throw new HttpError(400, 'Tipo do pet invalido');
    }
    return value as (typeof TIPOS_PET)[number];
}

function optionalFotos(value: unknown) {
    if (value === undefined || value === null) {
        return [];
    }
    if (!Array.isArray(value)) {
        throw new HttpError(400, 'Fotos do pet devem ser uma lista');
    }
    return value.map((foto) => ({ url: validateFotoUrl(foto?.url) }));
}

export function validateCreatePet(data: CreatePetDto | CreatePetSemFamiliaDto): CreatePetSemFamiliaDto {
    return {
        tipo: ensureValidTipo(data.tipo),
        nome: optionalString(data.nome),
        porte: requiredString(data.porte, 'Porte'),
        raca: requiredString(data.raca, 'Raca'),
        cor: requiredString(data.cor, 'Cor'),
        status: ensureValidStatus(data.status),
        observacao: optionalString(data.observacao),
        fotos: optionalFotos(data.fotos)
    };
}

export function validateUpdatePet(data: UpdatePetDto): UpdatePetDto {
    return {
        tipo: data.tipo === undefined ? undefined : ensureValidTipo(data.tipo),
        nome: data.nome === undefined ? undefined : optionalString(data.nome),
        porte: data.porte === undefined ? undefined : requiredString(data.porte, 'Porte'),
        raca: data.raca === undefined ? undefined : requiredString(data.raca, 'Raca'),
        cor: data.cor === undefined ? undefined : requiredString(data.cor, 'Cor'),
        status: data.status === undefined ? undefined : ensureValidStatus(data.status),
        observacao: data.observacao === undefined ? undefined : optionalString(data.observacao)
    };
}
