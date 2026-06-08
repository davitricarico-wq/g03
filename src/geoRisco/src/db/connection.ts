import 'dotenv/config';
import { Pool } from 'pg';


if (!process.env.DATABASE_URL) {
    throw new Error('Faltam a variável de ambiente DATABASE_URL.');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
