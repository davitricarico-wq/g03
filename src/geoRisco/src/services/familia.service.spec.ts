import { pool } from '../db/connection';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { IPessoaRepository } from '../interfaces/repositories/pessoa.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import { ESCOLARIDADES, ESTADOS_CIVIS, PARENTESCOS, RACAS, SEXOS } from '../models/pessoa.model';
import { SITUACOES_OCUPACAO_MORADIA, TIPOS_CONSTRUCAO, USOS_IMOVEL } from '../models/moradia.model';
import { STATUS_PET, TIPOS_PET } from '../models/pet.model';
import { FamiliaService } from './familia.service';

function familiaRepo(): jest.Mocked<IFamiliaRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        vincularPessoa: jest.fn(),
        removerPessoa: jest.fn(),
        getPessoas: jest.fn(),
        getHistoricoPessoas: jest.fn(),
        getResponsavelAtivo: jest.fn(),
        vincularMoradia: jest.fn(),
        removerMoradia: jest.fn(),
        getMoradias: jest.fn(),
        getHistoricoMoradias: jest.fn(),
        getFamiliasByMoradia: jest.fn(),
        getHistoricoFamiliasByMoradia: jest.fn(),
        getPets: jest.fn()
    };
}

function moradiaRepo(): jest.Mocked<IMoradiaRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        createLocalizacao: jest.fn(),
        updateLocalizacao: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };
}

function pessoaRepo(): jest.Mocked<IPessoaRepository> {
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

function petRepo(): jest.Mocked<IPetRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getByFamilia: jest.fn(),
        create: jest.fn(),
        createForFamilia: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };
}

function fotoRepo(): jest.Mocked<IFotoRepository> {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getByMoradia: jest.fn(),
        getByPet: jest.fn(),
        create: jest.fn(),
        createForMoradia: jest.fn(),
        createForPet: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };
}

function mockClient() {
    return {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn()
    };
}

describe('FamiliaService - testes unitarios de Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('CT03 -> RN03 - remove familia existente por soft delete no repositorio', async () => {
        const familias = familiaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        const service = new FamiliaService(familias, moradiaRepo(), pessoaRepo(), petRepo(), fotoRepo());

        await service.remover(1);

        expect(familias.delete).toHaveBeenCalledWith(1);
    });

    it('lista, cadastra e consulta familia com falha 404 quando ausente', async () => {
        const familias = familiaRepo();
        familias.getAll.mockResolvedValue([{ id: 1, deletedAt: null }]);
        familias.create.mockResolvedValue({ id: 2, deletedAt: null });
        familias.getById.mockResolvedValueOnce({ id: 1, deletedAt: null }).mockResolvedValueOnce(null);
        const service = new FamiliaService(familias, moradiaRepo(), pessoaRepo(), petRepo(), fotoRepo());

        await expect(service.getAll()).resolves.toEqual([{ id: 1, deletedAt: null }]);
        await expect(service.cadastrar()).resolves.toEqual({ id: 2, deletedAt: null });
        await expect(service.getById(1)).resolves.toEqual({ id: 1, deletedAt: null });
        await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('consulta pessoas e moradias da familia existente', async () => {
        const familias = familiaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        familias.getPessoas.mockResolvedValue([]);
        familias.getHistoricoPessoas.mockResolvedValue([]);
        familias.getMoradias.mockResolvedValue([]);
        familias.getHistoricoMoradias.mockResolvedValue([]);
        const service = new FamiliaService(familias, moradiaRepo(), pessoaRepo(), petRepo(), fotoRepo());

        await expect(service.getPessoas(1)).resolves.toEqual([]);
        await expect(service.getHistoricoPessoas(1)).resolves.toEqual([]);
        await expect(service.getMoradias(1)).resolves.toEqual([]);
        await expect(service.getHistoricoMoradias(1)).resolves.toEqual([]);
    });

    it('CT03 -> RN03 - falha ao remover ou consultar vinculo inexistente', async () => {
        const familias = familiaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        familias.removerPessoa.mockResolvedValue(null);
        familias.removerMoradia.mockResolvedValue(null);
        const service = new FamiliaService(familias, moradiaRepo(), pessoaRepo(), petRepo(), fotoRepo());

        await expect(service.removerPessoa(1, 9)).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.removerMoradia(1, 9)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('vincula responsavel somente quando registro de responsavel existe e nao ha conflito', async () => {
        const familias = familiaRepo();
        const pessoas = pessoaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        familias.getResponsavelAtivo.mockResolvedValue(null);
        familias.vincularPessoa.mockResolvedValue({
            idFamilia: 1,
            idPessoa: 2,
            dataEntrada: new Date('2026-01-01T00:00:00.000Z'),
            dataSaida: null
        });
        pessoas.getById.mockResolvedValue({
            id: 2,
            nome: 'Ana',
            nomeSocial: null,
            dataDeNascimento: new Date('1980-01-01T00:00:00.000Z'),
            parentesco: PARENTESCOS[0],
            situacaoOcupacional: 'Empregado',
            escolaridade: ESCOLARIDADES[4],
            cronico: false,
            medicacao: false,
            status: 'Ativo',
            deletedAt: null
        });
        pessoas.getResponsavelByPessoaId.mockResolvedValue({ id: 2 } as never);
        const service = new FamiliaService(familias, moradiaRepo(), pessoas, petRepo(), fotoRepo());

        await expect(service.vincularPessoa(1, { idPessoa: 2 })).resolves.toMatchObject({ idPessoa: 2 });
    });

    it('vincula pessoa nao responsavel e falha quando pessoa nao existe', async () => {
        const familias = familiaRepo();
        const pessoas = pessoaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        pessoas.getById.mockResolvedValueOnce({
            id: 2,
            nome: 'Bia',
            nomeSocial: null,
            dataDeNascimento: new Date('2010-01-01T00:00:00.000Z'),
            parentesco: PARENTESCOS[2],
            situacaoOcupacional: 'Estudante',
            escolaridade: ESCOLARIDADES[2],
            cronico: false,
            medicacao: false,
            status: 'Ativo',
            deletedAt: null
        }).mockResolvedValueOnce(null);
        familias.vincularPessoa.mockResolvedValue({
            idFamilia: 1,
            idPessoa: 2,
            dataEntrada: new Date('2026-01-01T00:00:00.000Z'),
            dataSaida: null
        });
        const service = new FamiliaService(familias, moradiaRepo(), pessoas, petRepo(), fotoRepo());

        await expect(service.vincularPessoa(1, { idPessoa: 2 })).resolves.toMatchObject({ idPessoa: 2 });
        await expect(service.vincularPessoa(1, { idPessoa: 99 })).rejects.toMatchObject({ statusCode: 404 });
    });

    it('bloqueia responsavel sem registro ou familia ja com outro responsavel', async () => {
        const familias = familiaRepo();
        const pessoas = pessoaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        pessoas.getById.mockResolvedValue({
            id: 2,
            nome: 'Ana',
            nomeSocial: null,
            dataDeNascimento: new Date('1980-01-01T00:00:00.000Z'),
            parentesco: PARENTESCOS[0],
            situacaoOcupacional: 'Empregado',
            escolaridade: ESCOLARIDADES[4],
            cronico: false,
            medicacao: false,
            status: 'Ativo',
            deletedAt: null
        });
        pessoas.getResponsavelByPessoaId.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 2 } as never);
        familias.getResponsavelAtivo.mockResolvedValue({ id: 3 } as never);
        const service = new FamiliaService(familias, moradiaRepo(), pessoas, petRepo(), fotoRepo());

        await expect(service.vincularPessoa(1, { idPessoa: 2 })).rejects.toMatchObject({ statusCode: 400 });
        await expect(service.vincularPessoa(1, { idPessoa: 2 })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('vincula moradia existente e falha quando moradia nao existe', async () => {
        const familias = familiaRepo();
        const moradias = moradiaRepo();
        familias.getById.mockResolvedValue({ id: 1, deletedAt: null });
        moradias.getById.mockResolvedValueOnce({
            id: 20,
            idLocalizacao: 10,
            tipoConstrucao: TIPOS_CONSTRUCAO[0],
            dataRegistro: null,
            status: 'Ativa',
            usoImovel: USOS_IMOVEL[0],
            pavimentos: 1,
            situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0],
            descricao: null,
            deletedAt: null,
            localizacao: {
                id: 10,
                logradouro: null,
                numero: null,
                bairro: null,
                cidade: 'Santo Andre',
                estado: 'SP',
                cep: null,
                latitude: -23,
                longitude: -46,
                referencia: null,
                complemento: null
            }
        }).mockResolvedValueOnce(null);
        familias.vincularMoradia.mockResolvedValue({
            idFamilia: 1,
            idMoradia: 20,
            dataEntrada: new Date('2026-01-01T00:00:00.000Z'),
            dataSaida: null,
            status: 'Atual'
        });
        const service = new FamiliaService(familias, moradias, pessoaRepo(), petRepo(), fotoRepo());

        await expect(service.vincularMoradia(1, { idMoradia: 20, status: 'Atual' })).resolves.toMatchObject({
            idMoradia: 20
        });
        await expect(service.vincularMoradia(1, { idMoradia: 99 })).rejects.toMatchObject({ statusCode: 404 });
    });

    it('cadastra nucleo familiar completo em transacao', async () => {
        const familias = familiaRepo();
        const moradias = moradiaRepo();
        const pessoas = pessoaRepo();
        const pets = petRepo();
        const fotos = fotoRepo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        moradias.createLocalizacao.mockResolvedValue({
            id: 10,
            logradouro: null,
            numero: null,
            bairro: null,
            cidade: 'Santo Andre',
            estado: 'SP',
            cep: null,
            latitude: -23,
            longitude: -46,
            referencia: null,
            complemento: null
        });
        moradias.create.mockResolvedValue({
            id: 20,
            idLocalizacao: 10,
            tipoConstrucao: TIPOS_CONSTRUCAO[0],
            dataRegistro: null,
            status: 'Ativa',
            usoImovel: USOS_IMOVEL[0],
            pavimentos: 1,
            situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0],
            descricao: null,
            deletedAt: null
        });
        familias.create.mockResolvedValue({ id: 30, deletedAt: null });
        familias.vincularMoradia.mockResolvedValue({ idFamilia: 30, idMoradia: 20, dataEntrada: new Date(), dataSaida: null, status: null });
        familias.vincularPessoa.mockResolvedValue({ idFamilia: 30, idPessoa: 40, dataEntrada: new Date(), dataSaida: null });
        pessoas.create.mockResolvedValue({
            id: 40,
            nome: 'Ana',
            nomeSocial: null,
            dataDeNascimento: new Date('1980-01-01T00:00:00.000Z'),
            parentesco: PARENTESCOS[0],
            situacaoOcupacional: 'Empregado',
            escolaridade: ESCOLARIDADES[4],
            cronico: false,
            medicacao: false,
            status: 'Ativo',
            deletedAt: null
        });
        pessoas.createResponsavel.mockResolvedValue({ id: 40, cpf: null } as never);
        pets.createForFamilia.mockResolvedValue({
            id: 50,
            idFamilia: 30,
            tipo: TIPOS_PET[0],
            nome: 'Rex',
            porte: 'Medio',
            raca: 'SRD',
            cor: 'Caramelo',
            status: STATUS_PET[0],
            observacao: null
        });
        fotos.createForPet.mockResolvedValue({ id: 60, idMoradia: null, idPet: 50, url: 'pets/50/foto.jpg' });
        fotos.createForMoradia.mockResolvedValue({ id: 61, idMoradia: 20, idPet: null, url: 'moradias/20/foto.jpg' });
        const service = new FamiliaService(familias, moradias, pessoas, pets, fotos);

        await expect(service.cadastrarNucleoFamiliar({
            localizacao: { cidade: 'Santo Andre', estado: 'SP', latitude: -23, longitude: -46 },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            },
            responsavel: {
                nome: 'Ana',
                dataDeNascimento: new Date('1980-01-01T00:00:00.000Z'),
                parentesco: PARENTESCOS[0],
                situacaoOcupacional: 'Empregado',
                escolaridade: ESCOLARIDADES[4],
                cronico: false,
                medicacao: false,
                sexo: SEXOS[1],
                raca: RACAS[2],
                estadoCivil: ESTADOS_CIVIS[0]
            },
            pets: [{
                tipo: TIPOS_PET[0],
                nome: 'Rex',
                porte: 'Medio',
                raca: 'SRD',
                cor: 'Caramelo',
                status: STATUS_PET[0],
                fotos: [{ url: 'pets/50/foto.jpg' }]
            }],
            fotos: [{ url: 'moradias/20/foto.jpg' }]
        })).resolves.toMatchObject({
            moradia: { id: 20 },
            familia: { id: 30 },
            pets: [{ id: 50 }],
            fotos: [{ id: 60 }, { id: 61 }]
        });

        expect(client.query).toHaveBeenCalledWith('COMMIT');
    });

    it('faz rollback quando cadastro de nucleo familiar falha durante transacao', async () => {
        const familias = familiaRepo();
        const moradias = moradiaRepo();
        const pessoas = pessoaRepo();
        const client = mockClient();
        jest.spyOn(pool, 'connect').mockResolvedValue(client as never);
        moradias.createLocalizacao.mockResolvedValue({
            id: 10,
            logradouro: null,
            numero: null,
            bairro: null,
            cidade: 'Santo Andre',
            estado: 'SP',
            cep: null,
            latitude: -23,
            longitude: -46,
            referencia: null,
            complemento: null
        });
        moradias.create.mockRejectedValue(new Error('falha'));
        const service = new FamiliaService(familias, moradias, pessoas, petRepo(), fotoRepo());

        await expect(service.cadastrarNucleoFamiliar({
            localizacao: { cidade: 'Santo Andre', estado: 'SP', latitude: -23, longitude: -46 },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            },
            responsavel: {
                nome: 'Ana',
                dataDeNascimento: new Date('1980-01-01T00:00:00.000Z'),
                parentesco: PARENTESCOS[0],
                situacaoOcupacional: 'Empregado',
                escolaridade: ESCOLARIDADES[4],
                cronico: false,
                medicacao: false,
                sexo: SEXOS[1],
                raca: RACAS[2],
                estadoCivil: ESTADOS_CIVIS[0]
            }
        })).rejects.toThrow('falha');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });
});
