import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
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

const pessoaSelect = `
    id,
    nome,
    nome_social AS "nomeSocial",
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
    p.data_de_nascimento AS "dataDeNascimento",
    p.parentesco,
    p.situacao_ocupacional AS "situacaoOcupacional",
    p.escolaridade,
    p.cronico,
    p.medicacao,
    p.status,
    p.deleted_at AS "deletedAt",
    r.cpf,
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

export class PessoaRepository implements IPessoaRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<Pessoa[]> {
        const res = await db.query<Pessoa>(`
            SELECT ${pessoaSelect}
            FROM vw_pessoa_ativa
            ORDER BY nome
        `);
        return res.rows;
    }

    async getById(id: number, db: Queryable = this.db): Promise<Pessoa | null> {
        const res = await db.query<Pessoa>(
            `
            SELECT ${pessoaSelect}
            FROM vw_pessoa_ativa
            WHERE id = $1
            `,
            [id]
        );
        return res.rows[0] ?? null;
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
            add("regexp_replace(COALESCE(r.cpf, ''), '\\D', '', 'g') = $1", filters.cpf.replace(/\D/g, ''));
        }
        if (filters.email) {
            add('r.email ILIKE $1', `%${filters.email}%`);
        }
        if (filters.telefone) {
            add("regexp_replace(COALESCE(r.telefone, ''), '\\D', '', 'g') LIKE $1", `%${filters.telefone.replace(/\D/g, '')}%`);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const res = await db.query<PessoaBuscaResultadoDto>(
            `
            SELECT
                ${pessoaSelect},
                r.cpf,
                r.email,
                r.telefone,
                (r.id_pessoa IS NOT NULL) AS responsavel
            FROM ${source}
            LEFT JOIN responsavel r ON r.id_pessoa = p.id
            ${where}
            ORDER BY p.nome
            LIMIT 50
            `,
            values
        );
        return res.rows;
    }

    async create(data: CreatePessoaDto, db: Queryable = this.db): Promise<Pessoa> {
        const res = await db.query<Pessoa>(
            `
            INSERT INTO pessoa (
                nome,
                nome_social,
                data_de_nascimento,
                parentesco,
                situacao_ocupacional,
                escolaridade,
                cronico,
                medicacao,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING ${pessoaSelect}
            `,
            [
                data.nome,
                data.nomeSocial ?? null,
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
        if (data.dataDeNascimento !== undefined) add('data_de_nascimento', data.dataDeNascimento);
        if (data.parentesco !== undefined) add('parentesco', data.parentesco);
        if (data.situacaoOcupacional !== undefined) add('situacao_ocupacional', data.situacaoOcupacional);
        if (data.escolaridade !== undefined) add('escolaridade', data.escolaridade);
        if (data.cronico !== undefined) add('cronico', data.cronico);
        if (data.medicacao !== undefined) add('medicacao', data.medicacao);
        if (data.status !== undefined) add('status', data.status);

        if (!fields.length) {
            return this.getById(id, db);
        }

        values.push(id);
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
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query('DELETE FROM pessoa WHERE id = $1', [id]);
    }

    async getAllResponsaveis(db: Queryable = this.db): Promise<Responsavel[]> {
        const res = await db.query<Responsavel>(`
            SELECT ${responsavelSelect}
            FROM vw_pessoa_ativa p
            INNER JOIN responsavel r ON r.id_pessoa = p.id
            ORDER BY p.nome
        `);
        return res.rows;
    }

    async getResponsavelByPessoaId(idPessoa: number, db: Queryable = this.db): Promise<Responsavel | null> {
        const res = await db.query<Responsavel>(
            `
            SELECT ${responsavelSelect}
            FROM vw_pessoa_ativa p
            INNER JOIN responsavel r ON r.id_pessoa = p.id
            WHERE p.id = $1
            `,
            [idPessoa]
        );
        return res.rows[0] ?? null;
    }

    async createResponsavel(data: CreateResponsavelRepositoryRequest, db: Queryable = this.db): Promise<Responsavel> {
        await db.query(
            `
            INSERT INTO responsavel (
                id_pessoa,
                cpf,
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            `,
            [
                data.idPessoa,
                data.cpf ?? null,
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

        if (data.cpf !== undefined) add('cpf', data.cpf);
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
            await db.query(
                `
                UPDATE responsavel
                SET ${fields.join(', ')}
                WHERE id_pessoa = $${values.length}
                `,
                values
            );
        }

        return this.getResponsavelByPessoaId(idPessoa, db);
    }
}
