import type { CreatePessoaDto, CreateResponsavelDto, UpdatePessoaDto, UpdateResponsavelDto } from '../dtos/pessoa.dto';
import { HttpError } from '../errors/http-error';
import {
    ESCOLARIDADES,
    ESTADOS_CIVIS,
    PARENTESCOS,
    RACAS,
    SEXOS,
    SITUACOES_OCUPACIONAIS,
    STATUS_PESSOA
} from '../models/pessoa.model';

function isValidDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
    return typeof value === 'string' && allowed.includes(value as T[number]);
}

export function validatePessoaPayload(data: CreatePessoaDto | UpdatePessoaDto, partial = false) {
    if (!partial || data.nome !== undefined) {
        if (typeof data.nome !== 'string' || data.nome.trim() === '') {
            throw new HttpError(400, 'Nome e obrigatorio');
        }
    }
    if (data.cpf !== undefined && data.cpf !== null) {
        if (typeof data.cpf !== 'string' || !/^\d{11}$/.test(data.cpf)) {
            throw new HttpError(400, 'CPF invalido');
        }
    }
    if (!partial || data.dataDeNascimento !== undefined) {
        if (!isValidDate(data.dataDeNascimento)) {
            throw new HttpError(400, 'Data de nascimento invalida');
        }
    }
    if (!partial || data.parentesco !== undefined) {
        if (!isOneOf(data.parentesco, PARENTESCOS)) {
            throw new HttpError(400, 'Parentesco invalido');
        }
    }
    if (!partial || data.situacaoOcupacional !== undefined) {
        if (!isOneOf(data.situacaoOcupacional, SITUACOES_OCUPACIONAIS)) {
            throw new HttpError(400, 'Situacao ocupacional invalida');
        }
    }
    if (!partial || data.escolaridade !== undefined) {
        if (!isOneOf(data.escolaridade, ESCOLARIDADES)) {
            throw new HttpError(400, 'Escolaridade invalida');
        }
    }
    if (!partial || data.cronico !== undefined) {
        if (typeof data.cronico !== 'boolean') {
            throw new HttpError(400, 'Campo cronico deve ser booleano');
        }
    }
    if (!partial || data.medicacao !== undefined) {
        if (typeof data.medicacao !== 'boolean') {
            throw new HttpError(400, 'Campo medicacao deve ser booleano');
        }
    }
    if (data.status !== undefined && !isOneOf(data.status, STATUS_PESSOA)) {
        throw new HttpError(400, 'Status invalido');
    }
    if (data.sexo !== undefined && data.sexo !== null && !isOneOf(data.sexo, SEXOS)) {
        throw new HttpError(400, 'Sexo invalido');
    }
    if (data.raca !== undefined && data.raca !== null && !isOneOf(data.raca, RACAS)) {
        throw new HttpError(400, 'Raca invalida');
    }
    if (data.estadoCivil !== undefined && data.estadoCivil !== null && !isOneOf(data.estadoCivil, ESTADOS_CIVIS)) {
        throw new HttpError(400, 'Estado civil invalido');
    }
    if (data.veiculo !== undefined && typeof data.veiculo !== 'boolean') {
        throw new HttpError(400, 'Campo veiculo deve ser booleano');
    }
    if (data.programasSociais !== undefined) {
        if (!Number.isInteger(data.programasSociais) || data.programasSociais < 0) {
            throw new HttpError(400, 'Campo programasSociais deve ser um inteiro maior ou igual a zero');
        }
    }
}

export function validateResponsavelPayload(data: CreateResponsavelDto | UpdateResponsavelDto, partial = false) {
    validatePessoaPayload(data, partial);

    if ((!partial || data.parentesco !== undefined) && data.parentesco !== 'Responsável') {
        throw new HttpError(400, 'O responsavel deve ter parentesco Responsavel');
    }

    if (!partial || data.sexo !== undefined) {
        if (!isOneOf(data.sexo, SEXOS)) {
            throw new HttpError(400, 'Sexo invalido');
        }
    }
    if (!partial || data.raca !== undefined) {
        if (!isOneOf(data.raca, RACAS)) {
            throw new HttpError(400, 'Raca invalida');
        }
    }
    if (!partial || data.estadoCivil !== undefined) {
        if (!isOneOf(data.estadoCivil, ESTADOS_CIVIS)) {
            throw new HttpError(400, 'Estado civil invalido');
        }
    }
}
