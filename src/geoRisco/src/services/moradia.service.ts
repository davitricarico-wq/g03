import { pool } from '../db/connection.ts';
import type {
    CreateMoradiaComLocalizacaoDto,
    MoradiaDetalhadaDto,
    UpdateMoradiaComLocalizacaoDto
} from '../dtos/moradia.dto';
import type { MoradiaFamiliaHistoricoDto } from '../dtos/familia.dto';
import { HttpError } from '../errors/http-error';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { IFotoRepository } from '../interfaces/repositories/foto.repository.interface';
import type { IMoradiaRepository } from '../interfaces/repositories/moradia.repository.interface';
import type { AvaliarRiscoCriticoDto, IMoradiaService } from '../interfaces/services/moradia.service.interface';
import type { MoradiaComLocalizacao } from '../models/moradia.model';
import { validateLocalizacaoPayload, validateMoradiaPayload } from '../validations/moradia.validation';

const DIAS_RECADASTRO_OBRIGATORIO = 365;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

function normalizarTexto(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

export class MoradiaService implements IMoradiaService {
    constructor(
        private repo: IMoradiaRepository,
        private familiaRepo?: IFamiliaRepository,
        private fotoRepo?: IFotoRepository
    ) {}

    async getAll(): Promise<MoradiaComLocalizacao[]> {
        return this.repo.getAll();
    }

    async getById(id: number): Promise<MoradiaComLocalizacao> {
        const moradia = await this.repo.getById(id);
        if (!moradia) {
            throw new HttpError(404, 'Moradia não encontrada');
        }
        return moradia;
    }

    async getDetalhes(id: number): Promise<MoradiaDetalhadaDto> {
        if (!this.familiaRepo || !this.fotoRepo) {
            throw new HttpError(500, 'Dependencias de detalhe de moradia nao configuradas');
        }

        const moradia = await this.getById(id);
        const [familias, fotos] = await Promise.all([
            this.familiaRepo.getFamiliasByMoradia(id),
            this.fotoRepo.getByMoradia(id)
        ]);
        const detalhes = await Promise.all(
            familias.map(async (familia) => {
                const [pessoas, pets] = await Promise.all([
                    this.familiaRepo!.getPessoas(familia.id),
                    this.familiaRepo!.getPets(familia.id)
                ]);
                return { familia, pessoas, pets };
            })
        );

        return {
            moradia,
            familias: detalhes,
            fotos
        };
    }

    async getHistoricoFamilias(id: number): Promise<MoradiaFamiliaHistoricoDto[]> {
        if (!this.familiaRepo) {
            throw new HttpError(500, 'Dependencias de historico de moradia nao configuradas');
        }

        await this.getById(id);
        return this.familiaRepo.getHistoricoFamiliasByMoradia(id);
    }

    deveAlertarRecadastro(ultimaAtualizacao: Date, referencia = new Date()): boolean {
        if (!(ultimaAtualizacao instanceof Date) || Number.isNaN(ultimaAtualizacao.getTime())) {
            throw new HttpError(400, 'Data de atualizacao invalida');
        }
        if (!(referencia instanceof Date) || Number.isNaN(referencia.getTime())) {
            throw new HttpError(400, 'Data de referencia invalida');
        }

        const diasSemAtualizacao = Math.floor((referencia.getTime() - ultimaAtualizacao.getTime()) / MS_POR_DIA);
        return diasSemAtualizacao >= DIAS_RECADASTRO_OBRIGATORIO;
    }

    avaliarRiscoCritico(data: AvaliarRiscoCriticoDto): boolean {
        if (!data.possuiHistoricoOcorrencia) {
            return false;
        }

        return data.moradores.some((morador) => {
            const grupos = morador.gruposPrioritarios ?? [];
            return (
                morador.mobilidadeReduzida === true ||
                morador.acamado === true ||
                grupos.some((grupo) => {
                    const normalizado = normalizarTexto(grupo);
                    return normalizado.includes('mobilidade reduzida') || normalizado.includes('acamado');
                })
            );
        });
    }

    async cadastrar(data: CreateMoradiaComLocalizacaoDto): Promise<MoradiaComLocalizacao> {
        validateLocalizacaoPayload(data.localizacao);
        validateMoradiaPayload(data.moradia);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const localizacao = await this.repo.createLocalizacao(data.localizacao, client);
            const moradia = await this.repo.create({ ...data.moradia, idLocalizacao: localizacao.id }, client);
            const created = await this.repo.getById(moradia.id, client);
            if (!created) {
                throw new Error('Moradia criada, mas não encontrada na view de leitura');
            }
            await client.query('COMMIT');
            return created;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async atualizar(id: number, data: UpdateMoradiaComLocalizacaoDto): Promise<MoradiaComLocalizacao> {
        const current = await this.getById(id);
        if (data.localizacao) {
            validateLocalizacaoPayload(data.localizacao, true);
        }
        if (data.moradia) {
            validateMoradiaPayload(data.moradia, true);
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            if (data.localizacao) {
                await this.repo.updateLocalizacao(current.idLocalizacao, data.localizacao, client);
            }
            if (data.moradia) {
                await this.repo.update(id, data.moradia, client);
            }
            const updated = await this.repo.getById(id, client);
            if (!updated) {
                throw new HttpError(404, 'Moradia não encontrada');
            }
            await client.query('COMMIT');
            return updated;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async remover(id: number): Promise<void> {
        await this.getById(id);
        await this.repo.delete(id);
    }
}
