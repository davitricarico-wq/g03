import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import { getSupabaseDbClient, isDatabaseHostResolutionError } from '../db/supabase';
import type {
    BuscarPessoaDto,
    CreatePessoaDto,
    CreateResponsavelDto,
    PessoaBuscaResultadoDto,
    UpdatePessoaDto,
    UpdateResponsavelDto
} from '../dtos/pessoa.dto';
import type { CreateResponsavelRepositoryRequest, IPessoaRepository } from '../interfaces/repositories/pessoa.repository.interface';
import type { Pessoa, Responsavel } from '../models/pessoa.model';

type PessoaApiRow = {
    id: number;
    nome: string;
    apelido: string | null;
    cpf: string | null;
    data_de_nascimento: Date | string;
    parentesco: Pessoa['parentesco'];
    situacao_ocupacional: Pessoa['situacaoOcupacional'];
    escolaridade: Pessoa['escolaridade'];
    cronico: boolean;
    medicacao: boolean;
    status: Pessoa['status'];
    deleted_at: Date | string | null;
    nis: string | null;
    renda: number | string | null;
    sexo: Responsavel['sexo'] | null;
    raca: Responsavel['raca'] | null;
    estado_civil: Responsavel['estadoCivil'] | null;
    veiculo: boolean;
    programas_sociais: number;
    email: string | null;
    telefone: string | null;
    nome_da_mae: string | null;
    data_residencia_moradia: Date | string | null;
};

const pessoaSelect = `
    id,
    nome,
    apelido AS "nomeSocial",
    cpf,
    data_de_nascimento AS "dataDeNascimento",
    parentesco,
    situacao_ocupacional AS "situacaoOcupacional",
    escolaridade,
    cronico,
    medicacao,
    status,
    deleted_at AS "deletedAt",
    nis,
    renda::float8 AS renda,
    sexo,
    raca,
    estado_civil AS "estadoCivil",
    veiculo,
    programas_sociais AS "programasSociais",
    email,
    telefone,
    nome_da_mae AS "nomeDaMae",
    data_residencia_moradia AS "dataResidenciaMoradia"
`;

const responsavelSelect = `
    ${pessoaSelect}
`;

const pessoaSupabaseSelect = 'id, nome, apelido, cpf, data_de_nascimento, parentesco, situacao_ocupacional, escolaridade, cronico, medicacao, status, deleted_at, nis, renda, sexo, raca, estado_civil, veiculo, programas_sociais, email, telefone, nome_da_mae, data_residencia_moradia';

function mapPessoaApiRow(row: PessoaApiRow): Pessoa {
    return {
        id: row.id,
        nome: row.nome,
        nomeSocial: row.apelido,
        cpf: row.cpf,
        dataDeNascimento: row.data_de_nascimento as Date,
        parentesco: row.parentesco,
        situacaoOcupacional: row.situacao_ocupacional,
        escolaridade: row.escolaridade,
        cronico: row.cronico,
        medicacao: row.medicacao,
        status: row.status,
        deletedAt: row.deleted_at as Date | null,
        nis: row.nis,
        renda: row.renda === null ? null : Number(row.renda),
        sexo: row.sexo,
        raca: row.raca,
        estadoCivil: row.estado_civil,
        veiculo: row.veiculo,
        programasSociais: row.programas_sociais,
        email: row.email,
        telefone: row.telefone,
        nomeDaMae: row.nome_da_mae,
        dataResidenciaMoradia: row.data_residencia_moradia as Date | null
    };
}

function mapResponsavelApiRow(pessoa: PessoaApiRow): Responsavel | null {
    if (!pessoa.sexo || !pessoa.raca || !pessoa.estado_civil) {
        return null;
    }
    return {
        ...mapPessoaApiRow(pessoa),
        idPessoa: pessoa.id,
        nis: pessoa.nis ?? null,
        renda: pessoa.renda === null ? null : Number(pessoa.renda),
        sexo: pessoa.sexo,
        raca: pessoa.raca,
        estadoCivil: pessoa.estado_civil,
        veiculo: pessoa.veiculo,
        programasSociais: pessoa.programas_sociais,
        email: pessoa.email,
        telefone: pessoa.telefone,
        nomeDaMae: pessoa.nome_da_mae,
        dataResidenciaMoradia: pessoa.data_residencia_moradia as Date | null
    };
}

function normalizeDigits(value: string | null | undefined): string {
    return (value ?? '').replace(/\D/g, '');
}

export class PessoaRepository implements IPessoaRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<Pessoa[]> {
        try {
            const res = await db.query<Pessoa>(`
                SELECT ${pessoaSelect}
                FROM vw_pessoa_ativa
                ORDER BY nome
            `);
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            return this.getPessoasViaSupabase('ativas');
        }
    }

    async getById(id: number, db: Queryable = this.db): Promise<Pessoa | null> {
        try {
            const res = await db.query<Pessoa>(
                `
                SELECT ${pessoaSelect}
                FROM pessoa
                WHERE id = $1
                `,
                [id]
            );
            return res.rows[0] ?? null;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            const pessoas = await this.getPessoasViaSupabase('ativas');
            return pessoas.find((pessoa) => pessoa.id === id) ?? null;
        }
    }

    async getInativas(db: Queryable = this.db): Promise<PessoaBuscaResultadoDto[]> {
        return this.search({ escopo: 'inativas' }, db);
    }

    async search(filters: BuscarPessoaDto, db: Queryable = this.db): Promise<PessoaBuscaResultadoDto[]> {
        const values: unknown[] = [];
        const conditions: string[] = [];
        const add = (condition: string, ...params: unknown[]) => {
            const offset = values.length;
            values.push(...params);
            conditions.push(condition.replace(/\$(\d+)/g, (_, index: string) => `$${offset + Number(index)}`));
        };
        const escopo = filters.escopo ?? 'ativas';
        const source = escopo === 'ativas' ? 'vw_pessoa_ativa p' : 'pessoa p';

        if (escopo === 'inativas') {
            add("(p.deleted_at IS NOT NULL OR p.status::text NOT IN ($1, 'ATIVO'))", 'Ativo');
        }

        if (filters.nome) {
            add('(p.nome ILIKE $1 OR p.apelido ILIKE $2)', `%${filters.nome}%`, `%${filters.nome}%`);
        }
        if (filters.cpf) {
            add("regexp_replace(COALESCE(p.cpf, ''), '\\D', '', 'g') = $1", filters.cpf.replace(/\D/g, ''));
        }
        if (filters.email) {
            add('p.email ILIKE $1', `%${filters.email}%`);
        }
        if (filters.telefone) {
            add("regexp_replace(COALESCE(p.telefone, ''), '\\D', '', 'g') LIKE $1", `%${filters.telefone.replace(/\D/g, '')}%`);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        try {
            const res = await db.query<PessoaBuscaResultadoDto>(
                `
                SELECT
                    ${pessoaSelect},
                    (p.parentesco::text IN ('Responsável', 'RESPONSAVEL')) AS responsavel
                FROM ${source}
                ${where}
                ORDER BY p.nome
                LIMIT 50
                `,
                values
            );
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            return this.searchViaSupabase(filters);
        }
    }

    private async getPessoasViaSupabase(escopo: BuscarPessoaDto['escopo'] = 'ativas'): Promise<Pessoa[]> {
        const table = escopo === 'ativas' ? 'vw_pessoa_ativa' : 'pessoa';
        let query = getSupabaseDbClient()
            .from(table)
            .select(pessoaSupabaseSelect)
            .order('nome')
            .range(0, 9999);

        if (escopo === 'inativas') {
            query = query.or('deleted_at.not.is.null,status.neq.Ativo');
        }

        const { data, error } = await query;
        if (error) {
            throw error;
        }

        return (data ?? []).map(mapPessoaApiRow);
    }

    private async searchViaSupabase(filters: BuscarPessoaDto): Promise<PessoaBuscaResultadoDto[]> {
        const escopo = filters.escopo ?? 'ativas';
        const pessoas = await this.getPessoasViaSupabase(escopo);
        const nome = filters.nome?.toLocaleLowerCase('pt-BR');
        const cpf = normalizeDigits(filters.cpf);
        const email = filters.email?.toLocaleLowerCase('pt-BR');
        const telefone = normalizeDigits(filters.telefone);

        return pessoas
            .map((pessoa) => {
                return {
                    ...pessoa,
                    email: pessoa.email ?? null,
                    telefone: pessoa.telefone ?? null,
                    responsavel: pessoa.parentesco === 'Responsável'
                };
            })
            .filter((pessoa) => {
                if (nome && !pessoa.nome.toLocaleLowerCase('pt-BR').includes(nome) && !(pessoa.nomeSocial ?? '').toLocaleLowerCase('pt-BR').includes(nome)) {
                    return false;
                }
                if (cpf && normalizeDigits(pessoa.cpf) !== cpf) {
                    return false;
                }
                if (email && !(pessoa.email ?? '').toLocaleLowerCase('pt-BR').includes(email)) {
                    return false;
                }
                if (telefone && !normalizeDigits(pessoa.telefone).includes(telefone)) {
                    return false;
                }
                return true;
            })
            .slice(0, 50);
    }

    async create(data: CreatePessoaDto, db: Queryable = this.db): Promise<Pessoa> {
        try {
            const res = await db.query<Pessoa>(
                `
                INSERT INTO pessoa (
                    nome,
                    apelido,
                    cpf,
                    data_de_nascimento,
                    parentesco,
                    situacao_ocupacional,
                    escolaridade,
                    cronico,
                    medicacao,
                    status,
                    nis,
                    renda,
                    sexo,
                    raca,
                    estado_civil,
                    veiculo,
                    programas_sociais,
                    email,
                    telefone,
                    nome_da_mae,
                    data_residencia_moradia
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
                RETURNING ${pessoaSelect}
                `,
                [
                    data.nome,
                    data.nomeSocial ?? null,
                    data.cpf ?? null,
                    data.dataDeNascimento,
                    data.parentesco,
                    data.situacaoOcupacional,
                    data.escolaridade,
                    data.cronico,
                    data.medicacao,
                    data.status ?? 'Ativo',
                    data.nis ?? null,
                    data.renda ?? null,
                    data.sexo ?? null,
                    data.raca ?? null,
                    data.estadoCivil ?? null,
                    data.veiculo ?? false,
                    data.programasSociais ?? 0,
                    data.email ?? null,
                    data.telefone ?? null,
                    data.nomeDaMae ?? null,
                    data.dataResidenciaMoradia ?? null
                ]
            );
            return res.rows[0];
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data: row, error } = await getSupabaseDbClient()
                .from('pessoa')
                .insert({
                    nome: data.nome,
                    apelido: data.nomeSocial ?? null,
                    cpf: data.cpf ?? null,
                    data_de_nascimento: data.dataDeNascimento,
                    parentesco: data.parentesco,
                    situacao_ocupacional: data.situacaoOcupacional,
                    escolaridade: data.escolaridade,
                    cronico: data.cronico,
                    medicacao: data.medicacao,
                    status: data.status ?? 'Ativo',
                    nis: data.nis ?? null,
                    renda: data.renda ?? null,
                    sexo: data.sexo ?? null,
                    raca: data.raca ?? null,
                    estado_civil: data.estadoCivil ?? null,
                    veiculo: data.veiculo ?? false,
                    programas_sociais: data.programasSociais ?? 0,
                    email: data.email ?? null,
                    telefone: data.telefone ?? null,
                    nome_da_mae: data.nomeDaMae ?? null,
                    data_residencia_moradia: data.dataResidenciaMoradia ?? null
                })
                .select(pessoaSupabaseSelect)
                .single();
            if (error) throw error;
            return mapPessoaApiRow(row as PessoaApiRow);
        }
    }

    async update(id: number, data: UpdatePessoaDto, db: Queryable = this.db): Promise<Pessoa | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        const add = (column: string, value: unknown) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (data.nome !== undefined) add('nome', data.nome);
        if (data.nomeSocial !== undefined) add('apelido', data.nomeSocial);
        if (data.cpf !== undefined) add('cpf', data.cpf);
        if (data.dataDeNascimento !== undefined) add('data_de_nascimento', data.dataDeNascimento);
        if (data.parentesco !== undefined) add('parentesco', data.parentesco);
        if (data.situacaoOcupacional !== undefined) add('situacao_ocupacional', data.situacaoOcupacional);
        if (data.escolaridade !== undefined) add('escolaridade', data.escolaridade);
        if (data.cronico !== undefined) add('cronico', data.cronico);
        if (data.medicacao !== undefined) add('medicacao', data.medicacao);
        if (data.nis !== undefined) add('nis', data.nis);
        if (data.renda !== undefined) add('renda', data.renda);
        if (data.sexo !== undefined) add('sexo', data.sexo);
        if (data.raca !== undefined) add('raca', data.raca);
        if (data.estadoCivil !== undefined) add('estado_civil', data.estadoCivil);
        if (data.veiculo !== undefined) add('veiculo', data.veiculo);
        if (data.programasSociais !== undefined) add('programas_sociais', data.programasSociais);
        if (data.email !== undefined) add('email', data.email);
        if (data.telefone !== undefined) add('telefone', data.telefone);
        if (data.nomeDaMae !== undefined) add('nome_da_mae', data.nomeDaMae);
        if (data.dataResidenciaMoradia !== undefined) add('data_residencia_moradia', data.dataResidenciaMoradia);
        if (data.status !== undefined) {
            add('status', data.status);
            add('deleted_at', data.status === 'Ativo' ? null : new Date());
        }

        if (!fields.length) {
            return this.getById(id, db);
        }

        values.push(id);
        try {
            const res = await db.query<Pessoa>(
                `
                UPDATE pessoa
                SET ${fields.join(', ')}
                WHERE id = $${values.length}
                RETURNING ${pessoaSelect}
                `,
                values
            );
            return res.rows[0] ?? null;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const patch: Record<string, unknown> = {};
            if (data.nome !== undefined) patch.nome = data.nome;
            if (data.nomeSocial !== undefined) patch.apelido = data.nomeSocial;
            if (data.cpf !== undefined) patch.cpf = data.cpf;
            if (data.dataDeNascimento !== undefined) patch.data_de_nascimento = data.dataDeNascimento;
            if (data.parentesco !== undefined) patch.parentesco = data.parentesco;
            if (data.situacaoOcupacional !== undefined) patch.situacao_ocupacional = data.situacaoOcupacional;
            if (data.escolaridade !== undefined) patch.escolaridade = data.escolaridade;
            if (data.cronico !== undefined) patch.cronico = data.cronico;
            if (data.medicacao !== undefined) patch.medicacao = data.medicacao;
            if (data.nis !== undefined) patch.nis = data.nis;
            if (data.renda !== undefined) patch.renda = data.renda;
            if (data.sexo !== undefined) patch.sexo = data.sexo;
            if (data.raca !== undefined) patch.raca = data.raca;
            if (data.estadoCivil !== undefined) patch.estado_civil = data.estadoCivil;
            if (data.veiculo !== undefined) patch.veiculo = data.veiculo;
            if (data.programasSociais !== undefined) patch.programas_sociais = data.programasSociais;
            if (data.email !== undefined) patch.email = data.email;
            if (data.telefone !== undefined) patch.telefone = data.telefone;
            if (data.nomeDaMae !== undefined) patch.nome_da_mae = data.nomeDaMae;
            if (data.dataResidenciaMoradia !== undefined) patch.data_residencia_moradia = data.dataResidenciaMoradia;
            if (data.status !== undefined) {
                patch.status = data.status;
                patch.deleted_at = data.status === 'Ativo' ? null : new Date();
            }
            const { data: row, error } = await getSupabaseDbClient()
                .from('pessoa')
                .update(patch)
                .eq('id', id)
                .select(pessoaSupabaseSelect)
                .maybeSingle();
            if (error) throw error;
            return row ? mapPessoaApiRow(row as PessoaApiRow) : null;
        }
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query('DELETE FROM pessoa WHERE id = $1', [id]);
    }

    async getAllResponsaveis(db: Queryable = this.db): Promise<Responsavel[]> {
        try {
            const res = await db.query<Responsavel>(`
                SELECT ${responsavelSelect}
                FROM vw_pessoa_ativa p
                WHERE p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
                ORDER BY p.nome
            `);
            // O SELECT já devolve as colunas em camelCase (shape de Responsavel).
            // mapResponsavelApiRow é só para o caminho Supabase (linhas em snake_case).
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            return this.getAllResponsaveisViaSupabase();
        }
    }

    async getResponsavelByPessoaId(idPessoa: number, db: Queryable = this.db): Promise<Responsavel | null> {
        try {
            const res = await db.query<Responsavel>(
                `
                SELECT ${responsavelSelect}
                FROM pessoa p
                WHERE p.id = $1
                  AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
                `,
                [idPessoa]
            );
            // O SELECT já devolve camelCase (shape de Responsavel); o map é só p/ Supabase.
            return res.rows[0] ?? null;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            const responsaveis = await this.getAllResponsaveisViaSupabase([idPessoa]);
            return responsaveis[0] ?? null;
        }
    }

    private async getAllResponsaveisViaSupabase(ids?: number[]): Promise<Responsavel[]> {
        const pessoas = await this.getPessoasViaSupabase('ativas');
        return pessoas
            .filter((pessoa) => pessoa.parentesco === 'Responsável')
            .filter((pessoa) => !ids?.length || ids.includes(pessoa.id))
            .map((pessoa) => mapResponsavelApiRow({
                id: pessoa.id,
                nome: pessoa.nome,
                apelido: pessoa.nomeSocial,
                cpf: pessoa.cpf,
                data_de_nascimento: pessoa.dataDeNascimento,
                parentesco: pessoa.parentesco,
                situacao_ocupacional: pessoa.situacaoOcupacional,
                escolaridade: pessoa.escolaridade,
                cronico: pessoa.cronico,
                medicacao: pessoa.medicacao,
                status: pessoa.status,
                deleted_at: pessoa.deletedAt,
                nis: pessoa.nis ?? null,
                renda: pessoa.renda ?? null,
                sexo: pessoa.sexo ?? null,
                raca: pessoa.raca ?? null,
                estado_civil: pessoa.estadoCivil ?? null,
                veiculo: pessoa.veiculo ?? false,
                programas_sociais: pessoa.programasSociais ?? 0,
                email: pessoa.email ?? null,
                telefone: pessoa.telefone ?? null,
                nome_da_mae: pessoa.nomeDaMae ?? null,
                data_residencia_moradia: pessoa.dataResidenciaMoradia ?? null
            }))
            .filter((responsavel): responsavel is Responsavel => responsavel !== null)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    }

    async createResponsavel(data: CreateResponsavelRepositoryRequest, db: Queryable = this.db): Promise<Responsavel> {
        const created = await this.updateResponsavel(
            data.idPessoa,
            {
                ...data,
                programasSociais: data.programasSociais ?? (data.programaSocial ? 1 : 0)
            },
            db
        );
        if (!created) {
            throw new Error('Responsável atualizado, mas não encontrado na view de leitura');
        }
        return created;
    }

    async updateResponsavel(idPessoa: number, data: UpdateResponsavelDto, db: Queryable = this.db): Promise<Responsavel | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        const add = (column: string, value: unknown) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (data.nis !== undefined) add('nis', data.nis);
        if (data.renda !== undefined) add('renda', data.renda);
        if (data.sexo !== undefined) add('sexo', data.sexo);
        if (data.raca !== undefined) add('raca', data.raca);
        if (data.estadoCivil !== undefined) add('estado_civil', data.estadoCivil);
        if (data.veiculo !== undefined) add('veiculo', data.veiculo);
        if (data.programasSociais !== undefined) add('programas_sociais', data.programasSociais);
        if (data.email !== undefined) add('email', data.email);
        if (data.telefone !== undefined) add('telefone', data.telefone);
        if (data.nomeDaMae !== undefined) add('nome_da_mae', data.nomeDaMae);
        if (data.dataResidenciaMoradia !== undefined) add('data_residencia_moradia', data.dataResidenciaMoradia);

        if (fields.length) {
            values.push(idPessoa);
            try {
                await db.query(
                    `
                    UPDATE pessoa
                    SET ${fields.join(', ')}
                    WHERE id = $${values.length}
                    `,
                    values
                );
            } catch (err) {
                if (!isDatabaseHostResolutionError(err)) throw err;
                const patch: Record<string, unknown> = {};
                if (data.nis !== undefined) patch.nis = data.nis;
                if (data.renda !== undefined) patch.renda = data.renda;
                if (data.sexo !== undefined) patch.sexo = data.sexo;
                if (data.raca !== undefined) patch.raca = data.raca;
                if (data.estadoCivil !== undefined) patch.estado_civil = data.estadoCivil;
                if (data.veiculo !== undefined) patch.veiculo = data.veiculo;
                if (data.programasSociais !== undefined) patch.programas_sociais = data.programasSociais;
                if (data.email !== undefined) patch.email = data.email;
                if (data.telefone !== undefined) patch.telefone = data.telefone;
                if (data.nomeDaMae !== undefined) patch.nome_da_mae = data.nomeDaMae;
                if (data.dataResidenciaMoradia !== undefined) patch.data_residencia_moradia = data.dataResidenciaMoradia;
                const { error } = await getSupabaseDbClient()
                    .from('pessoa')
                    .update(patch)
                    .eq('id', idPessoa);
                if (error) throw error;
            }
        }

        return this.getResponsavelByPessoaId(idPessoa, db);
    }
}
