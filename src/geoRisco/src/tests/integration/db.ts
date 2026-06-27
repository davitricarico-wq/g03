import type { PoolClient } from 'pg';
import { pool } from '../../db/connection.ts';

let counter = 0;

export function uniqueSuffix(prefix = 'it') {
    counter += 1;
    return `${prefix}-${Date.now()}-${process.pid}-${counter}`;
}

export function uniqueCpf() {
    const seed = `${Date.now()}${process.pid}${counter}`.replace(/\D/g, '');
    return seed.padStart(11, '0').slice(-11);
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        return await fn(client);
    } finally {
        try {
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }
}

