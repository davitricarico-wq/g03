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
    nome_social: string | null;
    cpf: string | null;
    data_de_nascimento: Date | string;
    parentesco: Pessoa['parentesco'];
    situacao_ocupacional: Pessoa['situacaoOcupacional'];
    escolaridade: Pessoa['escolaridade'];
    cronico: boolean;
    medicacao: boolean;
    status: Pessoa['status'];
    deleted_at: Date | string | null;
};

type ResponsavelApiRow = {
    id_pessoa: number;
    nis: string | null;
    renda: number | string | null;
    sexo: Responsavel['sexo'];
    raca: Responsavel['raca'];
    estado_civil: Responsavel['estadoCivil'];
    veiculo: boolean;
    programa_social: boolean;
    email: string | null;
    telefone: string | null;
    nome_do_pai: string | null;
    nome_da_mae: string | null;
    local_de_nascimento: string | null;
    data_residencia_estado: Date | string | null;
    data_residencia_moradia: Date | string | null;
};

const pessoaSelect = `
    id,
    nome,
    nome_social AS "nomeSocial",
    cpf,
    data_de_nascimento AS "dataDeNascimento",
    parentesco,
    situacao_ocupacional AS "situacaoOcupacional",
    escolaridade,
    cronico,
    medicacao,
    status,
    deleted_at AS "deletedAt"
`;

const responsavelSelect = `
    p.id,
    p.nome,
    p.nome_social AS "nomeSocial",
    p.cpf,
    p.data_de_nascimento AS "dataDeNascimento",
    p.parentesco,
    p.situacao_ocupacional AS "situacaoOcupacional",
    p.escolaridade,
    p.cronico,
    p.medicacao,
    p.status,
    p.deleted_at AS "deletedAt",
    r.nis,
    r.renda::float8 AS renda,
    r.sexo,
    r.raca,
    r.estado_civil AS "estadoCivil",
    r.veiculo,
    r.programa_social AS "programaSocial",
    r.email,
    r.telefone,
    r.nome_do_pai AS "nomeDoPai",
    r.nome_da_mae AS "nomeDaMae",
    r.local_de_nascimento AS "localDeNascimento",
    r.data_residencia_estado AS "dataResidenciaEstado",
    r.data_residencia_moradia AS "dataResidenciaMoradia"
`;

function mapPessoaApiRow(row: PessoaApiRow): Pessoa {
    return {
        id: row.id,
        nome: row.nome,
        nomeSocial: row.nome_social,
        cpf: row.cpf,
        dataDeNascimento: row.data_de_nascimento as Date,
        parentesco: row.parentesco,
        situacaoOcupacional: row.situacao_ocupacional,
        escolaridade: row.escolaridade,
        cronico: row.cronico,
        medicacao: row.medicacao,
        status: row.status,
        deletedAt: row.deleted_at as Date | null
    };
}

function mapResponsavelApiRow(pessoa: PessoaApiRow, responsavel: ResponsavelApiRow): Responsavel {
    return {
        ...mapPessoaApiRow(pessoa),
        nis: responsavel.nis,
        renda: responsavel.renda === null ? null : Number(responsavel.renda),
        sexo: responsavel.sexo,
        raca: responsavel.raca,
        estadoCivil: responsavel.estado_civil,
        veiculo: responsavel.veiculo,
        programaSocial: responsavel.programa_social,
        email: responsavel.email,
        telefone: responsavel.telefone,
        nomeDoPai: responsavel.nome_do_pai,
        nomeDaMae: responsavel.nome_da_mae,
        localDeNascimento: responsavel.local_de_nascimento,
        dataResidenciaEstado: responsavel.data_residencia_estado as Date | null,
        dataResidenciaMoradia: responsavel.data_residencia_moradia as Date | null
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
            add('(p.nome ILIKE $1 OR p.nome_social ILIKE $2)', `%${filters.nome}%`, `%${filters.nome}%`);
        }
        if (filters.cpf) {
            add("regexp_replace(COALESCE(p.cpf, ''), '\\D', '', 'g') = $1", filters.cpf.replace(/\D/g, ''));
        }
        if (filters.email) {
            add('r.email ILIKE $1', `%${filters.email}%`);
        }
        if (filters.telefone) {
            add("regexp_replace(COALESCE(r.telefone, ''), '\\D', '', 'g') LIKE $1", `%${filters.telefone.replace(/\D/g, '')}%`);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        try {
            const res = await db.query<PessoaBuscaResultadoDto>(
                `
                SELECT
                    ${pessoaSelect},
                    r.email,
                    r.telefone,
                    (r.id_pessoa IS NOT NULL AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')) AS responsavel
                FROM ${source}
                LEFT JOIN responsavel r ON r.id_pessoa = p.id
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
            .select('id, nome, nome_social, cpf, data_de_nascimento, parentesco, situacao_ocupacional, escolaridade, cronico, medicacao, status, deleted_at')
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
        const pessoaIds = pessoas.map((pessoa) => pessoa.id);
        const responsavelByPessoaId = await this.getResponsaveisByPessoaIdViaSupabase(pessoaIds);
        const nome = filters.nome?.toLocaleLowerCase('pt-BR');
        const cpf = normalizeDigits(filters.cpf);
        const email = filters.email?.toLocaleLowerCase('pt-BR');
        const telefone = normalizeDigits(filters.telefone);

        return pessoas
            .map((pessoa) => {
                const responsavel = responsavelByPessoaId.get(pessoa.id);
                return {
                    ...pessoa,
                    email: responsavel?.email ?? null,
                    telefone: responsavel?.telefone ?? null,
                    responsavel: Boolean(responsavel) && pessoa.parentesco === 'Responsável'
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

    private async getResponsaveisByPessoaIdViaSupabase(ids: number[]): Promise<Map<number, ResponsavelApiRow>> {
        if (!ids.length) {
            return new Map();
        }

        const { data, error } = await getSupabaseDbClient()
            .from('responsavel')
            .select('id_pessoa, nis, renda, sexo, raca, estado_civil, veiculo, programa_social, email, telefone, nome_do_pai, nome_da_mae, local_de_nascimento, data_residencia_estado, data_residencia_moradia')
            .in('id_pessoa', ids)
            .range(0, 9999);

        if (error) {
            throw error;
        }

        return new Map((data ?? []).map((responsavel) => [responsavel.id_pessoa, responsavel]));
    }

    async create(data: CreatePessoaDto, db: Queryable = this.db): Promise<Pessoa> {
        try {
            const res = await db.query<Pessoa>(
                `
                INSERT INTO pessoa (
                    nome,
                    nome_social,
                    cpf,
                    data_de_nascimento,
                    parentesco,
                    situacao_ocupacional,
                    escolaridade,
                    cronico,
                    medicacao,
                    status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
                    data.status ?? 'Ativo'
                ]
            );
            return res.rows[0];
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data: row, error } = await getSupabaseDbClient()
                .from('pessoa')
                .insert({
                    nome: data.nome,
                    nome_social: data.nomeSocial ?? null,
                    cpf: data.cpf ?? null,
                    data_de_nascimento: data.dataDeNascimento,
                    parentesco: data.parentesco,
                    situacao_ocupacional: data.situacaoOcupacional,
                    escolaridade: data.escolaridade,
                    cronico: data.cronico,
                    medicacao: data.medicacao,
                    status: data.status ?? 'Ativo'
                })
                .select('id, nome, nome_social, cpf, data_de_nascimento, parentesco, situacao_ocupacional, escolaridade, cronico, medicacao, status, deleted_at')
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
        if (data.nomeSocial !== undefined) add('nome_social', data.nomeSocial);
        if (data.cpf !== undefined) add('cpf', data.cpf);
        if (data.dataDeNascimento !== undefined) add('data_de_nascimento', data.dataDeNascimento);
        if (data.parentesco !== undefined) add('parentesco', data.parentesco);
        if (data.situacaoOcupacional !== undefined) add('situacao_ocupacional', data.situacaoOcupacional);
        if (data.escolaridade !== undefined) add('escolaridade', data.escolaridade);
        if (data.cronico !== undefined) add('cronico', data.cronico);
        if (data.medicacao !== undefined) add('medicacao', data.medicacao);
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
            if (data.nomeSocial !== undefined) patch.nome_social = data.nomeSocial;
            if (data.cpf !== undefined) patch.cpf = data.cpf;
            if (data.dataDeNascimento !== undefined) patch.data_de_nascimento = data.dataDeNascimento;
            if (data.parentesco !== undefined) patch.parentesco = data.parentesco;
            if (data.situacaoOcupacional !== undefined) patch.situacao_ocupacional = data.situacaoOcupacional;
            if (data.escolaridade !== undefined) patch.escolaridade = data.escolaridade;
            if (data.cronico !== undefined) patch.cronico = data.cronico;
            if (data.medicacao !== undefined) patch.medicacao = data.medicacao;
            if (data.status !== undefined) {
                patch.status = data.status;
                patch.deleted_at = data.status === 'Ativo' ? null : new Date();
            }
            const { data: row, error } = await getSupabaseDbClient()
                .from('pessoa')
                .update(patch)
                .eq('id', id)
                .select('id, nome, nome_social, cpf, data_de_nascimento, parentesco, situacao_ocupacional, escolaridade, cronico, medicacao, status, deleted_at')
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
                INNER JOIN responsavel r ON r.id_pessoa = p.id
                ORDER BY p.nome
            `);
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
                INNER JOIN responsavel r ON r.id_pessoa = p.id
                WHERE p.id = $1
                `,
                [idPessoa]
            );
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
        const filteredPessoas = ids?.length ? pessoas.filter((pessoa) => ids.includes(pessoa.id)) : pessoas;
        const pessoaById = new Map(filteredPessoas.map((pessoa) => [pessoa.id, pessoa]));
        const responsavelByPessoaId = await this.getResponsaveisByPessoaIdViaSupabase([...pessoaById.keys()]);

        return [...responsavelByPessoaId.entries()]
            .map(([idPessoa, responsavel]) => {
                const pessoa = pessoaById.get(idPessoa);
                if (!pessoa) {
                    return null;
                }
                return mapResponsavelApiRow(
                    {
                        id: pessoa.id,
                        nome: pessoa.nome,
                        nome_social: pessoa.nomeSocial,
                        cpf: pessoa.cpf,
                        data_de_nascimento: pessoa.dataDeNascimento,
                        parentesco: pessoa.parentesco,
                        situacao_ocupacional: pessoa.situacaoOcupacional,
                        escolaridade: pessoa.escolaridade,
                        cronico: pessoa.cronico,
                        medicacao: pessoa.medicacao,
                        status: pessoa.status,
                        deleted_at: pessoa.deletedAt
                    },
                    responsavel
                );
            })
            .filter((responsavel): responsavel is Responsavel => responsavel !== null)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    }

    async createResponsavel(data: CreateResponsavelRepositoryRequest, db: Queryable = this.db): Promise<Responsavel> {
        try {
            await db.query(
                `
                INSERT INTO responsavel (
                id_pessoa,
                nis,
                renda,
                sexo,
                raca,
                estado_civil,
                veiculo,
                programa_social,
                email,
                telefone,
                nome_do_pai,
                nome_da_mae,
                local_de_nascimento,
                data_residencia_estado,
                data_residencia_moradia
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                `,
                [
                    data.idPessoa,
                    data.nis ?? null,
                    data.renda ?? null,
                    data.sexo,
                    data.raca,
                    data.estadoCivil,
                    data.veiculo ?? false,
                    data.programaSocial ?? false,
                    data.email ?? null,
                    data.telefone ?? null,
                    data.nomeDoPai ?? null,
                    data.nomeDaMae ?? null,
                    data.localDeNascimento ?? null,
                    data.dataResidenciaEstado ?? null,
                    data.dataResidenciaMoradia ?? null
                ]
            );
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { error } = await getSupabaseDbClient()
                .from('responsavel')
                .insert({
                    id_pessoa: data.idPessoa,
                    nis: data.nis ?? null,
                    renda: data.renda ?? null,
                    sexo: data.sexo,
                    raca: data.raca,
                    estado_civil: data.estadoCivil,
                    veiculo: data.veiculo ?? false,
                    programa_social: data.programaSocial ?? false,
                    email: data.email ?? null,
                    telefone: data.telefone ?? null,
                    nome_do_pai: data.nomeDoPai ?? null,
                    nome_da_mae: data.nomeDaMae ?? null,
                    local_de_nascimento: data.localDeNascimento ?? null,
                    data_residencia_estado: data.dataResidenciaEstado ?? null,
                    data_residencia_moradia: data.dataResidenciaMoradia ?? null
                });
            if (error) throw error;
        }

        const created = await this.getResponsavelByPessoaId(data.idPessoa, db);
        if (!created) {
            throw new Error('Responsável criado, mas não encontrado na view de leitura');
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
        if (data.programaSocial !== undefined) add('programa_social', data.programaSocial);
        if (data.email !== undefined) add('email', data.email);
        if (data.telefone !== undefined) add('telefone', data.telefone);
        if (data.nomeDoPai !== undefined) add('nome_do_pai', data.nomeDoPai);
        if (data.nomeDaMae !== undefined) add('nome_da_mae', data.nomeDaMae);
        if (data.localDeNascimento !== undefined) add('local_de_nascimento', data.localDeNascimento);
        if (data.dataResidenciaEstado !== undefined) add('data_residencia_estado', data.dataResidenciaEstado);
        if (data.dataResidenciaMoradia !== undefined) add('data_residencia_moradia', data.dataResidenciaMoradia);

        if (fields.length) {
            values.push(idPessoa);
            try {
                await db.query(
                    `
                    UPDATE responsavel
                    SET ${fields.join(', ')}
                    WHERE id_pessoa = $${values.length}
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
                if (data.programaSocial !== undefined) patch.programa_social = data.programaSocial;
                if (data.email !== undefined) patch.email = data.email;
                if (data.telefone !== undefined) patch.telefone = data.telefone;
                if (data.nomeDoPai !== undefined) patch.nome_do_pai = data.nomeDoPai;
                if (data.nomeDaMae !== undefined) patch.nome_da_mae = data.nomeDaMae;
                if (data.localDeNascimento !== undefined) patch.local_de_nascimento = data.localDeNascimento;
                if (data.dataResidenciaEstado !== undefined) patch.data_residencia_estado = data.dataResidenciaEstado;
                if (data.dataResidenciaMoradia !== undefined) patch.data_residencia_moradia = data.dataResidenciaMoradia;
                const { error } = await getSupabaseDbClient()
                    .from('responsavel')
                    .update(patch)
                    .eq('id_pessoa', idPessoa);
                if (error) throw error;
            }
        }

        return this.getResponsavelByPessoaId(idPessoa, db);
    }
}
