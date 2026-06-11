import { pool } from '../db/connection';
import type { IPessoaRepository } from '../interfaces/repositories/pessoa.repository.interface';
import type { CreatePessoaDto, CreateResponsavelDto } from '../dtos/pessoa.dto';
import type { Pessoa, Responsavel } from '../models/pessoa.model';
import { ESCOLARIDADES, ESTADOS_CIVIS, PARENTESCOS, RACAS, SEXOS } from '../models/pessoa.model';
import { PessoaService } from './pessoa.service';

const dataNascimento = new Date('1985-03-20T00:00:00.000Z');

function pessoa(overrides: Partial<Pessoa> = {}): Pessoa {
    return {
        id: 1,
        nome: 'Ana Silva',
        nomeSocial: null,
        dataDeNascimento: dataNascimento,
        parentesco: PARENTESCOS[5],
        situacaoOcupacional: 'Empregado',
        escolaridade: ESCOLARIDADES[4],
        cronico: false,
        medicacao: false,
        status: 'Ativo',
        deletedAt: null,
        ...overrides
    };
}

function responsavel(overrides: Partial<Responsavel> = {}): Responsavel {
    return {
        ...pessoa({ parentesco: PARENTESCOS[0] }),
        cpf: '12345678901',
        nis: null,
        renda: null,
        sexo: SEXOS[1],
        raca: RACAS[2],
        estadoCivil: ESTADOS_CIVIS[0],
        veiculo: false,
        programaSocial: false,
        email: null,
        telefone: null,
        nomeDoPai: null,
        nomeDaMae: null,
        localDeNascimento: null,
        dataResidenciaEstado: null,
        dataResidenciaMoradia: null,
        ...overrides
    } as Responsavel;
}

function createPessoaDto(overrides: Partial<CreatePessoaDto> = {}): CreatePessoaDto {
    return {
        nome: ' Ana Silva ',
        nomeSocial: undefined,
        dataDeNascimento: dataNascimento,
        parentesco: PARENTESCOS[5],
        situacaoOcupacional: 'Empregado',
        escolaridade: ESCOLARIDADES[4],
        cronico: false,
        medicacao: false,
        ...overrides
    };
}

function createResponsavelDto(overrides: Partial<CreateResponsavelDto> = {}): CreateResponsavelDto {
    return {
        ...createPessoaDto({ parentesco: PARENTESCOS[0] }),
        sexo: SEXOS[1],
        raca: RACAS[2],
        estadoCivil: ESTADOS_CIVIS[0],
        ...overrides
    } as CreateResponsavelDto;
}

function repo(): jest.Mocked<IPessoaRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getInativas: jest.fn(),
        search: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAllResponsaveis: jest.fn(),
        getResponsavelByPessoaId: jest.fn(),
        createResponsavel: jest.fn(),
        updateResponsavel: jest.fn()
    };
}

function mockClient() {
    return {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn()
    };
}

describe('PessoaService - testes unitarios de Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('CT01 -> RN01 - cadastra pessoa valida e normaliza campos obrigatorios', async () => {
        const repository = repo();
        const created = pessoa({ nome: 'Ana Silva' });
        repository.create.mockResolvedValue(created);
        const service = new PessoaService(repository);

        const result = await service.cadastrar(createPessoaDto());

        expect(result).toBe(created);
        expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Ana Silva',
            nomeSocial: null,
            status: 'Ativo'
        }));
    });

    it('CT01 -> RN01 - falha sem nome e nao chama repositorio', async () => {
        const repository = repo();
        const service = new PessoaService(repository);

        await expect(service.cadastrar(createPessoaDto({ nome: '' }))).rejects.toMatchObject({ statusCode: 400 });

        expect(repository.create).not.toHaveBeenCalled();
    });

    it('normaliza busca e exige ao menos um filtro', async () => {
        const repository = repo();
        repository.search.mockResolvedValue([]);
        const service = new PessoaService(repository);

        await service.buscar({ nome: ' Maria ', cpf: '123.456.789-01', telefone: '(11) 99999-0000' });

        expect(repository.search).toHaveBeenCalledWith({
            nome: 'Maria',
            cpf: '12345678901',
            email: undefined,
            telefone: '11999990000',
            escopo: 'ativas'
        });
        await expect(service.buscar({})).rejects.toMatchObject({ statusCode: 400 });
        await expect(service.buscar({ nome: 'Ana', escopo: 'arquivadas' as never })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('retorna 404 quando pessoa ou responsavel nao existe', async () => {
        const repository = repo();
        repository.getById.mockResolvedValue(null);
        repository.getResponsavelByPessoaId.mockResolvedValue(null);
        const service = new PessoaService(repository);

        await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.getResponsavelByPessoaId(99)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('atualiza, remove e lista sem depender de banco real', async () => {
        const repository = repo();
        repository.getAll.mockResolvedValue([pessoa()]);
        repository.getInativas.mockResolvedValue([]);
        repository.update.mockResolvedValue(pessoa({ nome: 'Ana Atualizada' }));
        repository.getById.mockResolvedValue(pessoa());
        const service = new PessoaService(repository);

        await expect(service.getAll()).resolves.toHaveLength(1);
        await expect(service.getInativas()).resolves.toEqual([]);
        await expect(service.atualizar(1, { nome: 'Ana Atualizada' })).resolves.toMatchObject({ nome: 'Ana Atualizada' });
        await service.remover(1);

        expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('cria responsavel em transacao e aplica valores padrao', async () => {
        const repository = repo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        repository.create.mockResolvedValue(pessoa({ id: 7, parentesco: PARENTESCOS[0] }));
        repository.createResponsavel.mockResolvedValue(responsavel({ id: 7 }));
        const service = new PessoaService(repository);

        await expect(service.cadastrarResponsavel(createResponsavelDto())).resolves.toMatchObject({ id: 7 });

        expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN');
        expect(repository.createResponsavel).toHaveBeenCalledWith(expect.objectContaining({
            idPessoa: 7,
            veiculo: false,
            programaSocial: false
        }), client);
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(client.release).toHaveBeenCalled();
    });

    it('faz rollback quando atualizacao de responsavel nao encontra registro', async () => {
        const repository = repo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        repository.update.mockResolvedValue(pessoa());
        repository.updateResponsavel.mockResolvedValue(null);
        const service = new PessoaService(repository);

        await expect(service.atualizarResponsavel(1, { sexo: SEXOS[1] })).rejects.toMatchObject({ statusCode: 404 });

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });
});
