import type { CreateNucleoFamiliarDto, VincularMoradiaFamiliaDto, VincularPessoaFamiliaDto } from '../dtos/familia.dto';
import { HttpError } from '../errors/http-error';
import { validateFotoUrl } from './foto.validation';
import { validateLocalizacaoPayload, validateMoradiaPayload } from './moradia.validation';
import { validatePessoaPayload, validateResponsavelPayload } from './pessoa.validation';
import { validateCreatePet } from './pet.validation';

function validatePositiveId(value: unknown, field: string) {
    if (!Number.isInteger(value) || Number(value) <= 0) {
        throw new HttpError(400, `${field} invalido`);
    }
}

function validateOptionalDate(value: unknown, field: string) {
    if (value === undefined || value === null) {
        return;
    }
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new HttpError(400, `${field} invalida`);
    }
}

function isParentescoResponsavel(value: unknown): boolean {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase() === 'RESPONSAVEL';
}

export function validateVincularPessoaFamiliaPayload(data: VincularPessoaFamiliaDto) {
    validatePositiveId(data.idPessoa, 'Pessoa');
    validateOptionalDate(data.dataEntrada, 'Data de entrada');
}

export function validateVincularMoradiaFamiliaPayload(data: VincularMoradiaFamiliaDto) {
    validatePositiveId(data.idMoradia, 'Moradia');
    validateOptionalDate(data.dataEntrada, 'Data de entrada');
}

export function validateNucleoFamiliarPayload(data: CreateNucleoFamiliarDto) {
    if (!data.localizacao || !data.moradia || !data.responsavel) {
        throw new HttpError(400, 'Localizacao, moradia e responsavel sao obrigatorios');
    }

    validateLocalizacaoPayload(data.localizacao);
    validateMoradiaPayload(data.moradia);
    validateResponsavelPayload(data.responsavel);

    if (!isParentescoResponsavel(data.responsavel.parentesco)) {
        throw new HttpError(400, 'O responsavel deve ter parentesco Responsavel');
    }

    validateOptionalDate(data.dataEntrada, 'Data de entrada');

    for (const dependente of data.dependentes ?? []) {
        validatePessoaPayload(dependente);
        if (isParentescoResponsavel(dependente.parentesco)) {
            throw new HttpError(400, 'Dependente nao pode ter parentesco Responsavel');
        }
    }

    for (const pet of data.pets ?? []) {
        validateCreatePet(pet);
    }

    for (const foto of data.fotos ?? []) {
        validateFotoUrl(foto.url);
    }
}
