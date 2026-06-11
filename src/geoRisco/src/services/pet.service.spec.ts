import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { Pet } from '../models/pet.model';
import { STATUS_PET, TIPOS_PET } from '../models/pet.model';
import { PetService } from './pet.service';

function pet(overrides: Partial<Pet> = {}): Pet {
    return {
        id: 1,
        idFamilia: 2,
        tipo: TIPOS_PET[0],
        nome: 'Rex',
        porte: 'Medio',
        raca: 'SRD',
        cor: 'Caramelo',
        status: STATUS_PET[0],
        observacao: null,
        ...overrides
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

describe('PetService - testes unitarios de Service', () => {
    it('cadastra pet quando familia existe e normaliza campos', async () => {
        const pets = petRepo();
        const familias = familiaRepo();
        familias.getById.mockResolvedValue({ id: 2, deletedAt: null });
        pets.create.mockResolvedValue(pet());
        const service = new PetService(pets, familias);

        await expect(service.cadastrar({
            idFamilia: 2,
            tipo: TIPOS_PET[0],
            nome: ' Rex ',
            porte: ' Medio ',
            raca: ' SRD ',
            cor: ' Caramelo ',
            status: STATUS_PET[0],
            observacao: ''
        })).resolves.toMatchObject({ nome: 'Rex' });

        expect(pets.create).toHaveBeenCalledWith(expect.objectContaining({
            idFamilia: 2,
            nome: 'Rex',
            observacao: null
        }));
    });

    it('falha para familia invalida, inexistente e pet inexistente', async () => {
        const pets = petRepo();
        const familias = familiaRepo();
        familias.getById.mockResolvedValue(null);
        pets.getById.mockResolvedValue(null);
        const service = new PetService(pets, familias);

        await expect(service.cadastrar({
            idFamilia: 0,
            tipo: TIPOS_PET[0],
            nome: 'Rex',
            porte: 'Medio',
            raca: 'SRD',
            cor: 'Caramelo',
            status: STATUS_PET[0]
        })).rejects.toMatchObject({ statusCode: 400 });
        await expect(service.cadastrarNaFamilia(2, {
            tipo: TIPOS_PET[0],
            nome: 'Rex',
            porte: 'Medio',
            raca: 'SRD',
            cor: 'Caramelo',
            status: STATUS_PET[0]
        })).rejects.toMatchObject({ statusCode: 404 });
        await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lista, atualiza e remove pet existente', async () => {
        const pets = petRepo();
        const familias = familiaRepo();
        pets.getAll.mockResolvedValue([pet()]);
        pets.getById.mockResolvedValue(pet());
        pets.update.mockResolvedValue(pet({ nome: 'Rex II' }));
        const service = new PetService(pets, familias);

        await expect(service.getAll()).resolves.toHaveLength(1);
        await expect(service.atualizar(1, { nome: ' Rex II ' })).resolves.toMatchObject({ nome: 'Rex II' });
        await service.remover(1);

        expect(pets.delete).toHaveBeenCalledWith(1);
    });

    it('lista pets da familia somente quando familia existe', async () => {
        const pets = petRepo();
        const familias = familiaRepo();
        familias.getById.mockResolvedValueOnce({ id: 2, deletedAt: null }).mockResolvedValueOnce(null);
        pets.getByFamilia.mockResolvedValue([pet()]);
        const service = new PetService(pets, familias);

        await expect(service.getByFamilia(2)).resolves.toHaveLength(1);
        await expect(service.getByFamilia(3)).rejects.toMatchObject({ statusCode: 404 });
    });
});
