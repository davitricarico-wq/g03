import 'dotenv/config';
import type { CreatePessoaDto } from '../dtos/pessoa.dto';

describe('Persistencia de Pessoa (DB)', () => {
    const hasDatabase = Boolean(process.env.DATABASE_URL) && process.env.RUN_DB_TESTS === 'true';

    if (!hasDatabase) {
        console.info('[TESTE] Persistencia DB ignorada: defina RUN_DB_TESTS=true e DATABASE_URL para rodar.');
    }

    const describeDb = hasDatabase ? describe : describe.skip;

    describeDb('RN01 - Identificacao base obrigatoria', () => {
        let pool: import('pg').Pool;
        let PessoaRepository: typeof import('../repositories/pessoa.repository').PessoaRepository;
        let PessoaService: typeof import('../services/pessoa.service').PessoaService;

        beforeAll(async () => {
            const { pool: dbPool } = await import('../db/connection');
            pool = dbPool;
            PessoaRepository = (await import('../repositories/pessoa.repository')).PessoaRepository;
            PessoaService = (await import('../services/pessoa.service')).PessoaService;

            const res = await pool.query("SELECT to_regclass('public.pessoa') AS pessoa");
            if (!res.rows[0].pessoa) {
                throw new Error('Tabela pessoa ausente. Execute as migracoes antes dos testes.');
            }
        });

        beforeEach(async () => {
            await pool.query('TRUNCATE pessoa RESTART IDENTITY CASCADE');
        });

        afterAll(async () => {
            await pool.end();
        });

        it('nao persiste quando falta nome ou data de nascimento', async () => {
            const service = new PessoaService(new PessoaRepository());
            const before = await pool.query('SELECT COUNT(*)::int AS total FROM pessoa');

            const payload = {
                nome: '',
                nomeSocial: null,
                parentesco: 'Responsável',
                medicacao: false,
                status: 'Ativo',
                escolaridade: 'Médio Completo',
                cronico: false,
                situacaoOcupacional: 'Empregado',
                dataDeNascimento: null
            } as unknown as CreatePessoaDto;

            await expect(service.cadastrar(payload)).rejects.toThrow('Nome é obrigatório');

            const after = await pool.query('SELECT COUNT(*)::int AS total FROM pessoa');
            expect(after.rows[0].total).toBe(before.rows[0].total);
        });
    });
});
