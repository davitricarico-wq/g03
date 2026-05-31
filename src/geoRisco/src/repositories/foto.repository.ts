import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import type { CreateFotoDto, CreateFotoSemMoradiaDto, CreateFotoSemPetDto, UpdateFotoDto } from '../dtos/foto.dto';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { Foto } from '../models/foto.model';

const fotoSelect = `
    id,
    id_moradia AS "idMoradia",
    id_pet AS "idPet",
    url
`;

export class FotoRepository implements IFotoRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<Foto[]> {
        const res = await db.query<Foto>(`
            SELECT ${fotoSelect}
            FROM foto
            ORDER BY id
        `);
        return res.rows;
    }

    async getById(id: number, db: Queryable = this.db): Promise<Foto | null> {
        const res = await db.query<Foto>(
            `
            SELECT ${fotoSelect}
            FROM foto
            WHERE id = $1
            `,
            [id]
        );
        return res.rows[0] ?? null;
    }

    async getByMoradia(idMoradia: number, db: Queryable = this.db): Promise<Foto[]> {
        const res = await db.query<Foto>(
            `
            SELECT ${fotoSelect}
            FROM foto
            WHERE id_moradia = $1
            ORDER BY id
            `,
            [idMoradia]
        );
        return res.rows;
    }

    async getByPet(idPet: number, db: Queryable = this.db): Promise<Foto[]> {
        const res = await db.query<Foto>(
            `
            SELECT ${fotoSelect}
            FROM foto
            WHERE id_pet = $1
            ORDER BY id
            `,
            [idPet]
        );
        return res.rows;
    }

    async create(data: CreateFotoDto, db: Queryable = this.db): Promise<Foto> {
        const res = await db.query<Foto>(
            `
            INSERT INTO foto (id_moradia, id_pet, url)
            VALUES ($1, $2, $3)
            RETURNING ${fotoSelect}
            `,
            [data.idMoradia ?? null, data.idPet ?? null, data.url]
        );
        return res.rows[0];
    }

    async createForMoradia(idMoradia: number, data: CreateFotoSemMoradiaDto, db: Queryable = this.db): Promise<Foto> {
        return this.create({ ...data, idMoradia }, db);
    }

    async createForPet(idPet: number, data: CreateFotoSemPetDto, db: Queryable = this.db): Promise<Foto> {
        return this.create({ ...data, idPet }, db);
    }

    async update(id: number, data: UpdateFotoDto, db: Queryable = this.db): Promise<Foto | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        const add = (column: string, value: unknown) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (data.url !== undefined) add('url', data.url);

        if (!fields.length) {
            return this.getById(id, db);
        }

        values.push(id);
        const res = await db.query<Foto>(
            `
            UPDATE foto
            SET ${fields.join(', ')}
            WHERE id = $${values.length}
            RETURNING ${fotoSelect}
            `,
            values
        );
        return res.rows[0] ?? null;
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query('DELETE FROM foto WHERE id = $1', [id]);
    }
}
