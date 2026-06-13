import { pool } from '../db/connection.ts';
import type {
    BuscarFamiliaDto,
    CreateNucleoFamiliarDto,
    FamiliaBuscaResultadoDto,
    FamiliaMoradiaHistoricoDto,
    NucleoFamiliarCriado,
    PessoaFamiliaHistoricoDto,
    VincularMoradiaFamiliaDto,
    VincularPessoaFamiliaDto
} from '../dtos/familia.dto';
import { HttpError } from '../errors/http-error';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { IPessoaRepository } from '../interfaces/repositories/pessoa.repository.interface';
import type { IPetRepository } from '../interfaces/repositories/pet.repository.interface';
import type { IFamiliaService } from '../interfaces/services/familia.service.interface';
import type { Familia, FamiliaMoradia, PessoaFamilia } from '../models/familia.model';
import type { Pessoa } from '../models/pessoa.model';
import type { Moradia } from '../models/moradia.model';
import type { Pet } from '../models/pet.model';
import type { Foto } from '../models/foto.model';
import {
    validateNucleoFamiliarPayload,
    validateVincularMoradiaFamiliaPayload,
    validateVincularPessoaFamiliaPayload
} from '../validations/familia.validation';

function isParentescoResponsavel(value: unknown): boolean {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase() === 'RESPONSAVEL';
}

export class FamiliaService implements IFamiliaService {
    constructor(
        private familiaRepo: IFamiliaRepository,
        private moradiaRepo: IMoradiaRepository,
        private pessoaRepo: IPessoaRepository,
        private petRepo: IPetRepository,
        private fotoRepo: IFotoRepository
    ) {}

    async getAll(): Promise<Familia[]> {
        return this.familiaRepo.getAll();
    }

    async buscar(filtros: BuscarFamiliaDto): Promise<FamiliaBuscaResultadoDto[]> {
        return this.familiaRepo.search(filtros);
    }

    async getById(id: number): Promise<Familia> {
        const familia = await this.familiaRepo.getById(id);
        if (!familia) {
            throw new HttpError(404, 'Família não encontrada');
        }
        return familia;
    }

    async cadastrar(): Promise<Familia> {
        return this.familiaRepo.create();
    }

    async remover(id: number): Promise<void> {
        await this.getById(id);
        await this.familiaRepo.delete(id);
    }

    async getPessoas(idFamilia: number): Promise<Pessoa[]> {
        await this.getById(idFamilia);
        return this.familiaRepo.getPessoas(idFamilia);
    }

    async getHistoricoPessoas(idFamilia: number): Promise<PessoaFamiliaHistoricoDto[]> {
        await this.getById(idFamilia);
        return this.familiaRepo.getHistoricoPessoas(idFamilia);
    }

    async getMoradias(idFamilia: number): Promise<Moradia[]> {
        await this.getById(idFamilia);
        return this.familiaRepo.getMoradias(idFamilia);
    }

    async getHistoricoMoradias(idFamilia: number): Promise<FamiliaMoradiaHistoricoDto[]> {
        await this.getById(idFamilia);
        return this.familiaRepo.getHistoricoMoradias(idFamilia);
    }

    async vincularPessoa(idFamilia: number, data: VincularPessoaFamiliaDto): Promise<PessoaFamilia> {
        validateVincularPessoaFamiliaPayload(data);
        await this.getById(idFamilia);
        const pessoa = await this.pessoaRepo.getById(data.idPessoa);
        if (!pessoa) {
            throw new HttpError(404, 'Pessoa não encontrada');
        }
        if (isParentescoResponsavel(pessoa.parentesco)) {
            const responsavel = await this.pessoaRepo.getResponsavelByPessoaId(data.idPessoa);
            if (!responsavel) {
                throw new HttpError(400, 'Pessoa com parentesco Responsavel deve existir na tabela responsavel');
            }

            const responsavelAtivo = await this.familiaRepo.getResponsavelAtivo(idFamilia);
            if (responsavelAtivo && responsavelAtivo.id !== data.idPessoa) {
                throw new HttpError(409, 'Familia ja possui responsavel ativo');
            }
        }

        return this.familiaRepo.vincularPessoa(idFamilia, data.idPessoa, data.dataEntrada ?? null);
    }

    async removerPessoa(idFamilia: number, idPessoa: number): Promise<PessoaFamilia> {
        await this.getById(idFamilia);
        const vinculo = await this.familiaRepo.removerPessoa(idFamilia, idPessoa);
        if (!vinculo) {
            throw new HttpError(404, 'Vínculo pessoa-família ativo não encontrado');
        }
        return vinculo;
    }

    async vincularMoradia(idFamilia: number, data: VincularMoradiaFamiliaDto): Promise<FamiliaMoradia> {
        validateVincularMoradiaFamiliaPayload(data);
        await this.getById(idFamilia);
        const moradia = await this.moradiaRepo.getById(data.idMoradia);
        if (!moradia) {
            throw new HttpError(404, 'Moradia não encontrada');
        }
        const familiasAtivasNaMoradia = await this.familiaRepo.getFamiliasByMoradia(data.idMoradia);
        if (familiasAtivasNaMoradia.length > 0) {
            const jaVinculadaNestaFamilia = familiasAtivasNaMoradia.some((familia) => familia.id === idFamilia);
            throw new HttpError(
                409,
                jaVinculadaNestaFamilia
                    ? 'Família já está vinculada a esta moradia'
                    : 'Moradia já possui família ativa'
            );
        }
        return this.familiaRepo.vincularMoradia(idFamilia, data.idMoradia, data.dataEntrada ?? null, data.status ?? null);
    }

    async removerMoradia(idFamilia: number, idMoradia: number): Promise<FamiliaMoradia> {
        await this.getById(idFamilia);
        const vinculo = await this.familiaRepo.removerMoradia(idFamilia, idMoradia);
        if (!vinculo) {
            throw new HttpError(404, 'Vínculo família-moradia ativo não encontrado');
        }
        return vinculo;
    }

    async cadastrarNucleoFamiliar(data: CreateNucleoFamiliarDto): Promise<NucleoFamiliarCriado> {
        validateNucleoFamiliarPayload(data);
        const client = await pool.connect();
        const dataEntrada = data.dataEntrada ?? new Date();

        try {
            await client.query('BEGIN');

            const familia = await this.familiaRepo.create(client);
            const localizacao = data.localizacao && data.moradia
                ? await this.moradiaRepo.createLocalizacao(data.localizacao, client)
                : null;
            const moradia = localizacao && data.moradia
                ? await this.moradiaRepo.create(
                    {
                        ...data.moradia,
                        idLocalizacao: localizacao.id,
                        status: data.moradia.status ?? 'Ativa',
                        pavimentos: data.moradia.pavimentos ?? 1
                    },
                    client
                )
                : null;

            if (moradia) {
                await this.familiaRepo.vincularMoradia(
                    familia.id,
                    moradia.id,
                    dataEntrada,
                    data.statusMoradiaFamilia ?? null,
                    client
                );
            }

            const responsavelPessoa = await this.pessoaRepo.create(
                {
                    ...data.responsavel,
                    nome: data.responsavel.nome.trim(),
                    nomeSocial: data.responsavel.nomeSocial ?? null,
                    parentesco: 'Responsável',
                    status: data.responsavel.status ?? 'Ativo'
                },
                client
            );
            const responsavel = await this.pessoaRepo.createResponsavel(
                {
                    ...data.responsavel,
                    idPessoa: responsavelPessoa.id,
                    veiculo: data.responsavel.veiculo ?? false,
                    programaSocial: data.responsavel.programaSocial ?? false
                },
                client
            );
            await this.familiaRepo.vincularPessoa(familia.id, responsavelPessoa.id, dataEntrada, client);

            const dependentes: Pessoa[] = [];
            for (const dependente of data.dependentes ?? []) {
                const pessoa = await this.pessoaRepo.create(
                    {
                        ...dependente,
                        nome: dependente.nome.trim(),
                        nomeSocial: dependente.nomeSocial ?? null,
                        status: dependente.status ?? 'Ativo'
                    },
                    client
                );
                await this.familiaRepo.vincularPessoa(familia.id, pessoa.id, dataEntrada, client);
                dependentes.push(pessoa);
            }

            const pets: Pet[] = [];
            const fotos: Foto[] = [];
            for (const pet of data.pets ?? []) {
                const petCriado = await this.petRepo.createForFamilia(
                    familia.id,
                    {
                        tipo: pet.tipo,
                        nome: pet.nome.trim(),
                        porte: pet.porte.trim(),
                        raca: pet.raca.trim(),
                        cor: pet.cor.trim(),
                        status: pet.status,
                        observacao: pet.observacao ?? null
                    },
                    client
                );
                pets.push(petCriado);

                for (const foto of pet.fotos ?? []) {
                    fotos.push(
                        await this.fotoRepo.createForPet(
                            petCriado.id,
                            {
                                url: foto.url.trim()
                            },
                            client
                        )
                    );
                }
            }

            for (const foto of data.fotos ?? []) {
                if (!moradia) {
                    throw new HttpError(400, 'Fotos da moradia exigem uma moradia cadastrada');
                }
                fotos.push(
                    await this.fotoRepo.createForMoradia(
                        moradia.id,
                        {
                            url: foto.url.trim()
                        },
                        client
                    )
                );
            }

            await client.query('COMMIT');
            return {
                localizacao,
                moradia,
                familia,
                responsavel,
                dependentes,
                pets,
                fotos
            };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}
