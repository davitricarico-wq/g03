import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import { getSupabaseDbClient, isDatabaseHostResolutionError } from '../db/supabase';
import type { Prioridade } from '../models/prioridade.model';

export class PrioridadeRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<Prioridade[]> {
        try {
            const res = await db.query<Prioridade>(`
                SELECT
                    id,
                    condicao,
                    tipo
                FROM grupo_prioritario
                ORDER BY condicao
            `);
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }

            const { data, error } = await getSupabaseDbClient()
                .from('grupo_prioritario')
                .select('id, condicao, tipo')
                .order('condicao');

            if (error) {
                throw error;
            }

            return (data ?? []).map((row) => ({
                id: row.id,
                condicao: row.condicao,
                tipo: row.tipo
            }));
        }
    }

    async getByPessoa(idPessoa: number, db: Queryable = this.db): Promise<Prioridade[]> {
        try {
            const res = await db.query<Prioridade>(
                `
                SELECT gp.id, gp.condicao, gp.tipo
                FROM pessoa_grupo_prioritario pgp
                INNER JOIN grupo_prioritario gp ON gp.id = pgp.id_grupo_prioritario
                WHERE pgp.id_pessoa = $1
                ORDER BY gp.condicao
                `,
                [idPessoa]
            );
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }

            const supabase = getSupabaseDbClient();
            const { data: vinculos, error: vinculosError } = await supabase
                .from('pessoa_grupo_prioritario')
                .select('id_grupo_prioritario')
                .eq('id_pessoa', idPessoa);

            if (vinculosError) throw vinculosError;
            const ids = (vinculos ?? []).map((vinculo) => vinculo.id_grupo_prioritario);
            if (!ids.length) return [];

            const { data, error } = await supabase
                .from('grupo_prioritario')
                .select('id, condicao, tipo')
                .in('id', ids)
                .order('condicao');

            if (error) throw error;
            return data ?? [];
        }
    }

    async setForPessoa(idPessoa: number, prioridadeIds: number[], db: Queryable = this.db): Promise<Prioridade[]> {
        const uniqueIds = [...new Set(prioridadeIds.filter((id) => Number.isInteger(id) && id > 0))];

        try {
            await db.query('DELETE FROM pessoa_grupo_prioritario WHERE id_pessoa = $1', [idPessoa]);
            for (const idGrupo of uniqueIds) {
                await db.query(
                    `
                    INSERT INTO pessoa_grupo_prioritario (id_pessoa, id_grupo_prioritario)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                    `,
                    [idPessoa, idGrupo]
                );
            }
            return this.getByPessoa(idPessoa, db);
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }

            const supabase = getSupabaseDbClient();
            const removed = await supabase
                .from('pessoa_grupo_prioritario')
                .delete()
                .eq('id_pessoa', idPessoa);
            if (removed.error) throw removed.error;

            if (uniqueIds.length) {
                const inserted = await supabase
                    .from('pessoa_grupo_prioritario')
                    .insert(uniqueIds.map((idGrupo) => ({
                        id_pessoa: idPessoa,
                        id_grupo_prioritario: idGrupo
                    })));
                if (inserted.error) throw inserted.error;
            }

            return this.getByPessoa(idPessoa);
        }
    }
}
