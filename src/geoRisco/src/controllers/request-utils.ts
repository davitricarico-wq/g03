import type { Response } from 'express';
import type { CreateLocalizacaoDto, UpdateLocalizacaoDto } from '../dtos/localizacao.dto';
import type { CreateMoradiaDto, UpdateMoradiaDto } from '../dtos/moradia.dto';
import type { CreatePessoaDto, CreateResponsavelDto, UpdatePessoaDto, UpdateResponsavelDto } from '../dtos/pessoa.dto';
import { HttpError } from '../errors/http-error';
import type {
    Escolaridade,
    EstadoCivil,
    Parentesco,
    Raca,
    Sexo,
    SituacaoOcupacional,
    StatusPessoa
} from '../models/pessoa.model';
import type {
    SituacaoOcupacaoMoradia,
    StatusMoradia,
    TipoConstrucao,
    UsoImovel
} from '../models/moradia.model';

type Body = Record<string, unknown>;

export function handleControllerError(res: Response, err: unknown, fallbackMessage: string) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    const databaseError = getDatabaseConnectionError(err);
    if (databaseError) {
        console.error(fallbackMessage, err);
        return res.status(503).json({ error: databaseError });
    }
    console.error(fallbackMessage, err);
    return res.status(500).json({ error: fallbackMessage });
}

function getDatabaseConnectionError(err: unknown): string | null {
    if (!err || typeof err !== 'object') {
        return null;
    }

    const code = 'code' in err ? String((err as { code?: unknown }).code) : '';
    const hostname = 'hostname' in err ? String((err as { hostname?: unknown }).hostname) : '';

    if (code === 'ENOTFOUND') {
        return hostname
            ? `Não foi possível resolver o host do banco (${hostname}). Verifique se o DATABASE_URL aponta para um projeto Supabase ativo ou para o banco local.`
            : 'Não foi possível resolver o host do banco. Verifique o DATABASE_URL.';
    }

    if (['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENETUNREACH'].includes(code)) {
        return 'Não foi possível conectar ao banco de dados. Verifique se o DATABASE_URL está correto e se o banco está acessível.';
    }

    if (code === '28P01') {
        return 'Falha de autenticação no banco de dados. Verifique usuário e senha do DATABASE_URL.';
    }

    if (code === '3D000') {
        return 'Banco de dados informado no DATABASE_URL não existe.';
    }

    return null;
}

export function parseId(value: unknown): number {
    const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(400, 'ID inválido');
    }
    return parsed;
}

export function asBody(value: unknown): Body {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new HttpError(400, 'Payload inválido');
    }
    return value as Body;
}

function get(body: Body, ...keys: string[]): unknown {
    for (const key of keys) {
        if (body[key] !== undefined) {
            return body[key];
        }
    }
    return undefined;
}

function optionalString(value: unknown): string | null {
    if (value === undefined || value === null) {
        return null;
    }
    const text = String(value).trim();
    return text === '' ? null : text;
}

function optionalStringField(body: Body, ...keys: string[]): string | undefined {
    const value = get(body, ...keys);
    if (value === undefined || value === null) {
        return undefined;
    }
    return optionalString(value) ?? undefined;
}

function optionalCpf(value: unknown): string | null {
    const text = optionalString(value);
    if (text === null) {
        return null;
    }
    return text.replace(/\D/g, '');
}

function requiredString(value: unknown, field: string): string {
    const text = optionalString(value);
    if (!text) {
        throw new HttpError(400, `${field} é obrigatório`);
    }
    return text;
}

function optionalDate(value: unknown): Date | null {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        throw new HttpError(400, 'Data inválida');
    }
    return date;
}

function requiredDate(value: unknown): Date {
    const date = optionalDate(value);
    if (!date) {
        throw new HttpError(400, 'Data é obrigatória');
    }
    return date;
}

function optionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        return ['true', '1', 'on', 'sim'].includes(value.toLowerCase());
    }
    return Boolean(value);
}

function requiredBoolean(value: unknown, field: string): boolean {
    const parsed = optionalBoolean(value);
    if (parsed === undefined) {
        throw new HttpError(400, `${field} é obrigatório`);
    }
    return parsed;
}

function optionalNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(parsed)) {
        throw new HttpError(400, 'Número inválido');
    }
    return parsed;
}

function requiredNumber(value: unknown, field: string): number {
    const parsed = optionalNumber(value);
    if (parsed === undefined) {
        throw new HttpError(400, `${field} é obrigatório`);
    }
    return parsed;
}

export function normalizeCreatePessoaDto(bodyValue: unknown, defaultParentesco?: Parentesco): CreatePessoaDto {
    const body = asBody(bodyValue);
    const renda = get(body, 'renda');
    const programasSociais = get(body, 'programasSociais', 'programas_sociais', 'programaSocial', 'programa_social');
    const dataResidenciaMoradia = get(body, 'dataResidenciaMoradia', 'data_residencia_moradia');
    return {
        nome: requiredString(get(body, 'nome'), 'Nome'),
        nomeSocial: optionalString(get(body, 'apelido', 'nomeSocial', 'nome_social')),
        cpf: optionalCpf(get(body, 'cpf')),
        dataDeNascimento: requiredDate(get(body, 'dataDeNascimento', 'data_de_nascimento')),
        parentesco: (optionalString(get(body, 'parentesco')) ?? defaultParentesco) as Parentesco,
        situacaoOcupacional: requiredString(get(body, 'situacaoOcupacional', 'situacao_ocupacional'), 'Situação ocupacional') as SituacaoOcupacional,
        escolaridade: requiredString(get(body, 'escolaridade'), 'Escolaridade') as Escolaridade,
        cronico: requiredBoolean(get(body, 'cronico'), 'Cronico'),
        medicacao: requiredBoolean(get(body, 'medicacao'), 'Medicacao'),
        ...(get(body, 'nis') === undefined ? {} : { nis: optionalString(get(body, 'nis')) }),
        ...(renda === undefined ? {} : { renda: optionalNumber(renda) ?? null }),
        ...(get(body, 'sexo') === undefined ? {} : { sexo: optionalString(get(body, 'sexo')) as Sexo | null }),
        ...(get(body, 'raca') === undefined ? {} : { raca: optionalString(get(body, 'raca')) as Raca | null }),
        ...(get(body, 'estadoCivil', 'estado_civil') === undefined ? {} : { estadoCivil: optionalString(get(body, 'estadoCivil', 'estado_civil')) as EstadoCivil | null }),
        ...(get(body, 'veiculo') === undefined ? {} : { veiculo: optionalBoolean(get(body, 'veiculo')) ?? false }),
        ...(programasSociais === undefined ? {} : { programasSociais: optionalNumber(programasSociais) ?? 0 }),
        ...(get(body, 'email') === undefined ? {} : { email: optionalString(get(body, 'email')) }),
        ...(get(body, 'telefone') === undefined ? {} : { telefone: optionalString(get(body, 'telefone')) }),
        ...(get(body, 'nomeDaMae', 'nome_da_mae') === undefined ? {} : { nomeDaMae: optionalString(get(body, 'nomeDaMae', 'nome_da_mae')) }),
        ...(dataResidenciaMoradia === undefined ? {} : { dataResidenciaMoradia: optionalDate(dataResidenciaMoradia) }),
        status: (optionalString(get(body, 'status')) ?? 'Ativo') as StatusPessoa
    };
}

export function normalizeUpdatePessoaDto(bodyValue: unknown): UpdatePessoaDto {
    const body = asBody(bodyValue);
    const apelidoValue = get(body, 'apelido', 'nomeSocial', 'nome_social');
    return {
        nome: optionalString(get(body, 'nome')) ?? undefined,
        nomeSocial: apelidoValue === undefined ? undefined : optionalString(apelidoValue),
        cpf: get(body, 'cpf') === undefined ? undefined : optionalCpf(get(body, 'cpf')),
        dataDeNascimento: get(body, 'dataDeNascimento', 'data_de_nascimento') === undefined ? undefined : requiredDate(get(body, 'dataDeNascimento', 'data_de_nascimento')),
        parentesco: optionalStringField(body, 'parentesco') as Parentesco | undefined,
        situacaoOcupacional: optionalStringField(body, 'situacaoOcupacional', 'situacao_ocupacional') as SituacaoOcupacional | undefined,
        escolaridade: optionalStringField(body, 'escolaridade') as Escolaridade | undefined,
        cronico: optionalBoolean(get(body, 'cronico')),
        medicacao: optionalBoolean(get(body, 'medicacao')),
        nis: get(body, 'nis') === undefined ? undefined : optionalString(get(body, 'nis')),
        renda: get(body, 'renda') === undefined ? undefined : optionalNumber(get(body, 'renda')) ?? null,
        sexo: optionalString(get(body, 'sexo')) as Sexo | undefined,
        raca: optionalString(get(body, 'raca')) as Raca | undefined,
        estadoCivil: optionalString(get(body, 'estadoCivil', 'estado_civil')) as EstadoCivil | undefined,
        veiculo: optionalBoolean(get(body, 'veiculo')),
        programasSociais: get(body, 'programasSociais', 'programas_sociais', 'programaSocial', 'programa_social') === undefined
            ? undefined
            : optionalNumber(get(body, 'programasSociais', 'programas_sociais', 'programaSocial', 'programa_social')) ?? 0,
        email: get(body, 'email') === undefined ? undefined : optionalString(get(body, 'email')),
        telefone: get(body, 'telefone') === undefined ? undefined : optionalString(get(body, 'telefone')),
        nomeDaMae: get(body, 'nomeDaMae', 'nome_da_mae') === undefined ? undefined : optionalString(get(body, 'nomeDaMae', 'nome_da_mae')),
        dataResidenciaMoradia: get(body, 'dataResidenciaMoradia', 'data_residencia_moradia') === undefined ? undefined : optionalDate(get(body, 'dataResidenciaMoradia', 'data_residencia_moradia')),
        status: optionalStringField(body, 'status') as StatusPessoa | undefined
    };
}

export function normalizeCreateResponsavelDto(bodyValue: unknown): CreateResponsavelDto {
    const body = asBody(bodyValue);
    return {
        ...normalizeCreatePessoaDto(body, 'Responsável'),
        parentesco: 'Responsável',
        nis: optionalString(get(body, 'nis')),
        renda: optionalNumber(get(body, 'renda')) ?? null,
        sexo: requiredString(get(body, 'sexo'), 'Sexo') as Sexo,
        raca: requiredString(get(body, 'raca'), 'Raça') as Raca,
        estadoCivil: requiredString(get(body, 'estadoCivil', 'estado_civil'), 'Estado civil') as EstadoCivil,
        veiculo: optionalBoolean(get(body, 'veiculo')) ?? false,
        programasSociais: optionalNumber(get(body, 'programasSociais', 'programas_sociais', 'programaSocial', 'programa_social')) ?? 0,
        email: optionalString(get(body, 'email')),
        telefone: optionalString(get(body, 'telefone')),
        nomeDaMae: optionalString(get(body, 'nomeDaMae', 'nome_da_mae')),
        dataResidenciaMoradia: optionalDate(get(body, 'dataResidenciaMoradia', 'data_residencia_moradia'))
    };
}

export function normalizeUpdateResponsavelDto(bodyValue: unknown): UpdateResponsavelDto {
    const body = asBody(bodyValue);
    return {
        ...normalizeUpdatePessoaDto(body),
        nis: get(body, 'nis') === undefined ? undefined : optionalString(get(body, 'nis')),
        renda: get(body, 'renda') === undefined ? undefined : optionalNumber(get(body, 'renda')) ?? null,
        sexo: optionalString(get(body, 'sexo')) as Sexo | undefined,
        raca: optionalString(get(body, 'raca')) as Raca | undefined,
        estadoCivil: optionalString(get(body, 'estadoCivil', 'estado_civil')) as EstadoCivil | undefined,
        veiculo: optionalBoolean(get(body, 'veiculo')),
        programasSociais: get(body, 'programasSociais', 'programas_sociais', 'programaSocial', 'programa_social') === undefined
            ? undefined
            : optionalNumber(get(body, 'programasSociais', 'programas_sociais', 'programaSocial', 'programa_social')) ?? 0,
        email: get(body, 'email') === undefined ? undefined : optionalString(get(body, 'email')),
        telefone: get(body, 'telefone') === undefined ? undefined : optionalString(get(body, 'telefone')),
        nomeDaMae: get(body, 'nomeDaMae', 'nome_da_mae') === undefined ? undefined : optionalString(get(body, 'nomeDaMae', 'nome_da_mae')),
        dataResidenciaMoradia: get(body, 'dataResidenciaMoradia', 'data_residencia_moradia') === undefined ? undefined : optionalDate(get(body, 'dataResidenciaMoradia', 'data_residencia_moradia'))
    };
}

export function normalizeLocalizacaoDto(bodyValue: unknown, partial = false): CreateLocalizacaoDto | UpdateLocalizacaoDto {
    const body = asBody(bodyValue);
    return {
        logradouro: get(body, 'logradouro') === undefined ? undefined : optionalString(get(body, 'logradouro')),
        numero: get(body, 'numero') === undefined ? undefined : optionalString(get(body, 'numero')),
        bairro: get(body, 'bairro') === undefined ? undefined : optionalString(get(body, 'bairro')),
        cidade: partial && get(body, 'cidade') === undefined ? undefined : requiredString(get(body, 'cidade'), 'Cidade'),
        estado: partial && get(body, 'estado') === undefined ? undefined : requiredString(get(body, 'estado'), 'Estado').toUpperCase(),
        cep: get(body, 'cep') === undefined ? undefined : optionalString(get(body, 'cep')),
        latitude: partial && get(body, 'latitude') === undefined ? undefined : requiredNumber(get(body, 'latitude'), 'Latitude'),
        longitude: partial && get(body, 'longitude') === undefined ? undefined : requiredNumber(get(body, 'longitude'), 'Longitude'),
        referencia: get(body, 'referencia') === undefined ? undefined : optionalString(get(body, 'referencia')),
        complemento: get(body, 'complemento') === undefined ? undefined : optionalString(get(body, 'complemento'))
    };
}

export function normalizeMoradiaDto(bodyValue: unknown, partial = false): CreateMoradiaDto | UpdateMoradiaDto {
    const body = asBody(bodyValue);
    return {
        tipoConstrucao: (partial && get(body, 'tipoConstrucao', 'tipo_construcao') === undefined
            ? undefined
            : requiredString(get(body, 'tipoConstrucao', 'tipo_construcao'), 'Tipo de construção')) as TipoConstrucao | undefined,
        dataRegistro: get(body, 'dataRegistro', 'data_registro') === undefined ? undefined : optionalDate(get(body, 'dataRegistro', 'data_registro')),
        status: partial
            ? optionalStringField(body, 'status') as StatusMoradia | undefined
            : (optionalString(get(body, 'status')) ?? undefined) as StatusMoradia | undefined,
        usoImovel: (partial && get(body, 'usoImovel', 'uso_imovel') === undefined
            ? undefined
            : requiredString(get(body, 'usoImovel', 'uso_imovel'), 'Uso do imóvel')) as UsoImovel | undefined,
        pavimentos: optionalNumber(get(body, 'pavimentos')),
        situacaoDeOcupacao: (partial && get(body, 'situacaoDeOcupacao', 'situacao_de_ocupacao') === undefined
            ? undefined
            : requiredString(get(body, 'situacaoDeOcupacao', 'situacao_de_ocupacao'), 'Situação de ocupação')) as SituacaoOcupacaoMoradia | undefined,
        descricao: get(body, 'descricao') === undefined ? undefined : optionalString(get(body, 'descricao'))
    };
}
