import 'dotenv/config';
import { Pool } from 'pg';


if (!process.env.DATABASE_URL) {
    throw new Error('Faltam a variável de ambiente DATABASE_URL.');
}

// SSL é exigido pelo Postgres do Supabase. Liga automaticamente em produção
// (Vercel define NODE_ENV=production); pode forçar com PGSSL=true/false.
// Em CI/local (Postgres sem SSL) fica desligado.
const useSsl =
    process.env.PGSSL === 'true' ||
    (process.env.PGSSL !== 'false' && process.env.NODE_ENV === 'production');

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Serverless abre muitas instâncias; mantenha o pool pequeno e use o
    // Transaction Pooler do Supabase (porta 6543) no DATABASE_URL de produção.
    max: Number(process.env.PG_POOL_MAX ?? 10),
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});
