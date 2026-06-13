import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import { getSupabaseDbClient, isDatabaseHostResolutionError } from '../db/supabase';
import type { CreatePetDto, CreatePetSemFamiliaDto, UpdatePetDto } from '../dtos/pet.dto';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { Pet } from '../models/pet.model';

const petSelect = `
    id,
    id_familia AS "idFamilia",
    tipo,
    nome,
    porte,
    raca,
    cor,
    status,
    observacao
`;

type PetApiRow = {
    id: number;
    id_familia: number;
    tipo: Pet['tipo'];
    nome: string;
    porte: string;
    raca: string;
    cor: string;
    status?: Pet['status'];
    observacao: string | null;
};

function mapPetApiRow(row: PetApiRow): Pet {
    return {
        id: row.id,
        idFamilia: row.id_familia,
        tipo: row.tipo,
        nome: row.nome,
        porte: row.porte,
        raca: row.raca,
        cor: row.cor,
        status: row.status ?? 'Ativo',
        observacao: row.observacao
    };
}

export class PetRepository implements IPetRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<Pet[]> {
        try {
            const res = await db.query<Pet>(`
                SELECT ${petSelect}
                FROM pet
                ORDER BY nome
            `);
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('pet')
                .select('id, id_familia, tipo, nome, porte, raca, cor, observacao')
                .order('nome');
            if (error) throw error;
            return ((data ?? []) as PetApiRow[]).map(mapPetApiRow);
        }
    }

    async getById(id: number, db: Queryable = this.db): Promise<Pet | null> {
        try {
            const res = await db.query<Pet>(
                `
                SELECT ${petSelect}
                FROM pet
                WHERE id = $1
                `,
                [id]
            );
            return res.rows[0] ?? null;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('pet')
                .select('id, id_familia, tipo, nome, porte, raca, cor, observacao')
                .eq('id', id)
                .maybeSingle();
            if (error) throw error;
            return data ? mapPetApiRow(data as PetApiRow) : null;
        }
    }

    async getByFamilia(idFamilia: number, db: Queryable = this.db): Promise<Pet[]> {
        try {
            const res = await db.query<Pet>(
                `
                SELECT ${petSelect}
                FROM pet
                WHERE id_familia = $1
                ORDER BY nome
                `,
                [idFamilia]
            );
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('pet')
                .select('id, id_familia, tipo, nome, porte, raca, cor, observacao')
                .eq('id_familia', idFamilia)
                .order('nome');
            if (error) throw error;
            return ((data ?? []) as PetApiRow[]).map(mapPetApiRow);
        }
    }

    async create(data: CreatePetDto, db: Queryable = this.db): Promise<Pet> {
        const res = await db.query<Pet>(
            `
            INSERT INTO pet (id_familia, tipo, nome, porte, raca, cor, status, observacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING ${petSelect}
            `,
            [
                data.idFamilia,
                data.tipo,
                data.nome,
                data.porte,
                data.raca,
                data.cor,
                data.status,
                data.observacao ?? null
            ]
        );
        return res.rows[0];
    }

    async createForFamilia(idFamilia: number, data: CreatePetSemFamiliaDto, db: Queryable = this.db): Promise<Pet> {
        return this.create({ ...data, idFamilia }, db);
    }

    async update(id: number, data: UpdatePetDto, db: Queryable = this.db): Promise<Pet | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        const add = (column: string, value: unknown) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (data.tipo !== undefined) add('tipo', data.tipo);
        if (data.nome !== undefined) add('nome', data.nome);
        if (data.porte !== undefined) add('porte', data.porte);
        if (data.raca !== undefined) add('raca', data.raca);
        if (data.cor !== undefined) add('cor', data.cor);
        if (data.status !== undefined) add('status', data.status);
        if (data.observacao !== undefined) add('observacao', data.observacao);

        if (!fields.length) {
            return this.getById(id, db);
        }

        values.push(id);
        const res = await db.query<Pet>(
            `
            UPDATE pet
            SET ${fields.join(', ')}
            WHERE id = $${values.length}
            RETURNING ${petSelect}
            `,
            values
        );
        return res.rows[0] ?? null;
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query('DELETE FROM pet WHERE id = $1', [id]);
    }
}
