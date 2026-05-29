import fs from 'fs';
import path from 'path';
import { pool } from './connection.ts';

async function migrate() {
    const dir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.sql')).sort();
    for (const file of files) {
        const filePath = path.join(dir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log(`Executando migração: ${file}`);
        await pool.query(sql);
    }
    await pool.end();
    console.log('Migrações concluídas com sucesso!');
}

migrate().catch(err => {
    console.error('Erro ao executar migrações:', err);
    process.exit(1);
});
