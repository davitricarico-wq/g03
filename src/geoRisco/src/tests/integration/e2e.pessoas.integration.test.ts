import request from 'supertest';
import { app } from '../../app';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { uniqueCpf, uniqueSuffix } from './db';
import { ESCOLARIDADES, PARENTESCOS, SITUACOES_OCUPACIONAIS } from '../../models/pessoa.model';

// This test is an end-to-end check that hits the HTTP layer and the DB.
// It creates a person via POST /api/pessoas, verifies the GET and then removes it using the repository.

describe('E2E Pessoas (HTTP + DB)', () => {
    it('POST /api/pessoas cria pessoa e GET /api/pessoas/:id a recupera', async () => {
        const cpf = uniqueCpf();
        const payload = {
            nome: uniqueSuffix('E2E Pessoa'),
            cpf,
            dataDeNascimento: '1990-01-01',
            parentesco: PARENTESCOS[5],
            situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
            escolaridade: ESCOLARIDADES[0],
            cronico: false,
            medicacao: false
        };

        const res = await request(app).post('/api/pessoas').send(payload).expect(201);
        expect(res.body).toHaveProperty('id');
        const id = res.body.id as number;

        // GET by id via HTTP
        await request(app).get(`/api/pessoas/${id}`).expect(200).then((r) => {
            expect(r.body).toHaveProperty('id', id);
            expect(r.body).toHaveProperty('cpf', cpf);
        });

        // cleanup via repository
        const repo = new PessoaRepository();
        await repo.delete(id);
    });
});

