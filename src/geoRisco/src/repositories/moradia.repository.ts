import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import type { CreateLocalizacaoDto, UpdateLocalizacaoDto } from '../dtos/localizacao.dto';
import type { CreateMoradiaDto, UpdateMoradiaDto } from '../dtos/moradia.dto';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { Localizacao } from '../models/localizacao.model';
import type { Moradia, MoradiaComLocalizacao } from '../models/moradia.model';

type MoradiaComLocalizacaoRow = Moradia & {
    localizacaoId: number;
    localizacaoLogradouro: string | null;
    localizacaoNumero: string | null;
    localizacaoBairro: string | null;
    localizacaoCidade: string;
    localizacaoEstado: string;
    localizacaoCep: string | null;
    localizacaoLatitude: number;
    localizacaoLongitude: number;
    localizacaoReferencia: string | null;
    localizacaoComplemento: string | null;
};

const localizacaoSelect = `
    id,
    logradouro,
    numero,
    bairro,
    cidade,
    estado,
    cep,
    latitude::float8 AS latitude,
    longitude::float8 AS longitude,
    referencia,
    complemento
`;

const moradiaSelect = `
    id,
    id_localizacao AS "idLocalizacao",
    tipo_construcao AS "tipoConstrucao",
    data_registro AS "dataRegistro",
    status,
    uso_imovel AS "usoImovel",
    pavimentos,
    situacao_de_ocupacao AS "situacaoDeOcupacao",
    descricao,
    deleted_at AS "deletedAt"
`;

const moradiaComLocalizacaoSelect = `
    m.id,
    m.id_localizacao AS "idLocalizacao",
    m.tipo_construcao AS "tipoConstrucao",
    m.data_registro AS "dataRegistro",
    m.status,
    m.uso_imovel AS "usoImovel",
    m.pavimentos,
    m.situacao_de_ocupacao AS "situacaoDeOcupacao",
    m.descricao,
    m.deleted_at AS "deletedAt",
    l.id AS "localizacaoId",
    l.logradouro AS "localizacaoLogradouro",
    l.numero AS "localizacaoNumero",
    l.bairro AS "localizacaoBairro",
    l.cidade AS "localizacaoCidade",
    l.estado AS "localizacaoEstado",
    l.cep AS "localizacaoCep",
    l.latitude::float8 AS "localizacaoLatitude",
    l.longitude::float8 AS "localizacaoLongitude",
    l.referencia AS "localizacaoReferencia",
    l.complemento AS "localizacaoComplemento"
`;

function mapMoradiaComLocalizacao(row: MoradiaComLocalizacaoRow): MoradiaComLocalizacao {
    return {
        id: row.id,
        idLocalizacao: row.idLocalizacao,
        tipoConstrucao: row.tipoConstrucao,
        dataRegistro: row.dataRegistro,
        status: row.status,
        usoImovel: row.usoImovel,
        pavimentos: row.pavimentos,
        situacaoDeOcupacao: row.situacaoDeOcupacao,
        descricao: row.descricao,
        deletedAt: row.deletedAt,
        localizacao: {
            id: row.localizacaoId,
            logradouro: row.localizacaoLogradouro,
            numero: row.localizacaoNumero,
            bairro: row.localizacaoBairro,
            cidade: row.localizacaoCidade,
            estado: row.localizacaoEstado,
            cep: row.localizacaoCep,
            latitude: row.localizacaoLatitude,
            longitude: row.localizacaoLongitude,
            referencia: row.localizacaoReferencia,
            complemento: row.localizacaoComplemento
        }
    };
}

export class MoradiaRepository implements IMoradiaRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<MoradiaComLocalizacao[]> {
        const res = await db.query<MoradiaComLocalizacaoRow>(`
            SELECT ${moradiaComLocalizacaoSelect}
            FROM vw_moradia_ativa m
            INNER JOIN localizacao l ON l.id = m.id_localizacao
            ORDER BY m.id
        `);
        return res.rows.map(mapMoradiaComLocalizacao);
    }

    async getById(id: number, db: Queryable = this.db): Promise<MoradiaComLocalizacao | null> {
        const res = await db.query<MoradiaComLocalizacaoRow>(
            `
            SELECT ${moradiaComLocalizacaoSelect}
            FROM vw_moradia_ativa m
            INNER JOIN localizacao l ON l.id = m.id_localizacao
            WHERE m.id = $1
            `,
            [id]
        );
        return res.rows[0] ? mapMoradiaComLocalizacao(res.rows[0]) : null;
    }

    async createLocalizacao(data: CreateLocalizacaoDto, db: Queryable = this.db): Promise<Localizacao> {
        const res = await db.query<Localizacao>(
            `
            INSERT INTO localizacao (
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                latitude,
                longitude,
                referencia,
                complemento
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING ${localizacaoSelect}
            `,
            [
                data.logradouro ?? null,
                data.numero ?? null,
                data.bairro ?? null,
                data.cidade,
                data.estado,
                data.cep ?? null,
                data.latitude,
                data.longitude,
                data.referencia ?? null,
                data.complemento ?? null
            ]
        );
        return res.rows[0];
    }

    async updateLocalizacao(id: number, data: UpdateLocalizacaoDto, db: Queryable = this.db): Promise<Localizacao | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        const add = (column: string, value: unknown) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (data.logradouro !== undefined) add('logradouro', data.logradouro);
        if (data.numero !== undefined) add('numero', data.numero);
        if (data.bairro !== undefined) add('bairro', data.bairro);
        if (data.cidade !== undefined) add('cidade', data.cidade);
        if (data.estado !== undefined) add('estado', data.estado);
        if (data.cep !== undefined) add('cep', data.cep);
        if (data.latitude !== undefined) add('latitude', data.latitude);
        if (data.longitude !== undefined) add('longitude', data.longitude);
        if (data.referencia !== undefined) add('referencia', data.referencia);
        if (data.complemento !== undefined) add('complemento', data.complemento);

        if (!fields.length) {
            const current = await db.query<Localizacao>(`SELECT ${localizacaoSelect} FROM localizacao WHERE id = $1`, [id]);
            return current.rows[0] ?? null;
        }

        values.push(id);
        const res = await db.query<Localizacao>(
            `
            UPDATE localizacao
            SET ${fields.join(', ')}
            WHERE id = $${values.length}
            RETURNING ${localizacaoSelect}
            `,
            values
        );
        return res.rows[0] ?? null;
    }

    async create(data: CreateMoradiaDto & { idLocalizacao: number }, db: Queryable = this.db): Promise<Moradia> {
        const res = await db.query<Moradia>(
            `
            INSERT INTO moradia (
                id_localizacao,
                tipo_construcao,
                data_registro,
                status,
                uso_imovel,
                pavimentos,
                situacao_de_ocupacao,
                descricao
            )
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5, $6, $7, $8)
            RETURNING ${moradiaSelect}
            `,
            [
                data.idLocalizacao,
                data.tipoConstrucao,
                data.dataRegistro ?? null,
                data.status ?? 'Ativa',
                data.usoImovel,
                data.pavimentos ?? 1,
                data.situacaoDeOcupacao,
                data.descricao ?? null
            ]
        );
        return res.rows[0];
    }

    async update(id: number, data: UpdateMoradiaDto, db: Queryable = this.db): Promise<Moradia | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        const add = (column: string, value: unknown) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (data.tipoConstrucao !== undefined) add('tipo_construcao', data.tipoConstrucao);
        if (data.dataRegistro !== undefined) add('data_registro', data.dataRegistro);
        if (data.status !== undefined) add('status', data.status);
        if (data.usoImovel !== undefined) add('uso_imovel', data.usoImovel);
        if (data.pavimentos !== undefined) add('pavimentos', data.pavimentos);
        if (data.situacaoDeOcupacao !== undefined) add('situacao_de_ocupacao', data.situacaoDeOcupacao);
        if (data.descricao !== undefined) add('descricao', data.descricao);

        if (!fields.length) {
            const current = await db.query<Moradia>(`SELECT ${moradiaSelect} FROM vw_moradia_ativa WHERE id = $1`, [id]);
            return current.rows[0] ?? null;
        }

        values.push(id);
        const res = await db.query<Moradia>(
            `
            UPDATE moradia
            SET ${fields.join(', ')}
            WHERE id = $${values.length}
            RETURNING ${moradiaSelect}
            `,
            values
        );
        return res.rows[0] ?? null;
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query('DELETE FROM moradia WHERE id = $1', [id]);
    }
}
