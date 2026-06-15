import express, { Router } from 'express';
import request from 'supertest';
import { FamiliaController } from '../controllers/familia.controller';
import { FotoStorageController } from '../controllers/foto-storage.controller';
import { FotoController } from '../controllers/foto.controller';
import { MoradiaController } from '../controllers/moradia.controller';
import { PessoaController } from '../controllers/pessoa.controller';
import { PetController } from '../controllers/pet.controller';
import { HttpError } from '../errors/http-error';
import type { IFamiliaService } from '../interfaces/services/familia.service.interface';
import type { IFotoStorageService } from '../interfaces/services/foto-storage.service.interface';
import type { IFotoService } from '../interfaces/services/foto.service.interface';
import type { IMoradiaService } from '../interfaces/services/moradia.service.interface';
import type { IPessoaService } from '../interfaces/services/pessoa.service.interface';
import type { IPetService } from '../interfaces/services/pet.service.interface';

function buildApp(router: Router) {
    const app = express();
    app.use(express.json());
    app.use(router);
    return app;
}

function makePessoaRouter(service: jest.Mocked<IPessoaService>) {
    const controller = new PessoaController(service);
    const router = Router();

    router.get('/api/pessoas', controller.getAllJson);
    router.get('/api/pessoas/busca', controller.buscar);
    router.get('/api/pessoas/inativas', controller.getInativas);
    router.get('/api/pessoas/:id', controller.getById);
    router.post('/api/pessoas', controller.criar);
    router.put('/api/pessoas/:id', controller.atualizar);
    router.delete('/api/pessoas/:id', controller.remover);
    router.get('/api/responsaveis', controller.getAllResponsaveis);
    router.get('/api/responsaveis/:id', controller.getResponsavelById);
    router.post('/api/responsaveis', controller.criarResponsavel);
    router.put('/api/responsaveis/:id', controller.atualizarResponsavel);
    router.delete('/api/responsaveis/:id', controller.removerResponsavel);

    return buildApp(router);
}

function makeFamiliaRouter(service: jest.Mocked<IFamiliaService>) {
    const controller = new FamiliaController(service);
    const router = Router();

    router.get('/api/familias', controller.getAll);
    router.get('/api/familias/:id', controller.getById);
    router.post('/api/familias', controller.criar);
    router.delete('/api/familias/:id', controller.remover);
    router.post('/api/familias/nucleo', controller.cadastrarNucleoFamiliar);
    router.get('/api/familias/:id/pessoas/historico', controller.getHistoricoPessoas);
    router.get('/api/familias/:id/pessoas', controller.getPessoas);
    router.post('/api/familias/:id/pessoas', controller.vincularPessoa);
    router.delete('/api/familias/:id/pessoas/:pessoaId', controller.removerPessoa);
    router.get('/api/familias/:id/moradias/historico', controller.getHistoricoMoradias);
    router.get('/api/familias/:id/moradias', controller.getMoradias);
    router.post('/api/familias/:id/moradias', controller.vincularMoradia);
    router.delete('/api/familias/:id/moradias/:moradiaId', controller.removerMoradia);

    return buildApp(router);
}

function makeMoradiaRouter(service: jest.Mocked<IMoradiaService>) {
    const controller = new MoradiaController(service);
    const router = Router();

    router.get('/api/moradias', controller.getAll);
    router.get('/api/moradias/:id/detalhes', controller.getDetalhes);
    router.get('/api/moradias/:id/familias/historico', controller.getHistoricoFamilias);
    router.get('/api/moradias/:id', controller.getById);
    router.post('/api/moradias', controller.criar);
    router.put('/api/moradias/:id', controller.atualizar);
    router.delete('/api/moradias/:id', controller.remover);

    return buildApp(router);
}

function makePetRouter(service: jest.Mocked<IPetService>) {
    const controller = new PetController(service);
    const router = Router();

    router.get('/api/pets', controller.getAll);
    router.get('/api/pets/:id', controller.getById);
    router.post('/api/pets', controller.criar);
    router.put('/api/pets/:id', controller.atualizar);
    router.delete('/api/pets/:id', controller.remover);
    router.get('/api/familias/:id/pets', controller.getByFamilia);
    router.post('/api/familias/:id/pets', controller.criarNaFamilia);

    return buildApp(router);
}

function makeFotoRouter(
    fotoService: jest.Mocked<IFotoService>,
    storageService: jest.Mocked<IFotoStorageService>
) {
    const controller = new FotoController(fotoService);
    const storageController = new FotoStorageController(storageService);
    const router = Router();

    router.get('/api/fotos', controller.getAll);
    router.get('/api/fotos/:id', controller.getById);
    router.get('/api/fotos/:id/signed-url', storageController.criarUrlAssinadaDaFoto);
    router.put('/api/fotos/:id', controller.atualizar);
    router.delete('/api/fotos/:id', controller.remover);
    router.get('/api/moradias/:id/fotos', controller.getByMoradia);
    router.post('/api/moradias/:id/fotos', controller.criarNaMoradia);
    router.post('/api/moradias/:id/fotos/upload-url', storageController.criarUploadParaMoradia);
    router.delete('/api/moradias/:id/fotos/:fotoId', controller.removerDaMoradia);
    router.get('/api/pets/:id/fotos', controller.getByPet);
    router.post('/api/pets/:id/fotos', controller.criarNoPet);
    router.post('/api/pets/:id/fotos/upload-url', storageController.criarUploadParaPet);
    router.delete('/api/pets/:id/fotos/:fotoId', controller.removerDoPet);

    return buildApp(router);
}

const pessoaPayload = {
    nome: 'Ana',
    dataDeNascimento: '1985-03-20',
    parentesco: 'Responsável',
    situacaoOcupacional: 'Empregado',
    escolaridade: 'Médio Completo',
    cronico: false,
    medicacao: false
};

const moradiaPayload = {
    localizacao: {
        cidade: 'Santo Andre',
        estado: 'SP',
        latitude: -23.66,
        longitude: -46.53
    },
    moradia: {
        tipoConstrucao: 'Alvenaria',
        usoImovel: 'Residencial',
        situacaoDeOcupacao: 'Ocupado'
    }
};

const petPayload = {
    idFamilia: 1,
    tipo: 'Cachorro',
    nome: 'Toto',
    porte: 'Pequeno',
    raca: 'SRD',
    cor: 'Caramelo',
    status: 'Ativo'
};

describe('Controller endpoints - black-box via Supertest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Pessoas e responsaveis', () => {
        let service: jest.Mocked<IPessoaService>;
        let app: ReturnType<typeof buildApp>;

        beforeEach(() => {
            service = {
                getAll: jest.fn(),
                getById: jest.fn(),
                getInativas: jest.fn(),
                buscar: jest.fn(),
                cadastrar: jest.fn(),
                atualizar: jest.fn(),
                remover: jest.fn(),
                getAllResponsaveis: jest.fn(),
                getResponsavelByPessoaId: jest.fn(),
                cadastrarResponsavel: jest.fn(),
                atualizarResponsavel: jest.fn(),
                removerResponsavel: jest.fn()
            };
            app = makePessoaRouter(service);
        });

        it('POST /api/pessoas cobre sucesso, validação, regra violada e 404', async () => {
            service.cadastrar.mockResolvedValueOnce({ id: 1, nome: 'Ana' } as any);
            await request(app).post('/api/pessoas').send(pessoaPayload).expect(201, { id: 1, nome: 'Ana' });

            await request(app).post('/api/pessoas').send({ ...pessoaPayload, nome: '' }).expect(400);
            expect(service.cadastrar).toHaveBeenCalledTimes(1);

            service.cadastrar.mockRejectedValueOnce(new HttpError(409, 'CPF já cadastrado'));
            await request(app).post('/api/pessoas').send(pessoaPayload).expect(409, { error: 'CPF já cadastrado' });

            service.cadastrar.mockRejectedValueOnce(new HttpError(404, 'Família não encontrada'));
            await request(app).post('/api/pessoas').send(pessoaPayload).expect(404, { error: 'Família não encontrada' });
        });

        it('GET/PUT/DELETE /api/pessoas/:id tratam ID inválido e recurso inexistente', async () => {
            service.getById.mockResolvedValueOnce({ id: 1, nome: 'Ana' } as any);
            await request(app).get('/api/pessoas/1').expect(200, { id: 1, nome: 'Ana' });

            await request(app).get('/api/pessoas/abc').expect(400, { error: 'ID inválido' });

            service.atualizar.mockRejectedValueOnce(new HttpError(404, 'Pessoa não encontrada'));
            await request(app).put('/api/pessoas/999').send({ nome: 'Ana' }).expect(404, { error: 'Pessoa não encontrada' });

            service.remover.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/pessoas/1').expect(204);
        });

        it('cobre busca, inativas e endpoints de responsaveis', async () => {
            service.getAll.mockResolvedValueOnce([{ id: 1, nome: 'Ana' }] as any);
            await request(app).get('/api/pessoas').expect(200, [{ id: 1, nome: 'Ana' }]);

            service.buscar.mockResolvedValueOnce([{ id: 2, nome: 'Bia' }] as any);
            await request(app).get('/api/pessoas/busca?nome=Bia&escopo=ativas').expect(200, [{ id: 2, nome: 'Bia' }]);

            service.buscar.mockRejectedValueOnce(new HttpError(400, 'Informe ao menos um filtro de busca'));
            await request(app).get('/api/pessoas/busca').expect(400, { error: 'Informe ao menos um filtro de busca' });

            service.getInativas.mockResolvedValueOnce([{ id: 3, nome: 'Caio' }] as any);
            await request(app).get('/api/pessoas/inativas').expect(200, [{ id: 3, nome: 'Caio' }]);

            service.getAllResponsaveis.mockResolvedValueOnce([{ id: 4, idPessoa: 1 }] as any);
            await request(app).get('/api/responsaveis').expect(200, [{ id: 4, idPessoa: 1 }]);

            service.getResponsavelByPessoaId.mockResolvedValueOnce({ id: 4, idPessoa: 1 } as any);
            await request(app).get('/api/responsaveis/1').expect(200, { id: 4, idPessoa: 1 });

            service.cadastrarResponsavel.mockResolvedValueOnce({ id: 5, idPessoa: 5 } as any);
            await request(app).post('/api/responsaveis').send({
                ...pessoaPayload,
                sexo: 'Feminino',
                raca: 'Parda',
                estadoCivil: 'Solteiro'
            }).expect(201, { id: 5, idPessoa: 5 });

            await request(app).post('/api/responsaveis').send({ ...pessoaPayload }).expect(400);

            service.cadastrarResponsavel.mockRejectedValueOnce(new HttpError(409, 'CPF ja cadastrado'));
            await request(app).post('/api/responsaveis').send({
                ...pessoaPayload,
                sexo: 'Feminino',
                raca: 'Parda',
                estadoCivil: 'Solteiro'
            }).expect(409, { error: 'CPF ja cadastrado' });

            service.atualizarResponsavel.mockResolvedValueOnce({ id: 5, idPessoa: 5 } as any);
            await request(app).put('/api/responsaveis/5').send({ renda: 1200 }).expect(200, { id: 5, idPessoa: 5 });

            service.atualizarResponsavel.mockRejectedValueOnce(new HttpError(404, 'Responsavel nao encontrado'));
            await request(app).put('/api/responsaveis/999').send({ renda: 1200 }).expect(404, { error: 'Responsavel nao encontrado' });

            service.removerResponsavel.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/responsaveis/5').expect(204);
        });
    });

    describe('Familias e vinculos', () => {
        let service: jest.Mocked<IFamiliaService>;
        let app: ReturnType<typeof buildApp>;

        beforeEach(() => {
            service = {
                getAll: jest.fn(),
                getById: jest.fn(),
                cadastrar: jest.fn(),
                remover: jest.fn(),
                getPessoas: jest.fn(),
                getHistoricoPessoas: jest.fn(),
                getMoradias: jest.fn(),
                getHistoricoMoradias: jest.fn(),
                vincularPessoa: jest.fn(),
                removerPessoa: jest.fn(),
                vincularMoradia: jest.fn(),
                removerMoradia: jest.fn(),
                cadastrarNucleoFamiliar: jest.fn(),
                buscar: jest.fn()
            };
            app = makeFamiliaRouter(service);
        });

        it('POST /api/familias/:id/pessoas cobre sucesso, validação, conflito e 404', async () => {
            service.vincularPessoa.mockResolvedValueOnce({ id: 10, idFamilia: 1, idPessoa: 2 } as any);
            await request(app)
                .post('/api/familias/1/pessoas')
                .send({ idPessoa: 2 })
                .expect(201, { id: 10, idFamilia: 1, idPessoa: 2 });

            await request(app).post('/api/familias/x/pessoas').send({ idPessoa: 2 }).expect(400, { error: 'ID inválido' });

            service.vincularPessoa.mockRejectedValueOnce(new HttpError(409, 'Familia ja possui responsavel ativo'));
            await request(app)
                .post('/api/familias/1/pessoas')
                .send({ idPessoa: 2 })
                .expect(409, { error: 'Familia ja possui responsavel ativo' });

            service.vincularPessoa.mockRejectedValueOnce(new HttpError(404, 'Pessoa não encontrada'));
            await request(app).post('/api/familias/1/pessoas').send({ idPessoa: 99 }).expect(404, { error: 'Pessoa não encontrada' });
        });

        it('POST /api/familias/nucleo retorna 201 ou propaga falhas de domínio', async () => {
            service.cadastrarNucleoFamiliar.mockResolvedValueOnce({ familia: { id: 1 } } as any);
            await request(app).post('/api/familias/nucleo').send({
                ...moradiaPayload,
                responsavel: {
                    ...pessoaPayload,
                    sexo: 'Feminino',
                    raca: 'Parda',
                    estadoCivil: 'Solteiro'
                },
                pets: [
                    {
                        tipo: 'Cachorro',
                        nome: 'Toto',
                        porte: 'Pequeno',
                        raca: 'SRD',
                        cor: 'Caramelo',
                        status: 'Ativo',
                        observacao: 'Dócil',
                        fotos: [{ url: 'pet.jpg' }]
                    }
                ],
                fotos: [{ url: 'moradia.jpg' }],
                dataEntrada: '2026-06-12',
                statusMoradiaFamilia: 'Atual'
            }).expect(201, { familia: { id: 1 } });

            await request(app).post('/api/familias/nucleo').send([]).expect(400, { error: 'Payload inválido' });
        });

        it('cobre consulta, criacao, remocao e listagens de sub-recursos de familias', async () => {
            service.getAll.mockResolvedValueOnce([{ id: 1 }] as any);
            await request(app).get('/api/familias').expect(200, [{ id: 1 }]);

            service.getById.mockResolvedValueOnce({ id: 1 } as any);
            await request(app).get('/api/familias/1').expect(200, { id: 1 });

            await request(app).get('/api/familias/x').expect(400, { error: 'ID inválido' });

            service.getById.mockRejectedValueOnce(new HttpError(404, 'Familia nao encontrada'));
            await request(app).get('/api/familias/99').expect(404, { error: 'Familia nao encontrada' });

            service.cadastrar.mockResolvedValueOnce({ id: 2 } as any);
            await request(app).post('/api/familias').send({}).expect(201, { id: 2 });

            service.remover.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/familias/2').expect(204);

            service.getPessoas.mockResolvedValueOnce([{ id: 10 }] as any);
            await request(app).get('/api/familias/1/pessoas').expect(200, [{ id: 10 }]);

            service.getHistoricoPessoas.mockResolvedValueOnce([{ id: 11 }] as any);
            await request(app).get('/api/familias/1/pessoas/historico').expect(200, [{ id: 11 }]);

            service.getMoradias.mockResolvedValueOnce([{ id: 20 }] as any);
            await request(app).get('/api/familias/1/moradias').expect(200, [{ id: 20 }]);

            service.getHistoricoMoradias.mockResolvedValueOnce([{ id: 21 }] as any);
            await request(app).get('/api/familias/1/moradias/historico').expect(200, [{ id: 21 }]);
        });

        it('cobre vinculos e desvinculos de moradia e pessoa', async () => {
            service.removerPessoa.mockResolvedValueOnce({ id: 1, idFamilia: 1, idPessoa: 2 } as any);
            await request(app).delete('/api/familias/1/pessoas/2').expect(200, { id: 1, idFamilia: 1, idPessoa: 2 });

            service.removerPessoa.mockResolvedValueOnce({
                id: 1,
                idFamilia: 1,
                idPessoa: 2,
                aviso: 'A pessoa removida era responsável da família. Um novo responsável deve ser registrado.'
            } as any);
            await request(app).delete('/api/familias/1/pessoas/2').expect(200, {
                id: 1,
                idFamilia: 1,
                idPessoa: 2,
                aviso: 'A pessoa removida era responsável da família. Um novo responsável deve ser registrado.'
            });

            service.removerPessoa.mockRejectedValueOnce(new HttpError(404, 'Vinculo pessoa-familia ativo nao encontrado'));
            await request(app).delete('/api/familias/1/pessoas/99').expect(404, { error: 'Vinculo pessoa-familia ativo nao encontrado' });

            service.vincularMoradia.mockResolvedValueOnce({ id: 2, idFamilia: 1, idMoradia: 3 } as any);
            await request(app).post('/api/familias/1/moradias').send({ idMoradia: 3 }).expect(201, { id: 2, idFamilia: 1, idMoradia: 3 });

            await request(app).post('/api/familias/1/moradias').send({ idMoradia: 'x' }).expect(400, { error: 'ID inválido' });

            service.vincularMoradia.mockRejectedValueOnce(new HttpError(409, 'Associacao incompativel'));
            await request(app).post('/api/familias/1/moradias').send({ idMoradia: 3 }).expect(409, { error: 'Associacao incompativel' });

            service.vincularMoradia.mockRejectedValueOnce(new HttpError(404, 'Moradia nao encontrada'));
            await request(app).post('/api/familias/1/moradias').send({ idMoradia: 99 }).expect(404, { error: 'Moradia nao encontrada' });

            service.removerMoradia.mockResolvedValueOnce({ id: 2, idFamilia: 1, idMoradia: 3 } as any);
            await request(app).delete('/api/familias/1/moradias/3').expect(200, { id: 2, idFamilia: 1, idMoradia: 3 });
        });
    });

    describe('Moradias', () => {
        let service: jest.Mocked<IMoradiaService>;
        let app: ReturnType<typeof buildApp>;

        beforeEach(() => {
            service = {
                getAll: jest.fn(),
                getById: jest.fn(),
                getDetalhes: jest.fn(),
                getHistoricoFamilias: jest.fn(),
                cadastrar: jest.fn(),
                atualizar: jest.fn(),
                remover: jest.fn()
            };
            app = makeMoradiaRouter(service);
        });

        it('POST /api/moradias cobre sucesso, validação, regra violada e 404', async () => {
            service.cadastrar.mockResolvedValueOnce({ id: 1, idLocalizacao: 2 } as any);
            await request(app).post('/api/moradias').send(moradiaPayload).expect(201, { id: 1, idLocalizacao: 2 });

            await request(app).post('/api/moradias').send({ moradia: moradiaPayload.moradia }).expect(400);

            service.cadastrar.mockRejectedValueOnce(new HttpError(409, 'Situação operacional inválida'));
            await request(app).post('/api/moradias').send(moradiaPayload).expect(409, { error: 'Situação operacional inválida' });

            service.cadastrar.mockRejectedValueOnce(new HttpError(404, 'Localização não encontrada'));
            await request(app).post('/api/moradias').send(moradiaPayload).expect(404, { error: 'Localização não encontrada' });
        });

        it('GET/PUT/DELETE /api/moradias/:id cobrem contratos básicos', async () => {
            service.getById.mockResolvedValueOnce({ id: 1 } as any);
            await request(app).get('/api/moradias/1').expect(200, { id: 1 });

            await request(app).put('/api/moradias/0').send({ moradia: {} }).expect(400, { error: 'ID inválido' });

            service.atualizar.mockRejectedValueOnce(new HttpError(404, 'Moradia não encontrada'));
            await request(app).put('/api/moradias/999').send({ moradia: {} }).expect(404, { error: 'Moradia não encontrada' });

            service.remover.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/moradias/1').expect(204);
        });

        it('cobre listagem, detalhes e historico de familias da moradia', async () => {
            service.getAll.mockResolvedValueOnce([{ id: 1 }] as any);
            await request(app).get('/api/moradias').expect(200, [{ id: 1 }]);

            service.getDetalhes.mockResolvedValueOnce({ moradia: { id: 1 }, familias: [], fotos: [] } as any);
            await request(app).get('/api/moradias/1/detalhes').expect(200, { moradia: { id: 1 }, familias: [], fotos: [] });

            service.getDetalhes.mockRejectedValueOnce(new HttpError(404, 'Moradia nao encontrada'));
            await request(app).get('/api/moradias/99/detalhes').expect(404, { error: 'Moradia nao encontrada' });

            service.getDetalhes.mockRejectedValueOnce(new HttpError(500, 'Dependencias de detalhe de moradia nao configuradas'));
            await request(app).get('/api/moradias/1/detalhes').expect(500, { error: 'Dependencias de detalhe de moradia nao configuradas' });

            service.getHistoricoFamilias.mockResolvedValueOnce([{ id: 10 }] as any);
            await request(app).get('/api/moradias/1/familias/historico').expect(200, [{ id: 10 }]);
        });
    });

    describe('Pets', () => {
        let service: jest.Mocked<IPetService>;
        let app: ReturnType<typeof buildApp>;

        beforeEach(() => {
            service = {
                getAll: jest.fn(),
                getById: jest.fn(),
                getByFamilia: jest.fn(),
                cadastrar: jest.fn(),
                cadastrarNaFamilia: jest.fn(),
                atualizar: jest.fn(),
                remover: jest.fn()
            };
            app = makePetRouter(service);
        });

        it('POST /api/pets cobre sucesso, validação, regra violada e 404', async () => {
            service.cadastrar.mockResolvedValueOnce({ id: 1, nome: 'Toto' } as any);
            await request(app).post('/api/pets').send(petPayload).expect(201, { id: 1, nome: 'Toto' });

            await request(app).post('/api/pets').send({ ...petPayload, idFamilia: 'x' }).expect(400, { error: 'ID inválido' });

            service.cadastrar.mockRejectedValueOnce(new HttpError(409, 'Pet já vinculado'));
            await request(app).post('/api/pets').send(petPayload).expect(409, { error: 'Pet já vinculado' });

            service.cadastrar.mockRejectedValueOnce(new HttpError(404, 'Família não encontrada'));
            await request(app).post('/api/pets').send(petPayload).expect(404, { error: 'Família não encontrada' });
        });

        it('cobre listagem, consulta, update, delete e cadastro por familia', async () => {
            service.getAll.mockResolvedValueOnce([{ id: 1, nome: 'Toto' }] as any);
            await request(app).get('/api/pets').expect(200, [{ id: 1, nome: 'Toto' }]);

            service.getById.mockResolvedValueOnce({ id: 1, nome: 'Toto' } as any);
            await request(app).get('/api/pets/1').expect(200, { id: 1, nome: 'Toto' });

            await request(app).get('/api/pets/x').expect(400, { error: 'ID inválido' });

            service.getByFamilia.mockResolvedValueOnce([{ id: 1, nome: 'Toto' }] as any);
            await request(app).get('/api/familias/1/pets').expect(200, [{ id: 1, nome: 'Toto' }]);

            service.cadastrarNaFamilia.mockResolvedValueOnce({ id: 2, nome: 'Luna' } as any);
            await request(app).post('/api/familias/1/pets').send({ ...petPayload, idFamilia: undefined, nome: 'Luna' }).expect(201, { id: 2, nome: 'Luna' });

            service.atualizar.mockResolvedValueOnce({ id: 1, nome: 'Toto Atualizado' } as any);
            await request(app).put('/api/pets/1').send({ nome: 'Toto Atualizado' }).expect(200, { id: 1, nome: 'Toto Atualizado' });

            service.atualizar.mockRejectedValueOnce(new HttpError(404, 'Pet nao encontrado'));
            await request(app).put('/api/pets/99').send({ nome: 'Nada' }).expect(404, { error: 'Pet nao encontrado' });

            service.remover.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/pets/1').expect(204);
        });
    });

    describe('Fotos e storage', () => {
        let fotoService: jest.Mocked<IFotoService>;
        let storageService: jest.Mocked<IFotoStorageService>;
        let app: ReturnType<typeof buildApp>;

        beforeEach(() => {
            fotoService = {
                getAll: jest.fn(),
                getById: jest.fn(),
                getByMoradia: jest.fn(),
                getByPet: jest.fn(),
                cadastrarNaMoradia: jest.fn(),
                cadastrarNoPet: jest.fn(),
                atualizar: jest.fn(),
                remover: jest.fn(),
                removerDaMoradia: jest.fn(),
                removerDoPet: jest.fn()
            };
            storageService = {
                criarUploadParaMoradia: jest.fn(),
                criarUploadParaPet: jest.fn(),
                criarUrlAssinadaDaFoto: jest.fn()
            };
            app = makeFotoRouter(fotoService, storageService);
        });

        it('POST /api/moradias/:id/fotos cobre sucesso, validação, regra violada e 404', async () => {
            fotoService.cadastrarNaMoradia.mockResolvedValueOnce({ id: 1, url: 'moradia.jpg' } as any);
            await request(app).post('/api/moradias/1/fotos').send({ url: 'moradia.jpg' }).expect(201, { id: 1, url: 'moradia.jpg' });

            await request(app).post('/api/moradias/x/fotos').send({ url: 'moradia.jpg' }).expect(400, { error: 'ID inválido' });

            fotoService.cadastrarNaMoradia.mockRejectedValueOnce(new HttpError(409, 'Foto excede limite da moradia'));
            await request(app).post('/api/moradias/1/fotos').send({ url: 'moradia.jpg' }).expect(409, { error: 'Foto excede limite da moradia' });

            fotoService.cadastrarNaMoradia.mockRejectedValueOnce(new HttpError(404, 'Moradia não encontrada'));
            await request(app).post('/api/moradias/999/fotos').send({ url: 'moradia.jpg' }).expect(404, { error: 'Moradia não encontrada' });
        });

        it('POST /api/moradias/:id/fotos/upload-url cobre sucesso e falha externa controlada', async () => {
            storageService.criarUploadParaMoradia.mockResolvedValueOnce({ path: 'x.jpg', signedUrl: 'https://upload.test' } as any);
            await request(app)
                .post('/api/moradias/1/fotos/upload-url')
                .send({ fileName: 'x.jpg', contentType: 'image/jpeg' })
                .expect(201, { path: 'x.jpg', signedUrl: 'https://upload.test' });

            await request(app).post('/api/moradias/0/fotos/upload-url').send({}).expect(400, { error: 'ID inválido' });

            storageService.criarUploadParaMoradia.mockRejectedValueOnce(new HttpError(502, 'Falha ao gerar URL de upload'));
            await request(app)
                .post('/api/moradias/1/fotos/upload-url')
                .send({ fileName: 'x.jpg', contentType: 'image/jpeg' })
                .expect(502, { error: 'Falha ao gerar URL de upload' });
        });

        it('cobre consultas, updates e remocoes de fotos', async () => {
            fotoService.getAll.mockResolvedValueOnce([{ id: 1, url: 'a.jpg' }] as any);
            await request(app).get('/api/fotos').expect(200, [{ id: 1, url: 'a.jpg' }]);

            fotoService.getById.mockResolvedValueOnce({ id: 1, url: 'a.jpg' } as any);
            await request(app).get('/api/fotos/1').expect(200, { id: 1, url: 'a.jpg' });

            await request(app).get('/api/fotos/x').expect(400, { error: 'ID inválido' });

            fotoService.getById.mockRejectedValueOnce(new HttpError(404, 'Foto nao encontrada'));
            await request(app).get('/api/fotos/99').expect(404, { error: 'Foto nao encontrada' });

            fotoService.getByMoradia.mockResolvedValueOnce([{ id: 1, url: 'moradia.jpg' }] as any);
            await request(app).get('/api/moradias/1/fotos').expect(200, [{ id: 1, url: 'moradia.jpg' }]);

            fotoService.getByPet.mockResolvedValueOnce([{ id: 2, url: 'pet.jpg' }] as any);
            await request(app).get('/api/pets/1/fotos').expect(200, [{ id: 2, url: 'pet.jpg' }]);

            fotoService.atualizar.mockResolvedValueOnce({ id: 1, url: 'nova.jpg' } as any);
            await request(app).put('/api/fotos/1').send({ url: 'nova.jpg' }).expect(200, { id: 1, url: 'nova.jpg' });

            fotoService.remover.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/fotos/1').expect(204);

            fotoService.removerDaMoradia.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/moradias/1/fotos/1').expect(204);

            fotoService.removerDoPet.mockResolvedValueOnce(undefined);
            await request(app).delete('/api/pets/1/fotos/2').expect(204);
        });

        it('cobre fotos de pet, upload de pet e URL assinada', async () => {
            fotoService.cadastrarNoPet.mockResolvedValueOnce({ id: 2, url: 'pet.jpg' } as any);
            await request(app).post('/api/pets/1/fotos').send({ url: 'pet.jpg' }).expect(201, { id: 2, url: 'pet.jpg' });

            await request(app).post('/api/pets/x/fotos').send({ url: 'pet.jpg' }).expect(400, { error: 'ID inválido' });

            fotoService.cadastrarNoPet.mockRejectedValueOnce(new HttpError(409, 'Foto ja vinculada'));
            await request(app).post('/api/pets/1/fotos').send({ url: 'pet.jpg' }).expect(409, { error: 'Foto ja vinculada' });

            fotoService.cadastrarNoPet.mockRejectedValueOnce(new HttpError(404, 'Pet nao encontrado'));
            await request(app).post('/api/pets/99/fotos').send({ url: 'pet.jpg' }).expect(404, { error: 'Pet nao encontrado' });

            storageService.criarUploadParaPet.mockResolvedValueOnce({ path: 'pet.jpg', signedUrl: 'https://upload-pet.test' } as any);
            await request(app)
                .post('/api/pets/1/fotos/upload-url')
                .send({ fileName: 'pet.jpg', contentType: 'image/jpeg' })
                .expect(201, { path: 'pet.jpg', signedUrl: 'https://upload-pet.test' });

            storageService.criarUploadParaPet.mockRejectedValueOnce(new HttpError(502, 'Falha ao gerar URL de upload'));
            await request(app)
                .post('/api/pets/1/fotos/upload-url')
                .send({ fileName: 'pet.jpg', contentType: 'image/jpeg' })
                .expect(502, { error: 'Falha ao gerar URL de upload' });

            storageService.criarUrlAssinadaDaFoto.mockResolvedValueOnce({ signedUrl: 'https://read.test' } as any);
            await request(app).get('/api/fotos/1/signed-url?expiresIn=60').expect(200, { signedUrl: 'https://read.test' });

            storageService.criarUrlAssinadaDaFoto.mockRejectedValueOnce(new HttpError(404, 'Foto nao encontrada'));
            await request(app).get('/api/fotos/99/signed-url').expect(404, { error: 'Foto nao encontrada' });
        });
    });
});
