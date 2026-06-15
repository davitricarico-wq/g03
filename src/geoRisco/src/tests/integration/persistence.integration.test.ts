import { FamiliaRepository } from '../../repositories/familia.repository';
import { MoradiaRepository } from '../../repositories/moradia.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import type { CreateResponsavelRepositoryRequest } from '../../interfaces/repositories/pessoa.repository.interface';
import {
    ESCOLARIDADES,
    ESTADOS_CIVIS,
    PARENTESCOS,
    RACAS,
    SEXOS,
    SITUACOES_OCUPACIONAIS
} from '../../models/pessoa.model';
import { SITUACOES_OCUPACAO_MORADIA, TIPOS_CONSTRUCAO, USOS_IMOVEL } from '../../models/moradia.model';
import { uniqueCpf, uniqueSuffix, withTransaction } from './db';

describe('Integração com banco real', () => {
    it('persiste, consulta e atualiza pessoas de verdade', async () => {
        await withTransaction(async (client) => {
            const pessoaRepo = new PessoaRepository(client);
            const nomeBase = uniqueSuffix('Pessoa');
            const cpf = uniqueCpf();

            const pessoa = await pessoaRepo.create({
                nome: nomeBase,
                cpf,
                dataDeNascimento: new Date('1990-01-01'),
                parentesco: PARENTESCOS[5],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[0],
                cronico: false,
                medicacao: false,
                status: 'Ativo'
            }, client);

            expect(pessoa.id).toBeGreaterThan(0);

            const encontrada = await pessoaRepo.getById(pessoa.id, client);
            expect(encontrada).not.toBeNull();
            expect(encontrada?.cpf).toBe(cpf);

            const busca = await pessoaRepo.search({ nome: nomeBase, escopo: 'ativas' }, client);
            expect(busca.some((row) => row.id === pessoa.id)).toBe(true);

            const atualizada = await pessoaRepo.update(pessoa.id, { status: 'Inativo' }, client);
            expect(atualizada?.status).toBe('Inativo');

            const inativas = await pessoaRepo.getInativas(client);
            expect(inativas.some((row) => row.id === pessoa.id)).toBe(true);
        });
    });

    it('persiste família, moradia e vínculos reais com rollback ao final', async () => {
        await withTransaction(async (client) => {
            const pessoaRepo = new PessoaRepository(client);
            const familiaRepo = new FamiliaRepository(client);
            const moradiaRepo = new MoradiaRepository(client);

            const pessoa = await pessoaRepo.create({
                nome: uniqueSuffix('Membro'),
                cpf: uniqueCpf(),
                dataDeNascimento: new Date('1995-03-10'),
                parentesco: PARENTESCOS[5],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[4],
                cronico: false,
                medicacao: false,
                status: 'Ativo'
            }, client);

            const familia = await familiaRepo.create(client);
            const vinculoPessoa = await familiaRepo.vincularPessoa(familia.id, pessoa.id, null, client);
            expect(vinculoPessoa).toMatchObject({ idPessoa: pessoa.id, idFamilia: familia.id });

            const pessoasDaFamilia = await familiaRepo.getPessoas(familia.id, client);
            expect(pessoasDaFamilia.some((row) => row.id === pessoa.id)).toBe(true);

            const localizacao = await moradiaRepo.createLocalizacao({
                cidade: 'Santo André',
                estado: 'SP',
                latitude: -23.6733,
                longitude: -46.5431
            }, client);

            const moradia = await moradiaRepo.create({
                idLocalizacao: localizacao.id,
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                dataRegistro: new Date('2026-06-15'),
                status: 'Ativa',
                usoImovel: USOS_IMOVEL[0],
                pavimentos: 1,
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0],
                descricao: null
            }, client);

            expect(moradia.id).toBeGreaterThan(0);

            const vinculoMoradia = await familiaRepo.vincularMoradia(familia.id, moradia.id, null, 'Atual', client);
            expect(vinculoMoradia).toMatchObject({ idFamilia: familia.id, idMoradia: moradia.id, status: 'Atual' });

            const moradiasDaFamilia = await familiaRepo.getMoradias(familia.id, client);
            expect(moradiasDaFamilia.some((row) => row.id === moradia.id)).toBe(true);

            const detalhesPessoa = await pessoaRepo.getResponsavelByPessoaId(pessoa.id, client);
            expect(detalhesPessoa).toBeNull();

            const familias = await familiaRepo.getById(familia.id, client);
            expect(familias).not.toBeNull();
        });
    });

    it('persiste um responsável real e recupera pela tabela/view', async () => {
        await withTransaction(async (client) => {
            const pessoaRepo = new PessoaRepository(client);
            const pessoa = await pessoaRepo.create({
                nome: uniqueSuffix('Responsavel'),
                cpf: uniqueCpf(),
                dataDeNascimento: new Date('1987-08-21'),
                parentesco: PARENTESCOS[0],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[4],
                cronico: false,
                medicacao: false,
                status: 'Ativo'
            }, client);

            const responsavelPayload: CreateResponsavelRepositoryRequest = {
                idPessoa: pessoa.id,
                nome: pessoa.nome,
                dataDeNascimento: pessoa.dataDeNascimento,
                parentesco: pessoa.parentesco,
                situacaoOcupacional: pessoa.situacaoOcupacional,
                escolaridade: pessoa.escolaridade,
                cronico: pessoa.cronico,
                medicacao: pessoa.medicacao,
                status: pessoa.status,
                sexo: SEXOS[0],
                raca: RACAS[0],
                estadoCivil: ESTADOS_CIVIS[0],
                nis: null,
                renda: 1500,
                veiculo: false,
                programaSocial: false,
                email: null,
                telefone: null,
                nomeDoPai: null,
                nomeDaMae: null,
                localDeNascimento: null,
                dataResidenciaEstado: null,
                dataResidenciaMoradia: null
            };

            const responsavel = await pessoaRepo.createResponsavel(responsavelPayload, client);

            expect(responsavel).not.toBeNull();
            const encontrado = await pessoaRepo.getResponsavelByPessoaId(pessoa.id, client);
            expect(encontrado).not.toBeNull();
            expect(encontrado?.id).toBe(pessoa.id);
        });
    });
});
