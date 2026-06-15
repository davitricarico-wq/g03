import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import { getSupabaseDbClient, isDatabaseHostResolutionError } from '../db/supabase';
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

type MoradiaApiRow = {
    id: number;
    id_localizacao: number;
    tipo_construcao: Moradia['tipoConstrucao'];
    data_registro: Date | string | null;
    status: Moradia['status'];
    uso_imovel: Moradia['usoImovel'];
    pavimentos: number;
    situacao_de_ocupacao: Moradia['situacaoDeOcupacao'];
    descricao: string | null;
    deleted_at: Date | string | null;
};

type LocalizacaoApiRow = {
    id: number;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string;
    estado: string;
    cep: string | null;
    latitude: number | string;
    longitude: number | string;
    referencia: string | null;
    complemento: string | null;
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

function mapMoradiaApiRow(row: MoradiaApiRow, localizacao: LocalizacaoApiRow): MoradiaComLocalizacao {
    return {
        id: row.id,
        idLocalizacao: row.id_localizacao,
        tipoConstrucao: row.tipo_construcao,
        dataRegistro: row.data_registro as Date | null,
        status: row.status,
        usoImovel: row.uso_imovel,
        pavimentos: row.pavimentos,
        situacaoDeOcupacao: row.situacao_de_ocupacao,
        descricao: row.descricao,
        deletedAt: row.deleted_at as Date | null,
        localizacao: {
            id: localizacao.id,
            logradouro: localizacao.logradouro,
            numero: localizacao.numero,
            bairro: localizacao.bairro,
            cidade: localizacao.cidade,
            estado: localizacao.estado,
            cep: localizacao.cep,
            latitude: Number(localizacao.latitude),
            longitude: Number(localizacao.longitude),
            referencia: localizacao.referencia,
            complemento: localizacao.complemento
        }
    };
}

export class MoradiaRepository implements IMoradiaRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<MoradiaComLocalizacao[]> {
        try {
            const res = await db.query<MoradiaComLocalizacaoRow>(`
                SELECT ${moradiaComLocalizacaoSelect}
                FROM vw_moradia_ativa m
                INNER JOIN localizacao l ON l.id = m.id_localizacao
                ORDER BY m.id
            `);
            return res.rows.map(mapMoradiaComLocalizacao);
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            return this.getAllViaSupabase();
        }
    }

    async getById(id: number, db: Queryable = this.db): Promise<MoradiaComLocalizacao | null> {
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            return this.getByIdViaSupabase(id);
        }
    }

    private async getAllViaSupabase(): Promise<MoradiaComLocalizacao[]> {
        const supabase = getSupabaseDbClient();
        const { data: moradias, error: moradiaError } = await supabase
            .from('vw_moradia_ativa')
            .select('id, id_localizacao, tipo_construcao, data_registro, status, uso_imovel, pavimentos, situacao_de_ocupacao, descricao, deleted_at')
            .order('id');

        if (moradiaError) {
            throw moradiaError;
        }

        const localizacaoIds = [...new Set((moradias ?? []).map((moradia) => moradia.id_localizacao))];
        if (!localizacaoIds.length) {
            return [];
        }

        const { data: localizacoes, error: localizacaoError } = await supabase
            .from('localizacao')
            .select('id, logradouro, numero, bairro, cidade, estado, cep, latitude, longitude, referencia, complemento')
            .in('id', localizacaoIds);

        if (localizacaoError) {
            throw localizacaoError;
        }

        const localizacaoById = new Map((localizacoes ?? []).map((localizacao) => [localizacao.id, localizacao]));
        return (moradias ?? [])
            .map((moradia) => {
                const localizacao = localizacaoById.get(moradia.id_localizacao);
                return localizacao ? mapMoradiaApiRow(moradia, localizacao) : null;
            })
            .filter((moradia): moradia is MoradiaComLocalizacao => moradia !== null);
    }

    private async getByIdViaSupabase(id: number): Promise<MoradiaComLocalizacao | null> {
        const supabase = getSupabaseDbClient();
        const { data: moradia, error: moradiaError } = await supabase
            .from('vw_moradia_ativa')
            .select('id, id_localizacao, tipo_construcao, data_registro, status, uso_imovel, pavimentos, situacao_de_ocupacao, descricao, deleted_at')
            .eq('id', id)
            .maybeSingle();

        if (moradiaError) {
            throw moradiaError;
        }
        if (!moradia) {
            return null;
        }

        const { data: localizacao, error: localizacaoError } = await supabase
            .from('localizacao')
            .select('id, logradouro, numero, bairro, cidade, estado, cep, latitude, longitude, referencia, complemento')
            .eq('id', moradia.id_localizacao)
            .single();

        if (localizacaoError) {
            throw localizacaoError;
        }

        return mapMoradiaApiRow(moradia, localizacao);
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
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const patch: Record<string, unknown> = {};
            if (data.logradouro !== undefined) patch.logradouro = data.logradouro;
            if (data.numero !== undefined) patch.numero = data.numero;
            if (data.bairro !== undefined) patch.bairro = data.bairro;
            if (data.cidade !== undefined) patch.cidade = data.cidade;
            if (data.estado !== undefined) patch.estado = data.estado;
            if (data.cep !== undefined) patch.cep = data.cep;
            if (data.latitude !== undefined) patch.latitude = data.latitude;
            if (data.longitude !== undefined) patch.longitude = data.longitude;
            if (data.referencia !== undefined) patch.referencia = data.referencia;
            if (data.complemento !== undefined) patch.complemento = data.complemento;
            const { data: row, error } = await getSupabaseDbClient()
                .from('localizacao')
                .update(patch)
                .eq('id', id)
                .select('id, logradouro, numero, bairro, cidade, estado, cep, latitude, longitude, referencia, complemento')
                .maybeSingle();
            if (error) throw error;
            return row ? {
                id: row.id,
                logradouro: row.logradouro,
                numero: row.numero,
                bairro: row.bairro,
                cidade: row.cidade,
                estado: row.estado,
                cep: row.cep,
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
                referencia: row.referencia,
                complemento: row.complemento
            } : null;
        }
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
        if (data.status !== undefined && data.status !== null) add('status', data.status);
        if (data.usoImovel !== undefined) add('uso_imovel', data.usoImovel);
        if (data.pavimentos !== undefined) add('pavimentos', data.pavimentos);
        if (data.situacaoDeOcupacao !== undefined) add('situacao_de_ocupacao', data.situacaoDeOcupacao);
        if (data.descricao !== undefined) add('descricao', data.descricao);

        if (!fields.length) {
            const current = await db.query<Moradia>(
                `SELECT ${moradiaSelect} FROM vw_moradia_ativa WHERE id = $1`,
                [id]
            );
            return current.rows[0] ?? null;
        }

        values.push(id);
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const patch: Record<string, unknown> = {};
            if (data.tipoConstrucao !== undefined) patch.tipo_construcao = data.tipoConstrucao;
            if (data.dataRegistro !== undefined) patch.data_registro = data.dataRegistro;
            if (data.status !== undefined && data.status !== null) patch.status = data.status;
            if (data.usoImovel !== undefined) patch.uso_imovel = data.usoImovel;
            if (data.pavimentos !== undefined) patch.pavimentos = data.pavimentos;
            if (data.situacaoDeOcupacao !== undefined) patch.situacao_de_ocupacao = data.situacaoDeOcupacao;
            if (data.descricao !== undefined) patch.descricao = data.descricao;
            const { data: row, error } = await getSupabaseDbClient()
                .from('moradia')
                .update(patch)
                .eq('id', id)
                .select('id, id_localizacao, tipo_construcao, data_registro, status, uso_imovel, pavimentos, situacao_de_ocupacao, descricao, deleted_at')
                .maybeSingle();
            if (error) throw error;
            return row ? mapMoradiaApiRow(row as MoradiaApiRow, {
                id: row.id_localizacao,
                logradouro: null,
                numero: null,
                bairro: null,
                cidade: '',
                estado: '',
                cep: null,
                latitude: 0,
                longitude: 0,
                referencia: null,
                complemento: null
            }).localizacao && {
                id: row.id,
                idLocalizacao: row.id_localizacao,
                tipoConstrucao: row.tipo_construcao,
                dataRegistro: row.data_registro as Date | null,
                status: row.status,
                usoImovel: row.uso_imovel,
                pavimentos: row.pavimentos,
                situacaoDeOcupacao: row.situacao_de_ocupacao,
                descricao: row.descricao,
                deletedAt: row.deleted_at as Date | null
            } : null;
        }
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query(
            `
            UPDATE moradia
            SET status = 'Excluída',
                deleted_at = COALESCE(deleted_at, NOW())
            WHERE id = $1
              AND deleted_at IS NULL
            `,
            [id]
        );
    }
}
