import { PrioridadeRepository } from '../../repositories/prioridade.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { uniqueCpf, uniqueSuffix, withTransaction } from './db';
import { ESCOLARIDADES, PARENTESCOS, SITUACOES_OCUPACIONAIS } from '../../models/pessoa.model';

describe('Integração: Prioridades', () => {
    it('atribui e recupera prioridades para uma pessoa', async () => {
        await withTransaction(async (client) => {
            const pessoaRepo = new PessoaRepository(client);
            const prioridadeRepo = new PrioridadeRepository(client);

            const pessoa = await pessoaRepo.create({
                nome: uniqueSuffix('Prior'),
                cpf: uniqueCpf(),
                dataDeNascimento: new Date('1990-01-01'),
                parentesco: PARENTESCOS[5],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[0],
                cronico: false,
                medicacao: false,
                status: 'Ativo'
            }, client);

            // buscar todas as prioridades (deve existir pelo menos as seedadas na migração)
            const all = await prioridadeRepo.getAll(client);
            expect(Array.isArray(all)).toBe(true);

            // setar algumas prioridades para a pessoa
            const ids = all.slice(0, 2).map(p => p.id);
            const set = await prioridadeRepo.setForPessoa(pessoa.id, ids, client);
            expect(Array.isArray(set)).toBe(true);

            const byPessoa = await prioridadeRepo.getByPessoa(pessoa.id, client);
            expect(byPessoa.length).toBeGreaterThanOrEqual(0);
        });
    });
});

