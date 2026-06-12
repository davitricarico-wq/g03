import { PessoaService } from '../services/pessoa.service';
import { pool } from '../db/connection';
import { HttpError } from '../errors/http-error';
import { ESCOLARIDADES, PARENTESCOS, SITUACOES_OCUPACIONAIS } from '../models/pessoa.model';

// Mocking de dependências globais do arquivo
jest.mock('../db/connection.ts', () => ({
    pool: {
        connect: jest.fn(),
    },
}));
jest.mock('../validations/familia.validation');

// Definição do Mock Client local para testes transacionais
const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
};

// Vincula o pool mockado para resolver sempre com o nosso mockClient local
(pool.connect as jest.Mock).mockResolvedValue(mockClient);


describe('PessoaService - Suíte Completa', () => {
    let service: PessoaService;
    let repoMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        repoMock = {
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
        service = new PessoaService(repoMock);
    });

    describe('Métodos de leitura e escrita simples', () => {
        it('Deve retornar todas as pessoas, inativas e responsáveis', async () => {
            repoMock.getAll.mockResolvedValue([{ id: 1 }]);
            repoMock.getInativas.mockResolvedValue([{ id: 2 }]);
            repoMock.getAllResponsaveis.mockResolvedValue([{ id: 3 }]);

            expect(await service.getAll()).toEqual([{ id: 1 }]);
            expect(await service.getInativas()).toEqual([{ id: 2 }]);
            expect(await service.getAllResponsaveis()).toEqual([{ id: 3 }]);
        });

        it('Deve cadastrar uma pessoa limpando strings de entrada', async () => {
            const dto = {
                nome: '   José Mário  ',
                cpf: '123',
                dataDeNascimento: new Date('2000-01-01'), // Uma data retroativa válida
                parentesco: PARENTESCOS[0], // Importe o array PARENTESCOS ou use um valor válido ex: 'Outros'
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0], // Use um valor válido do seu enum/type
                escolaridade: ESCOLARIDADES[0], // Use um valor válido do seu enum/type
                cronico: false,
                medicacao: false
            };

            // Ajuste o mock do retorno para refletir o que o seu repositório realmente devolve
            repoMock.create.mockResolvedValue({ id: 1, nome: 'José Mário' });

            const res = await service.cadastrar(dto as any);
            expect(res.nome).toBe('José Mário');

            // Certifique-se de que o toHaveBeenCalledWith espere os campos adicionais válidos que você enviou no DTO
            expect(repoMock.create).toHaveBeenCalledWith(
                expect.objectContaining({ nome: 'José Mário', cpf: '123' })
            );
        });

        it('Deve atualizar os dados de uma pessoa ou lançar 404', async () => {
            repoMock.update.mockResolvedValueOnce({ id: 1 });
            expect(await service.atualizar(1, {})).toEqual({ id: 1 });

            repoMock.update.mockResolvedValueOnce(null);
            await expect(service.atualizar(2, {})).rejects.toThrow(new HttpError(404, 'Pessoa não encontrada'));
        });

        it('Deve buscar o registro de responsável por ID de pessoa ou lançar 404', async () => {
            repoMock.getResponsavelByPessoaId.mockResolvedValueOnce({ id: 10 });
            expect(await service.getResponsavelByPessoaId(1)).toEqual({ id: 10 });

            repoMock.getResponsavelByPessoaId.mockResolvedValueOnce(null);
            await expect(service.getResponsavelByPessoaId(2)).rejects.toThrow(new HttpError(404, 'Responsável não encontrado'));
        });

        it('Deve remover um responsável através de cascade implícito', async () => {
            repoMock.getResponsavelByPessoaId.mockResolvedValue({ id: 10 });
            await service.removerResponsavel(1);
            expect(repoMock.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('buscar (Filtros e Validações)', () => {
        it('CT03 - Deve lançar HttpError 400 se nenhum filtro válido for fornecido após higienização', async () => {
            await expect(service.buscar({ nome: '   ', cpf: '---' })).rejects.toThrow(new HttpError(400, 'Informe ao menos um filtro de busca'));
        });

        it('CT04 - Deve lançar HttpError 400 se o escopo de busca for inválido', async () => {
            await expect(service.buscar({ nome: 'Carlos', escopo: 'invalid_scope' as any })).rejects.toThrow(new HttpError(400, 'Escopo de busca invalido'));
        });
    });

    describe('Métodos Transacionais Complexos de Responsável', () => {
        it('Deve cadastrar uma pessoa e promovê-la a responsável em transação', async () => {
            const dto = {
                nome: 'Chefe',
                sexo: 'Masculino',
                raca: 'Branca',
                estadoCivil: 'Solteiro',
                veiculo: true,
                dataDeNascimento: new Date('1995-03-10'),
                parentesco: PARENTESCOS[0],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[4],
                cronico: false,
                medicacao: false
            };
            repoMock.create.mockResolvedValue({ id: 50 });
            repoMock.createResponsavel.mockResolvedValue({ id: 100, idPessoa: 50 });

            const res = await service.cadastrarResponsavel(dto as any);
            expect(res.id).toBe(100);
            expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        });

        it('Deve atualizar pessoa e sua extensão de responsabilidade de forma atômica', async () => {
            repoMock.update.mockResolvedValue({});
            repoMock.updateResponsavel.mockResolvedValue({ id: 99 });

            const res = await service.atualizarResponsavel(1, {});
            expect(res).toEqual({ id: 99 });
            expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        });

        it('Deve lançar 404 e efetuar ROLLBACK se o responsável sumir na atualização', async () => {
            repoMock.update.mockResolvedValue({});
            repoMock.updateResponsavel.mockResolvedValue(null);

            await expect(service.atualizarResponsavel(1, {})).rejects.toThrow(new HttpError(404, 'Responsável não encontrado'));
            expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
        });
    });
});