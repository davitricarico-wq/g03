import { FamiliaService } from '../services/familia.service';
import { pool } from '../db/connection.ts';
import { HttpError } from '../errors/http-error';

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

describe('FamiliaService - Suíte Completa', () => {
    let service: FamiliaService;
    let familiaRepoMock: any;
    let moradiaRepoMock: any;
    let pessoaRepoMock: any;
    let petRepoMock: any;
    let fotoRepoMock: any;

    beforeEach(() => {
        // jest.clearAllMocks() limpa tanto os repositórios quanto as queries do mockClient
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));

        // Inicialização de todos os mocks dos repositórios
        familiaRepoMock = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            getPessoas: jest.fn(),
            getHistoricoPessoas: jest.fn(),
            getMoradias: jest.fn(),
            getHistoricoMoradias: jest.fn(),
            getFamiliasByMoradia: jest.fn(),
            vincularPessoa: jest.fn(),
            getResponsavelAtivo: jest.fn(),
            removerPessoa: jest.fn(),
            vincularMoradia: jest.fn(),
            removerMoradia: jest.fn(),
        };
        moradiaRepoMock = { getById: jest.fn(), createLocalizacao: jest.fn(), create: jest.fn() };
        pessoaRepoMock = { getById: jest.fn(), getResponsavelByPessoaId: jest.fn(), create: jest.fn(), createResponsavel: jest.fn() };
        petRepoMock = { createForFamilia: jest.fn() };
        fotoRepoMock = { createForPet: jest.fn(), createForMoradia: jest.fn() };

        service = new FamiliaService(familiaRepoMock, moradiaRepoMock, pessoaRepoMock, petRepoMock, fotoRepoMock);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // --- MÉTODOS ADICIONAIS / BÁSICOS ---
    describe('Métodos de leitura e escrita simples', () => {
        it('Deve retornar todas as famílias ao chamar getAll', async () => {
            const familiasMock = [{ id: 1 }, { id: 2 }];
            familiaRepoMock.getAll.mockResolvedValue(familiasMock);
            const res = await service.getAll();
            expect(res).toEqual(familiasMock);
            expect(familiaRepoMock.getAll).toHaveBeenCalled();
        });

        it('Deve lançar 404 se a família não for encontrada em getById', async () => {
            familiaRepoMock.getById.mockResolvedValue(null);
            await expect(service.getById(999)).rejects.toThrow(new HttpError(404, 'Família não encontrada'));
        });

        it('Deve criar uma família com sucesso em cadastrar', async () => {
            familiaRepoMock.create.mockResolvedValue({ id: 5 });
            const res = await service.cadastrar();
            expect(res).toEqual({ id: 5 });
        });

        it('Deve remover uma família existente', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            await service.remover(1);
            expect(familiaRepoMock.delete).toHaveBeenCalledWith(1);
        });

        it('Deve buscar sub-recursos chamando repositório após validar existência', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            familiaRepoMock.getPessoas.mockResolvedValue([{ id: 10 }]);
            familiaRepoMock.getHistoricoPessoas.mockResolvedValue([{ id: 20 }]);
            familiaRepoMock.getMoradias.mockResolvedValue([{ id: 30 }]);
            familiaRepoMock.getHistoricoMoradias.mockResolvedValue([{ id: 40 }]);

            expect(await service.getPessoas(1)).toEqual([{ id: 10 }]);
            expect(await service.getHistoricoPessoas(1)).toEqual([{ id: 20 }]);
            expect(await service.getMoradias(1)).toEqual([{ id: 30 }]);
            expect(await service.getHistoricoMoradias(1)).toEqual([{ id: 40 }]);
        });
    });

    // --- REMOÇÃO DE VÍNCULOS ---
    describe('Remoção de Vínculos (Pessoa / Moradia)', () => {
        it('Deve remover vínculo de pessoa com sucesso ou lançar 404 se não houver vínculo ativo', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            pessoaRepoMock.getById.mockResolvedValueOnce({ id: 2, parentesco: 'Filho' });
            familiaRepoMock.removerPessoa.mockResolvedValueOnce({ id: 10 });

            const res = await service.removerPessoa(1, 2);
            expect(res).toEqual({ id: 10 });

            pessoaRepoMock.getById.mockResolvedValueOnce({ id: 2, parentesco: 'Responsável' });
            familiaRepoMock.removerPessoa.mockResolvedValueOnce({
                idPessoa: 2,
                idFamilia: 1,
                dataEntrada: new Date('2026-01-01T00:00:00.000Z'),
                dataSaida: new Date('2026-06-11T12:00:00.000Z')
            });

            await expect(service.removerPessoa(1, 2)).resolves.toMatchObject({
                idPessoa: 2,
                idFamilia: 1,
                aviso: 'A pessoa removida era responsável da família. Um novo responsável deve ser registrado.'
            });

            pessoaRepoMock.getById.mockResolvedValueOnce({ id: 3, parentesco: 'Filho' });
            familiaRepoMock.removerPessoa.mockResolvedValueOnce(null);
            await expect(service.removerPessoa(1, 3)).rejects.toThrow(new HttpError(404, 'Vínculo pessoa-família ativo não encontrado'));
        });

        it('Deve remover vínculo de moradia com sucesso ou lançar 404 se não houver vínculo ativo', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            familiaRepoMock.removerMoradia.mockResolvedValueOnce({ id: 20 });

            const res = await service.removerMoradia(1, 5);
            expect(res).toEqual({ id: 20 });

            familiaRepoMock.removerMoradia.mockResolvedValueOnce(null);
            await expect(service.removerMoradia(1, 6)).rejects.toThrow(new HttpError(404, 'Vínculo família-moradia ativo não encontrado'));
        });
    });

    // --- VINCULAR MORADIA ---
    describe('vincularMoradia', () => {
        it('Deve vincular moradia com sucesso', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            moradiaRepoMock.getById.mockResolvedValue({ id: 2 });
            familiaRepoMock.getFamiliasByMoradia.mockResolvedValue([]);
            familiaRepoMock.vincularMoradia.mockResolvedValue({ id: 100 });

            const res = await service.vincularMoradia(1, { idMoradia: 2, dataEntrada: undefined, status: 'Atual' });
            expect(res).toEqual({ id: 100 });
        });

        it('Deve lançar 404 se a moradia vinculada não existir', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            moradiaRepoMock.getById.mockResolvedValue(null);

            await expect(service.vincularMoradia(1, { idMoradia: 99 })).rejects.toThrow(new HttpError(404, 'Moradia não encontrada'));
        });
    });

    // --- REGRAS COMPLEXAS DE VÍNCULO DE PESSOA ---
    describe('vincularPessoa (Regras Complexas)', () => {
        it('CT01 - Deve lançar HttpError 409 se a família já possuir um responsável ativo diferente', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            pessoaRepoMock.getById.mockResolvedValue({ id: 2, parentesco: 'Responsável' });
            pessoaRepoMock.getResponsavelByPessoaId.mockResolvedValue({ id: 2 });
            familiaRepoMock.getResponsavelAtivo.mockResolvedValue({ id: 3 });

            await expect(service.vincularPessoa(1, { idPessoa: 2 })).rejects.toThrow(new HttpError(409, 'Familia ja possui responsavel ativo'));
        });

        it('CT02 - Deve lançar HttpError 400 se a pessoa tem parentesco Responsavel mas não existe na tabela responsavel', async () => {
            familiaRepoMock.getById.mockResolvedValue({ id: 1 });
            pessoaRepoMock.getById.mockResolvedValue({ id: 2, parentesco: 'Responsável' });
            pessoaRepoMock.getResponsavelByPessoaId.mockResolvedValue(null);

            await expect(service.vincularPessoa(1, { idPessoa: 2 })).rejects.toThrow(new HttpError(400, 'Pessoa com parentesco Responsavel deve existir na tabela responsavel'));
        });
    });

    // --- OPERAÇÕES TRANSACIONAIS ---
    describe('cadastrarNucleoFamiliar (Transacional)', () => {
        it('Deve executar ROLLBACK e lançar o erro se qualquer inserção falhar no meio do processo', async () => {
            const payload: any = { localizacao: {}, moradia: {}, responsavel: { nome: 'Chefe' } };
            moradiaRepoMock.createLocalizacao.mockResolvedValue({ id: 100 });
            moradiaRepoMock.create.mockRejectedValue(new Error('Erro de banco simulado'));

            await expect(service.cadastrarNucleoFamiliar(payload)).rejects.toThrow('Erro de banco simulado');
            
            expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
            expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
            expect(mockClient.release).toHaveBeenCalled();
        });

        it('Deve cadastrar nucleo familiar completo (moradia, responsavel, dependentes, pets, fotos) com sucesso', async () => {
            const payload: any = {
                localizacao: { cidade: 'Santo André', estado: 'SP', latitude: -23.6, longitude: -46.5 },
                moradia: { tipoConstrucao: 'Alvenaria', usoImovel: 'Residencial', situacaoDeOcupacao: 'Ocupado' },
                responsavel: { nome: 'Chefe', sexo: 'Masculino', raca: 'Branca', estadoCivil: 'Solteiro' },
                dependentes: [
                    { nome: 'Membro 1', dataDeNascimento: new Date('2010-01-01'), parentesco: 'Filho', situacaoOcupacional: 'Estudante', escolaridade: 'Fundamental Incompleto', cronico: false, medicacao: false }
                ],
                pets: [
                    { tipo: 'Cão', nome: 'Bobi', porte: 'Médio', raca: 'Vira-lata', cor: 'Marrom', status: 'Ativo', fotos: [{ url: 'http://pet.jpg' }] }
                ],
                fotos: [
                    { url: 'http://moradia.jpg' }
                ]
            };

            moradiaRepoMock.createLocalizacao.mockResolvedValue({ id: 100 });
            moradiaRepoMock.create.mockResolvedValue({ id: 200 });
            familiaRepoMock.create.mockResolvedValue({ id: 300 });
            pessoaRepoMock.create.mockResolvedValueOnce({ id: 400 }); // responsavel
            pessoaRepoMock.create.mockResolvedValueOnce({ id: 401 }); // dependente
            pessoaRepoMock.createResponsavel.mockResolvedValue({ id: 500, idPessoa: 400 });
            petRepoMock.createForFamilia.mockResolvedValue({ id: 600 });

            const res = await service.cadastrarNucleoFamiliar(payload);

            expect(res.familia.id).toBe(300);
            expect(res.moradia!.id).toBe(200);
            expect(res.responsavel.id).toBe(500);
            expect(res.dependentes).toHaveLength(1);
            expect(res.pets).toHaveLength(1);

            expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
            expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
            expect(mockClient.release).toHaveBeenCalled();
        });
    }); 
});
