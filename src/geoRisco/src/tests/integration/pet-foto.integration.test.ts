import { FamiliaRepository } from '../../repositories/familia.repository';
import { MoradiaRepository } from '../../repositories/moradia.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { PetRepository } from '../../repositories/pet.repository';
import { FotoRepository } from '../../repositories/foto.repository';
import { uniqueCpf, uniqueSuffix, withTransaction } from './db';
import { ESCOLARIDADES, PARENTESCOS, SITUACOES_OCUPACIONAIS } from '../../models/pessoa.model';
import { TIPOS_CONSTRUCAO, USOS_IMOVEL, SITUACOES_OCUPACAO_MORADIA } from '../../models/moradia.model';

describe('Integração: Pets e Fotos (DB real)', () => {
    it('cria um pet para família e uma foto para pet e moradia', async () => {
        await withTransaction(async (client) => {
            const pessoaRepo = new PessoaRepository(client);
            const familiaRepo = new FamiliaRepository(client);
            const moradiaRepo = new MoradiaRepository(client);
            const petRepo = new PetRepository(client);
            const fotoRepo = new FotoRepository(client);

            // criar pessoa e família
            const pessoa = await pessoaRepo.create({
                nome: uniqueSuffix('PetOwner'),
                cpf: uniqueCpf(),
                dataDeNascimento: new Date('1990-01-01'),
                parentesco: PARENTESCOS[5],
                situacaoOcupacional: SITUACOES_OCUPACIONAIS[0],
                escolaridade: ESCOLARIDADES[0],
                cronico: false,
                medicacao: false,
                status: 'Ativo'
            }, client);

            const familia = await familiaRepo.create(client);
            await familiaRepo.vincularPessoa(familia.id, pessoa.id, null, client);

            // criar pet vinculado à família
            const pet = await petRepo.createForFamilia(familia.id, {
                tipo: 'cachorro',
                nome: 'Rex',
                porte: 'Médio',
                raca: 'SRD',
                cor: 'Marrom',
                status: 'Ativo',
                observacao: 'Amigável'
            }, client);

            expect(pet.id).toBeGreaterThan(0);
            const pets = await petRepo.getByFamilia(familia.id, client);
            expect(pets.some(p => p.id === pet.id)).toBe(true);

            // criar localização e moradia
            const localizacao = await moradiaRepo.createLocalizacao({
                cidade: 'Santo André',
                estado: 'SP',
                latitude: -23.67,
                longitude: -46.54
            }, client);

            const moradia = await moradiaRepo.create({
                idLocalizacao: localizacao.id,
                tipoConstrucao: TIPOS_CONSTRUCAO[0],
                usoImovel: USOS_IMOVEL[0],
                pavimentos: 1,
                situacaoDeOcupacao: SITUACOES_OCUPACAO_MORADIA[0]
            }, client);

            expect(moradia.id).toBeGreaterThan(0);

            // criar foto vinculada ao pet
            const fotoPet = await fotoRepo.createForPet(pet.id, { url: 'https://example.org/pet.jpg' }, client);
            expect(fotoPet.id).toBeGreaterThan(0);
            const fotosDoPet = await fotoRepo.getByPet(pet.id, client);
            expect(fotosDoPet.some(f => f.id === fotoPet.id)).toBe(true);

            // criar foto vinculada à moradia
            const fotoMoradia = await fotoRepo.createForMoradia(moradia.id, { url: 'https://example.org/moradia.jpg' }, client);
            expect(fotoMoradia.id).toBeGreaterThan(0);
            const fotosDaMoradia = await fotoRepo.getByMoradia(moradia.id, client);
            expect(fotosDaMoradia.some(f => f.id === fotoMoradia.id)).toBe(true);

            // leituras finais
            const petById = await petRepo.getById(pet.id, client);
            expect(petById).not.toBeNull();

            const fotoById = await fotoRepo.getById(fotoPet.id, client);
            expect(fotoById).not.toBeNull();
        });
    });
});
