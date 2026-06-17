import { FamiliaService } from '../../services/familia.service';
import { FamiliaRepository } from '../../repositories/familia.repository';
import { MoradiaRepository } from '../../repositories/moradia.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { PetRepository } from '../../repositories/pet.repository';
import { FotoRepository } from '../../repositories/foto.repository';
import { uniqueCpf, uniqueSuffix } from './db';
import {
    ESCOLARIDADES,
    ESTADOS_CIVIS,
    PARENTESCOS,
    RACAS,
    SEXOS,
    SITUACOES_OCUPACIONAIS
} from '../../models/pessoa.model';
import { TIPOS_CONSTRUCAO, USOS_IMOVEL, SITUACOES_OCUPACAO_MORADIA } from '../../models/moradia.model';
import { HttpError } from '../../errors/http-error';

describe('Integração: cadastrarNucleoFamiliar (transacional)', () => {
    it('executa fluxo completo e persiste família/moradia/pessoas/pets/fotos', async () => {
        const familiaRepo = new FamiliaRepository();
        const moradiaRepo = new MoradiaRepository();
        const pessoaRepo = new PessoaRepository();
        const petRepo = new PetRepository();
        const fotoRepo = new FotoRepository();

        const service = new FamiliaService(familiaRepo, moradiaRepo, pessoaRepo, petRepo, fotoRepo);

        const payload: any = {
            localizacao: {
                cidade: 'Santo André',
                estado: 'SP',
                latitude: -23.6,
                longitude: -46.5
            },
            moradia: {
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0],
                pavimentos: 1
            },
            responsavel: {
                nome: uniqueSuffix('Resp'),
                sexo: SEXOS[0],
                raca: RACAS[0],
                estadoCivil: ESTADOS_CIVIS[0],
                dataDeNascimento: new Date('1980-01-01'),
                parentesco: PARENTESCOS[0],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[0],
                cronico: false,
                medicacao: false
            },
            dependentes: [
                {
                    nome: uniqueSuffix('Dep'),
                    dataDeNascimento: new Date('2010-01-01'),
                    parentesco: PARENTESCOS[2],
                    situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                    escolaridade: ESCOLARIDADES[0],
                    cronico: false,
                    medicacao: false
                }
            ],
            pets: [
                {
                    tipo: 'cachorro',
                    nome: 'Bobi',
                    porte: 'Médio',
                    raca: 'SRD',
                    cor: 'Marrom',
                    status: 'Ativo',
                    fotos: [{ url: 'http://pet.jpg' }]
                }
            ],
            fotos: [{ url: 'http://moradia.jpg' }]
        };

        const result = await service.cadastrarNucleoFamiliar(payload);

        // Verificações básicas sobre o retorno
        expect(result.familia).toBeDefined();
        expect(result.moradia).toBeDefined();
        expect(result.responsavel).toBeDefined();
        expect(result.pets.length).toBeGreaterThan(0);
        expect(result.fotos.length).toBeGreaterThan(0);

        const familiaId = result.familia.id;
        const moradiaId = result.moradia!.id;
        const responsavelId = result.responsavel.id;

        // Checar persistência via repositórios
        const familiaDb = await familiaRepo.getById(familiaId);
        expect(familiaDb).not.toBeNull();

        const moradias = await familiaRepo.getMoradias(familiaId);
        expect(moradias.some((m) => m.id === moradiaId)).toBe(true);

        const pessoas = await familiaRepo.getPessoas(familiaId);
        expect(pessoas.some((p) => p.id === responsavelId)).toBe(true);

        const pets = await petRepo.getByFamilia(familiaId);
        expect(pets.length).toBeGreaterThanOrEqual(1);

        const fotosMoradia = await fotoRepo.getByMoradia(moradiaId);
        expect(fotosMoradia.length).toBeGreaterThanOrEqual(1);

        // cleanup: remover dependentes/pets/fotos/pessoa/familia explicitamente
        for (const foto of result.fotos) {
            try { await fotoRepo.delete(foto.id); } catch (_) {}
        }
        for (const pet of result.pets) {
            try { await petRepo.delete(pet.id); } catch (_) {}
        }
        for (const dep of result.dependentes) {
            try { await pessoaRepo.delete(dep.id); } catch (_) {}
        }
        try { await pessoaRepo.delete(responsavelId); } catch (_) {}
        try { await familiaRepo.delete(familiaId); } catch (_) {}
    });

    it('faz ROLLBACK se fotos da moradia são fornecidas sem moradia (lança HttpError)', async () => {
        const familiaRepo = new FamiliaRepository();
        const moradiaRepo = new MoradiaRepository();
        const pessoaRepo = new PessoaRepository();
        const petRepo = new PetRepository();
        const fotoRepo = new FotoRepository();

        const service = new FamiliaService(familiaRepo, moradiaRepo, pessoaRepo, petRepo, fotoRepo);

        const cpf = uniqueCpf();
        const nome = uniqueSuffix('RB');

        const payload: any = {
            responsavel: {
                nome,
                cpf,
                dataDeNascimento: new Date('1980-01-01'),
                parentesco: PARENTESCOS[0],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[0],
                cronico: false,
                medicacao: false,
                sexo: SEXOS[0],
                raca: RACAS[0],
                estadoCivil: ESTADOS_CIVIS[0]
            },
            fotos: [{ url: 'http://moradia.jpg' }]
        };

        await expect(service.cadastrarNucleoFamiliar(payload)).rejects.toBeInstanceOf(HttpError);

        // Assegurar que nada foi persistido: buscar pessoa pelo nome/CPF
        const search = await pessoaRepo.search({ nome }, undefined);
        const foundByCpf = await pessoaRepo.search({ cpf }, undefined);
        expect(search.length).toBe(0);
        expect(foundByCpf.length).toBe(0);
    });
});

